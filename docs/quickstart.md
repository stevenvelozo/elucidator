# Quickstart

Get a solver running in under five minutes. This guide installs Elucidator, constructs it, solves a built-in operation, then defines and runs a custom operation with its own `Step`.

Every snippet below is taken directly from Elucidator's source and test suite.

## Installation

```bash
npm install elucidator
```

Elucidator is a [fable](https://fable-retold.github.io/fable/) service, so it expects a Fable instance. `fable` is the only thing you need to construct one.

## Construct the Solver

Pass a Fable instance to the constructor. Elucidator loads its six built-in namespaces (`Math`, `PreciseMath`, `Geometry`, `Logic`, `String`, `Set`) automatically.

```javascript
const libFable = require('fable');
const libElucidator = require('elucidator');

let _Fable = new libFable();
let _Elucidator = new libElucidator(_Fable);
```

## Solve a Built-in Operation

Call `solveInternalOperation(namespace, operation, dataObject)`. The result is written **back into** `dataObject` at the operation's output address, and the call returns a *solution context* describing the run.

```javascript
let tmpData = { a: 1, b: 2 };

let tmpSolution = _Elucidator.solveInternalOperation('Math', 'Add', tmpData);

// The result is written back into tmpData at the output hash 'x':
//   tmpData.x === 3   (Math returns a native number)
```

Namespace and operation hashes are matched case-insensitively, so `'Math'` / `'math'` and `'Add'` / `'add'` resolve to the same operation.

### Reading the Solution Log

The returned context carries a human-readable `SolutionLog` &mdash; this is the audit trail of the run. For the `Math.Add` operation above it contains:

```javascript
tmpSolution.SolutionLog[0];   // 'Add a and b, storing the value in x.'
tmpSolution.SolutionLog[1];   // 'Operation complete: x = 1 + 2 = 3'
```

The log lines come from the operation's `Log.PreOperation` / `Log.PostOperation` templates, expanded through [precedent](https://fable-retold.github.io/precedent/). See [API](api.md) for the full shape of the solution context.

> `PreciseMath` does the same arithmetic with [Decimal.js](https://mikemcl.github.io/decimal.js/) and returns its result as a **string** (`'3'`), not a native number. Use it when floating-point rounding error matters.

## Define and Run a Custom Operation

You are not limited to the built-in namespaces. An **Operation** is a plain object with a `Description`, optional `Inputs` / `Outputs`, and a list of `Steps`. Each Step either runs a low-level **Instruction** or recurses into another Operation.

Here is a complete, runnable end-to-end example. It tallies a grocery bill by adding `CarrotCost` and `AppleCost` into `BillTotal`. The Step maps the operation's data addresses onto the `a` / `b` / `x` hashes that the `Math` `add` instruction expects, using `InputHashAddressMap` and `OutputHashAddressMap`.

```javascript
const libFable = require('fable');
const libElucidator = require('elucidator');

let _Fable = new libFable();
let _Elucidator = new libElucidator(_Fable);

let tmpBillSolution =
{
	"Description":
	{
		"Namespace": "Custom",
		"Operation": "TallyBill",
		"Synopsis": "Add up the bill: BillTotal = CarrotCost + AppleCost"
	},

	"Inputs":
	{
		"CarrotCost": { "Hash": "CarrotCost", "Type": "Number" },
		"AppleCost": { "Hash": "AppleCost", "Type": "Number" }
	},

	"Outputs":
	{
		"BillTotal": { "Hash": "BillTotal", "Type": "Number" }
	},

	"Steps":
	[
		{
			"Namespace": "Math",
			"Instruction": "add",
			"InputHashAddressMap":
			{
				"a": "CarrotCost",
				"b": "AppleCost"
			},
			"OutputHashAddressMap":
			{
				"x": "BillTotal"
			}
		}
	]
};

let tmpData = { CarrotCost: 1000, AppleCost: 10 };

let tmpSolution = _Elucidator.solveOperation(tmpBillSolution, tmpData);

// tmpData is now { CarrotCost: 1000, AppleCost: 10, BillTotal: 1010 }
```

`InputHashAddressMap` and `OutputHashAddressMap` are plain `{ "<instruction-hash>": "<operation-address>" }` objects. The `Math` `add` instruction reads `a` and `b` and writes `x`; the maps bind those onto your data's natural property names so the underlying instruction never has to know about `CarrotCost` or `BillTotal`.

## Register an Operation for Reuse

`solveOperation` runs an operation object directly. If you want to call the same operation many times by name, register it once with `addOperation(namespace, operationHash, operation)` and then call it through `solveInternalOperation`.

```javascript
// Register the operation under the 'Bill' namespace with the hash 'Tally'.
_Elucidator.addOperation('Bill', 'Tally', tmpBillSolution);

let tmpFirstBill = { CarrotCost: 1000, AppleCost: 10 };
_Elucidator.solveInternalOperation('Bill', 'Tally', tmpFirstBill);
// tmpFirstBill.BillTotal === 1010

let tmpSecondBill = { CarrotCost: 2000, AppleCost: 10 };
_Elucidator.solveInternalOperation('Bill', 'Tally', tmpSecondBill);
// tmpSecondBill.BillTotal === 2010
```

The point of the indirection is that you can swap or add `Steps` &mdash; or register an alternate operation under the same inputs &mdash; without rewriting the code that calls `solveInternalOperation`.

## Constructor-Time Operations

You can also hand operations to the constructor up front. Anything under the `OperationSet` option is registered into the `Custom` namespace, keyed by the property name.

```javascript
let _Elucidator = new libElucidator(_Fable,
	{
		"OperationSet":
		{
			"TallyBill":
			{
				"Description":
				{
					"Namespace": "Custom",
					"Operation": "TallyBill",
					"Synopsis": "Add up the bill: BillTotal = CarrotCost + AppleCost"
				},
				"Steps":
				[
					{
						"Namespace": "Math",
						"Instruction": "add",
						"InputHashAddressMap":
						{
							"a": "CarrotCost",
							"b": "AppleCost"
						},
						"OutputHashAddressMap":
						{
							"x": "BillTotal"
						}
					}
				]
			}
		}
	});

let tmpData = { CarrotCost: 1000, AppleCost: 10 };
_Elucidator.solveInternalOperation('Custom', 'TallyBill', tmpData);
// tmpData.BillTotal === 1010
```

## Next Steps

- [Operations](operations.md) &mdash; the complete reference for every built-in operation, grouped by namespace
- [API](api.md) &mdash; the Elucidator service class, its methods, and the Operation / Step schema

## Related Modules

- [precedent](https://fable-retold.github.io/precedent/) &mdash; the meta-templating engine behind the `{{Name:}}` / `{{InputValue:}}` / `{{OutputValue:}}` solution-log substitutions
- [manyfest](https://fable-retold.github.io/manyfest/) &mdash; the object description and address-navigation library Elucidator uses to read and write values by hash and address
- [fable](https://fable-retold.github.io/fable/) &mdash; the service dependency-injection framework Elucidator is built on
