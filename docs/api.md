# API Reference

The public surface of Elucidator: the service class, its solve and registration methods, the Operation / Step schema, and the solution context that every solve returns.

Elucidator extends [`fable-serviceproviderbase`](https://fable-retold.github.io/fable/), so it is a Fable service and inherits the standard service members (`this.log`, `this.options`, `this.fable`, `this.Hash`, and so on).

## The Elucidator Class

```javascript
const libFable = require('fable');
const libElucidator = require('elucidator');

let _Fable = new libFable();
let _Elucidator = new libElucidator(_Fable);
```

### Constructor

```javascript
new Elucidator(pFable, pOptions, pServiceHash)
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pFable` | object | A Fable instance. Required - Elucidator uses Fable to instantiate its `Manifest` ([manyfest](https://fable-retold.github.io/manyfest/)) and `MetaTemplate` ([precedent](https://fable-retold.github.io/precedent/)) helpers per solve. |
| `pOptions` | object | Optional service options. If it contains an `OperationSet` object, each property is registered as a custom operation (see [`OperationSet`](#operationset-option) below). |
| `pServiceHash` | string | Optional service hash, passed through to the Fable service base. |

On construction Elucidator calls `loadDefaultInstructionSets()`, which registers the six built-in namespaces: `Math`, `PreciseMath`, `Geometry`, `Logic`, `String` and `Set`.

### Registering as a Fable Service

Instead of constructing it directly, you can register Elucidator as a named Fable service so other services can reach it through dependency injection:

```javascript
const libFable = require('fable');

let _Fable = new libFable();
let _Elucidator = _Fable.serviceManager.addAndInstantiateServiceType('Solver', require('elucidator'));
```

Both initialization styles produce an equivalent solver.

### `OperationSet` Option

Operations passed under `pOptions.OperationSet` are registered into the `Custom` namespace at construction time, keyed by their property name:

```javascript
let _Elucidator = new libElucidator(_Fable,
	{
		"OperationSet":
		{
			"TallyBill": { /* ...operation object... */ }
		}
	});

// Now callable as:
_Elucidator.solveInternalOperation('Custom', 'TallyBill', tmpData);
```

## Solving

### `solveInternalOperation(pNamespace, pOperationHash, pInputObject, ...)`

Run a **registered** operation, identified by namespace and operation hash.

```javascript
solveInternalOperation(pNamespace, pOperationHash, pInputObject,
	pOutputObject, pDescriptionManyfest, pInputAddressMapping, pOutputAddressMapping, pSolutionContext)
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pNamespace` | string | Namespace of the operation (case-insensitive). |
| `pOperationHash` | string | Operation hash within the namespace (case-insensitive). |
| `pInputObject` | object | The data object read from and written to. Required and must be an object. |
| `pOutputObject` | object | Optional. A separate object to write results into; defaults to `pInputObject` (results are written back in place). |
| `pDescriptionManyfest` | object | Optional. A [manyfest](https://fable-retold.github.io/manyfest/) instance describing the data; one is synthesized from the operation's `Inputs` / `Outputs` when omitted. |
| `pInputAddressMapping` | object | Optional. Address remapping applied to the operation's inputs for this call. |
| `pOutputAddressMapping` | object | Optional. Address remapping applied for this call. |
| `pSolutionContext` | object | Optional. Used internally to bind recursive solves together; you normally omit it. |

**Returns:** the [solution context](#the-solution-context) object on success, or `false` if the operation does not exist or `pInputObject` is not an object. A lookup failure is also written to `this.log.error`.

```javascript
let tmpData = { a: 1, b: 2 };
let tmpSolution = _Elucidator.solveInternalOperation('Math', 'Add', tmpData);
// tmpData.x === 3
// tmpSolution.SolutionLog[0] === 'Add a and b, storing the value in x.'
```

### `solveOperation(pOperationObject, pInputObject, ...)`

Run an operation object **directly**, without registering it first. This is the method `solveInternalOperation` delegates to once it has looked the operation up.

```javascript
solveOperation(pOperationObject, pInputObject,
	pOutputObject, pDescriptionManyfest, pInputAddressMapping, pOutputAddressMapping, pSolutionContext)
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pOperationObject` | object | The operation to run (see [Operation Schema](#operation-schema)). It is deep-cloned internally, so the source object is not mutated. |
| `pInputObject` | object | The data object read from and written to. Required and must be an object. |

The remaining parameters (`pOutputObject`, `pDescriptionManyfest`, `pInputAddressMapping`, `pOutputAddressMapping`, `pSolutionContext`) behave exactly as in `solveInternalOperation`.

**Returns:** the [solution context](#the-solution-context) object, or `false` if `pInputObject` is not an object.

```javascript
let tmpData = { CarrotCost: 1000, AppleCost: 10 };
let tmpSolution = _Elucidator.solveOperation(tmpBillSolution, tmpData);
// tmpData.BillTotal === 1010
```

## Registering Operations and Instructions

### `addOperation(pNamespace, pOperationHash, pOperation)`

Register an operation under a namespace and hash so it can later be run by name with `solveInternalOperation`. The namespace is created if it does not already exist.

```javascript
_Elucidator.addOperation('Bill', 'Tally', tmpBillSolution);
_Elucidator.solveInternalOperation('Bill', 'Tally', tmpData);
```

**Returns:** `true` on success, `false` on a validation failure (a non-string namespace/hash, a non-object operation, or a missing/invalid `Description`). Operation hashes are stored lower-cased, so lookups are case-insensitive.

The operation's `Description` is validated and back-filled when registered: a missing `Hash` falls back to the `Operation` value, a missing `Namespace` is set to the registering namespace, and missing `Inputs` / `Outputs` / `Steps` are defaulted to `{}` / `{}` / `[]`.

### `operationExists(pNamespace, pOperationHash)`

Returns `true` if an operation is registered under that namespace and hash (case-insensitive), `false` otherwise. Non-string arguments return `false`.

```javascript
_Elucidator.operationExists('Math', 'Add');   // true
_Elucidator.operationExists('Math', 'Nope');  // false
```

### `loadInstructionSet(cInstructionSet)`

Register an instruction-set **class** (not an instance). Elucidator instantiates it, then calls its `initializeNamespace()`, `initializeInstructions()` and `initializeOperations()` methods. This is how the built-in namespaces are wired up, and how you add your own low-level instructions.

```javascript
_Elucidator.loadInstructionSet(require('./MyInstructionSet.js'));
```

### `loadDefaultInstructionSets()`

Loads the six built-in instruction sets (`Math`, `PreciseMath`, `Geometry`, `Logic`, `String`, `Set`). Called automatically by the constructor; you do not normally call it yourself.

## Instance Properties

| Property | Type | Description |
| -------- | ---- | ----------- |
| `instructionSets` | object | Map of `namespace -> { instructionHash: function }`. The low-level endpoints that do the actual work. |
| `operationSets` | object | Map of `namespace -> { operationHash: operationObject }`. The registered, callable operations. |
| `UUID` | number | A monotonically increasing counter used to tag solutions and operations during a run. |

Plus everything inherited from `fable-serviceproviderbase` (notably `this.log`, `this.options` and `this.fable`).

## Operation Schema

An operation is a plain JavaScript object (or JSON file). These are the keys Elucidator reads:

| Key | Type | Description |
| --- | ---- | ----------- |
| `Description` | object | **Required.** Carries `Namespace`, `Operation` (used as the call `Hash`) and an optional `Synopsis`. |
| `Inputs` | object | Map of input address -> descriptor. Each descriptor has a `Hash`, an optional `Type`, and an optional `Name`. Defaults to `{}`. |
| `Outputs` | object | Map of output address -> descriptor, same shape as `Inputs`. Defaults to `{}`. |
| `Steps` | array | The ordered list of [Steps](#step-schema) the solve runs. Defaults to `[]`. |
| `Log` | object | Optional `PreOperation` / `PostOperation` templated message(s) - a string or an array of strings - pushed into the solution log. |
| `InputHashTranslationTable` | object | Optional solution-wide `{ "<hash>": "<address>" }` translation applied to inputs. |
| `OutputHashTranslationTable` | object | Optional solution-wide translation applied to outputs. |

Log templates are expanded by [precedent](https://fable-retold.github.io/precedent/) and support three patterns: `{{Name:<hash>}}` (the descriptor's human-readable `Name`), `{{InputValue:<hash>}}` (the value read from the input object) and `{{OutputValue:<hash>}}` (the value from the output object).

### Step Schema

Each entry in `Steps` either runs an instruction or recurses into another operation:

| Key | Type | Description |
| --- | ---- | ----------- |
| `Namespace` | string | The namespace of the instruction or operation this Step invokes. |
| `Instruction` | string | The instruction hash to run. **Instructions never recurse** - they are the endpoints of a solve. |
| `Operation` | string \| object | The operation hash to recurse into, or an inline operation object. Mutually exclusive with `Instruction` in practice. |
| `InputHashAddressMap` | object | `{ "<instruction-hash>": "<operation-address>" }` - binds the operation's data addresses onto the hashes the instruction reads. |
| `OutputHashAddressMap` | object | The same idea for where the instruction writes its result. |

A Step that runs an instruction:

```json
{
	"Namespace": "Math",
	"Instruction": "add",
	"InputHashAddressMap": { "a": "CarrotCost", "b": "AppleCost" },
	"OutputHashAddressMap": { "x": "BillTotal" }
}
```

A Step that recurses into another registered operation:

```json
{
	"Namespace": "Math",
	"Operation": "add"
}
```

When a Step uses the `Operation` form with no per-step address maps, value binding falls back to the operation's solution-wide `InputHashTranslationTable` / `OutputHashTranslationTable`.

## The Solution Context

Every successful solve returns a solution context object. It is created on the root solve and threaded through any recursive Steps.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `SolutionGUID` | string | An identifier for this solve, of the form `Solution-<n>`. |
| `SolutionBaseNamespace` | string | The namespace of the root operation. |
| `SolutionBaseOperation` | string | The operation name of the root operation. |
| `SolutionLog` | array | The ordered, human-readable audit trail. Built from `Log` templates plus any `[INFO]` / `[ERROR]` lines instructions emit. |
| `InputHashMapping` | object | The resolved input hash-translation table for the solve (from `InputHashTranslationTable`, or `{}`). |
| `OutputHashMapping` | object | The resolved output hash-translation table for the solve. |

```javascript
let tmpData = { a: 1, b: 2 };
let tmpSolution = _Elucidator.solveInternalOperation('Math', 'Add', tmpData);

tmpSolution.SolutionLog[0];   // 'Add a and b, storing the value in x.'
tmpSolution.SolutionLog[1];   // 'Operation complete: x = 1 + 2 = 3'
```

> Results are written **into the data object**, not returned from the solve. The return value is the solution context (the audit trail), while the computed values land on `pInputObject` (or `pOutputObject`) at the operation's output addresses.

## Custom Instruction Sets

Instruction sets are classes that extend the instruction-set base (`source/Elucidator-InstructionSet.js`) and are registered with [`loadInstructionSet`](#loadinstructionsetcinstructionset). The base class provides:

| Method | Description |
| ------ | ----------- |
| `initializeNamespace(pNamespace)` | Creates empty `instructionSets` / `operationSets` entries for the namespace. |
| `addInstruction(pInstructionHash, fInstructionFunction)` | Registers a low-level instruction function. Returns `true`, or `false` on a bad hash/function. |
| `addOperation(pOperationHash, pOperation)` | Registers an operation in this namespace (with the same validation/back-fill as `Elucidator.addOperation`). |
| `initializeInstructions()` | Override to register your instructions. The base implementation registers a `noop`. |
| `initializeOperations()` | Override to register your operations. The base implementation registers a `noop` operation. |

An instruction function receives a single **instruction state** object. The fields it most commonly uses are:

| Field | Description |
| ----- | ----------- |
| `InputObject` / `OutputObject` | The data objects to read from and write to. |
| `InputManyfest` / `OutputManyfest` | [manyfest](https://fable-retold.github.io/manyfest/) instances scoped to the operation's `Inputs` / `Outputs`; read with `getValueByHash`, write with `setValueByHash`. |
| `Elucidator` | The Elucidator instance (lets an instruction recurse via `solveInternalOperation`). |
| `Operation` | The operation object currently being solved. |
| `SolutionContext` | The shared [solution context](#the-solution-context). |
| `logInfo(pMessage)` / `logError(pMessage)` | Append an `[INFO]` / `[ERROR]` line to the solution log (and, for errors, `this.log.error`). |

The built-in `Math` `add` instruction is a minimal example of the pattern:

```javascript
let add = (pOperation) =>
{
	let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');
	let tmpB = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b');
	pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA + tmpB);
	return true;
};
```

## See Also

- [Quickstart](quickstart.md) - install, construct, and run your first solver
- [Operations](operations.md) - the complete built-in operation reference
