# Structural Solver

> **[&#9654; Read the Elucidator Documentation](https://stevenvelozo.github.io/elucidator/)** &mdash; interactive docs with the full API reference.

This library is a multivariate solver with audit-ability and comprehensibility in mind.  It was built on the premise that we should be decoupling complex solution logic from interactive software in the same way we decouple complex database logic.

Said another way:

> With a Data Access Library (DAL) pattern it should be trivial to change the back-end database engine, indexing strategy and schema without having to rewrite front-end software.

Similarly with this Solver library/API:

> With a Solution Abstraction Library pattern it should be trivial to change the underlying method for computing composite values without having to rewrite front-end software.

## Installation

```bash
npm install elucidator
```

## Basic Usage

Elucidator is a fable service.  It can be initialized either directly, with a passed-in fable.  Or.  As a full-fledged service (which is a preferable pattern, as it will be accessible to other fable services then).

### Initializing the Library Directly

```javascript
const libFable = require('fable');
const libElucidator = require('elucidator');

let _Fable = new libFable();
let _Elucidator = new libElucidator(_Fable);

let tmpInput = { a: 10, b: 3 };

let tmpInstructionSet = 'PreciseMath';
let tmpInstruction = 'Add';

console.log(`Testing instruction [${tmpInstructionSet}]::[${tmpInstruction}] with the following data: ${JSON.stringify(tmpInput)}`);

_Elucidator.solveInternalOperation(tmpInstructionSet, tmpInstruction, tmpInput);

console.log(`Outcome: ${JSON.stringify(tmpInput)}`);
```

Which produces the output:

```
Testing instruction [PreciseMath]::[Add] with the following data: {"a":10,"b":3}
Outcome: {"a":10,"b":3,"x":"13"}
```

What an insanely complex way to add two numbers!

> Note that the `PreciseMath` namespace returns its result as a **string** (`"13"`), because it uses arbitrary-precision Decimal.js arithmetic.  The plain `Math` namespace returns a native JavaScript number (`13`).

### Initializing the Library as a Fable Service

Fable services are meant to be composable single-purpose modules.  Service in this case doesn't mean API or web service; it means there are shared functionality with well defined interfaces.  For instance, this library leverages a few fable services to function: logging, object manifest navigation and metatemplating.

```javascript
const libFable = require('fable');

let _Fable = new libFable();

let _Elucidator = _Fable.serviceManager.addAndInstantiateServiceType('Solver', require('elucidator'));

let tmpInput = { a: 10, b: 3 };

let tmpInstructionSet = 'PreciseMath';
let tmpInstruction = 'Add';

console.log(`Testing instruction [${tmpInstructionSet}]::[${tmpInstruction}] with the following data: ${JSON.stringify(tmpInput)}`);

_Elucidator.solveInternalOperation(tmpInstructionSet, tmpInstruction, tmpInput);

console.log(`Outcome: ${JSON.stringify(tmpInput)}`);
```

Which again produces the output:

```
Testing instruction [PreciseMath]::[Add] with the following data: {"a":10,"b":3}
Outcome: {"a":10,"b":3,"x":"13"}
```

Still an insanely complex way to add two numbers.  Anyhow, there are a number of mechanisms for adding the library as a fable service and initializing it (including keeping track of multiple solvers that interact with each other).  Leveraging fable services are documented in the fable documentation; either of these initialization methods work.

## Operations and Instructions

A Solution Abstraction is made up of multiple Instructions and/or Operations, chained together.  The anatomy of an Operation is pretty simple:

| Section | Description |
| ------- | ----------- |
| Description | Identifies the operation.  It carries a `Namespace`, an `Operation` name (used as the `Hash` to call it) and an optional `Synopsis`.  The `Hash` is what you pass to `solveInternalOperation`. |
| Inputs  | Inputs are the variable inputs for a specific operation.  Each input is keyed by an address and described with a `Hash` identifier, a `Type`, and an optional `Default`.  For instance a simple _Rectangle Area Calculation_ might have the inputs of `Width` and `Height`. |
| Outputs | Outputs are the values that are generated when the Operation has completed.  For our _Rectangle Area Calculation_, it might output `Area` and `Ratio`.  Outputs also have types. |
| Steps | Operations are made up of a series of chained-together Steps.  Each Step either runs a built-in `Instruction` (an endpoint that does the actual work) or recurses into another `Operation`.  For our _Rectangle Area Calculation_ a Step would leverage the `PreciseMath` `multiply` Instruction to multiply `Width` by `Height`.  Mixed with Control Flow operations (branching based on basic conditions), solutions can do some pretty complex stuff. |
| Log | Optional `PreOperation` / `PostOperation` templated messages, written into the solution log so the run is auditable. |

When to use an instruction versus operation: you should in general use the instruction as a step if one is available.  Chaining built-in operations together is possible, but, requires great care to make the automatic messaging work.  If you are composing your own operations, shaped to your data, use them as you wish!

### Step Address Mapping

A Step maps the operation's input/output addresses onto the short hashes the underlying instruction expects.  The two keys that do this are:

- **`InputHashAddressMap`** &mdash; an object of `{ "<instruction-hash>": "<operation-address>" }` pairs.  The `PreciseMath` `multiply` instruction reads `a` and `b`, so a Step maps `{ "a": "Width", "b": "Height" }`.
- **`OutputHashAddressMap`** &mdash; the same idea for where the instruction writes its result.  `multiply` writes `x`, so `{ "x": "Area" }` lands the result in `Area`.

Both are plain key/value objects.  (An earlier draft of this document showed these as bare-key arrays such as `{ "Inputs.Width", "Inputs.Height" }` &mdash; that is not valid JSON and will not run.)

### Example Operation: Rectangle Area Calculation

This is the actual built-in _Rectangle Area Calculation_ Operation (`source/InstructionSets/Operations/Geometry-RectangleArea.json`).  It takes in the Width and Height and outputs both Area and Ratio of a rectangle.  It can be called as a `Geometry.RectangleArea` operation, or used as a Step inside a larger solution.

```json
{
	"Description":
	{
		"Namespace": "Geometry",
		"Operation": "RectangleArea",
		"Synopsis": "Solve for the area of a rectangle:  Area = Width * Height"
	},

	"Inputs":
	{
		"Width": { "Hash": "Width", "Type": "Number" },
		"Height": { "Hash": "Height", "Type": "Number" }
	},

	"Outputs":
	{
		"Area": { "Hash": "Area", "Name": "Area of the Rectangle" },
		"Ratio": { "Hash": "Ratio", "Name": "The Ratio between the Width and the Height" }
	},

	"Log":
	{
		"PreOperation": "Solve for [ {{Name:Area}} ] based on [ {{Name:Width}} ] and [ {{Name:Height}} ].",
		"PostOperation": "Operation complete; [ {{Name:Area}} ] = {{InputValue:Width}} * {{InputValue:Height}} = {{OutputValue:Area}}"
	},

	"Steps":
	[
		{
			"Namespace": "PreciseMath",
			"Instruction": "multiply",
			"InputHashAddressMap":
				{
					"a": "Width",
					"b": "Height"
				},
			"OutputHashAddressMap":
				{
					"x": "Area"
				}
		},
		{
			"Namespace": "PreciseMath",
			"Instruction": "divide",
			"InputHashAddressMap":
				{
					"a": "Width",
					"b": "Height"
				},
			"OutputHashAddressMap":
				{
					"x": "Ratio"
				}
		}
	]
}
```

Running it:

```javascript
let tmpData = { Width: 10, Height: 2 };
_Elucidator.solveInternalOperation('Geometry', 'RectangleArea', tmpData);
// tmpData is now { Width: 10, Height: 2, Area: '20', Ratio: '5' }
```

## Built-in Operations

There are a number of built-in operations to use in Solvers, grouped into namespaces.  Operation hashes are matched case-insensitively, so `RectangleArea` and `rectanglearea` both work.

### Math

Plain JavaScript-number arithmetic.  Results are native numbers.

| Operation | Inputs | Output | Description |
| --------- | ------ | ------ | ----------- |
| Add | `a`, `b` | `x` | Add two numbers: `x = a + b`. |
| Subtract | `a`, `b` | `x` | Subtract two numbers: `x = a - b`. |
| Multiply | `a`, `b` | `x` | Multiply two numbers: `x = a * b`. |
| Divide | `a`, `b` | `x` | Divide two numbers: `x = a / b`. |
| Aggregate | `a` | `x` | Sum every numeric value found at `a` (a scalar, an array, or an object of values); non-numeric entries are skipped and logged. |

### PreciseMath

Arbitrary-precision arithmetic provided by the [Decimal.js](https://mikemcl.github.io/decimal.js/) library, consistent across browsers and free of floating-point mantissa issues.  Results are returned as **strings**.

| Operation | Inputs | Output | Description |
| --------- | ------ | ------ | ----------- |
| Add | `a`, `b` | `x` | Precisely add two numbers: `x = a + b`. |
| Subtract | `a`, `b` | `x` | Precisely subtract two numbers: `x = a - b`. |
| Multiply | `a`, `b` | `x` | Precisely multiply two numbers: `x = a * b`. |
| Divide | `a`, `b` | `x` | Precisely divide two numbers: `x = a / b`. |
| Aggregate | `a` | `x` | Precisely sum every numeric value found at `a` (scalar, array, or object of values). |
| GroupValuesAndAggregate | `inputDataSet`, `groupByProperty`, `groupValueProperty` | `outputDataSet` | Group the objects in `inputDataSet` by `groupByProperty`, then sum each group's `groupValueProperty` into a `{ group: total }` map. |
| Round | `a`, `precision`, `roundingmode` | `x` | Round `a` to the configured precision and rounding mode. |
| ToDecimalPlaces | `a`, `decimalplaces`, `roundingmode` | `x` | Round `a` to a fixed number of decimal places (default `2`). |
| ToSignificantDigits | `a`, `digits`, `roundingmode` | `x` | Round `a` to a number of significant digits (default `12`). |
| SetPrecision | `precision` | _(none)_ | Set the global Decimal.js precision for subsequent operations. |
| SetRoundingMode | `roundingmode` | _(none)_ | Set the global Decimal.js rounding mode for subsequent operations. |

Valid `roundingmode` values are `ROUND_UP`, `ROUND_DOWN`, `ROUND_CEIL`, `ROUND_FLOOR`, `ROUND_HALF_UP`, `ROUND_HALF_DOWN`, `ROUND_HALF_EVEN`, `ROUND_HALF_CEIL`, `ROUND_HALF_FLOOR`, and `EUCLID` (matched case-insensitively).

### Geometry

| Operation | Inputs | Outputs | Description |
| --------- | ------ | ------- | ----------- |
| RectangleArea | `Width`, `Height` | `Area`, `Ratio` | Compute the area (`Width * Height`) and aspect ratio (`Width / Height`) of a rectangle, using `PreciseMath` internally. |

### Logic

Control flow.  These operations can recurse into other operations.

| Operation | Inputs | Output | Description |
| --------- | ------ | ------ | ----------- |
| If | `leftValue`, `rightValue`, `comparator`, `trueNamespace`, `trueOperation`, `falseNamespace`, `falseOperation` | `truthinessResult` | Compare `leftValue` and `rightValue` with `comparator`.  Stores the boolean result in `truthinessResult` and, based on it, executes either the true-branch or false-branch operation. |
| Execute | `namespace`, `operation` | _(varies)_ | Run another operation by `namespace` + `operation`, sharing the current input/output object. |

Supported `comparator` values (with aliases): `==` / `eq` / `equal`, `!=` / `noteq` / `notequal`, `===` / `id` / `identity`, `>` / `gt` / `greaterthan`, `>=` / `gte` / `greaterthanorequal`, `<` / `lt` / `lessthan`, `<=` / `lte` / `lessthanorequal`.

### String

Basic string manipulation.

| Operation | Inputs | Output | Description |
| --------- | ------ | ------ | ----------- |
| Trim | `inputString` | `outputString` | Trim leading and trailing whitespace. |
| Replace | `inputString`, `searchFor`, `replaceWith` | `outputString` | Replace the first occurrence of `searchFor` with `replaceWith`. |
| Substring | `inputString`, `indexStart`, `indexEnd` | `outputString` | Extract the characters between `indexStart` and the optional `indexEnd`. |

### Set

| Operation | Inputs | Output | Description |
| --------- | ------ | ------ | ----------- |
| GroupValuesBy | `inputDataSet`, `groupByProperty`, `groupValueProperty` | `outputDataSet` | Group the objects in `inputDataSet` by `groupByProperty`, collecting each group's `groupValueProperty` into an array (a `{ group: [values] }` map). |

## Instructions

Instructions are the low-level code for the solvers.  They do the actual work.  They can be composed with operations.

Not all operations map to instructions, but usually an instruction provider will want to provide a 1:1 mapping between instructions and operations for the start of what they do.  Higher order functions are the next tier beyond this.

Most built-in operations are thin wrappers over a single instruction of the same name.  A few namespaces register extra instruction aliases and instructions that have no top-level operation:

- **Math** and **PreciseMath** register short aliases: `sub` (subtract), `mul` (multiply), `div` (divide).
- **PreciseMath** additionally registers a `tofraction` instruction (convert a value to its fractional string form).  It is available as an instruction inside a Step but has no stand-alone operation.
- **Logic** and **Set** register the base `noop` instruction (no operation).

## Steps

A step is one configuration of an operation which is meant to define a solution.

Steps are discrete.  The operations define the sequence of steps (and eventually instructions) that complete a solution.

This sounds complicated and unnecessary.  This seems complicated and unneecessary.  But it does provide one thing that's really important: the ability to have multiple algorithms bound to a single set of inputs and features.  This system was born as a solution to differing requirements but similar inputs, and a desire to use context-based configuration rather than code to resolve the complexity.  This gives us the ability to use the same code to satisfy multiple customer needs, often with *very* differing business and mathematical rule sets.

# A Simple Example: RunCorpRun

Let's take a simple example.  We have our idea for a hot new startup: RunCorpRun.  We want to revolutionize the world of lap timing technology, leveraging a fusion of applied mathematical prowess and our vision for timer user experience previously unimagined by the human race.  This is going to be the best damn lap timer the technology has ever seen, simultaneously synergizing with every possible user group.

## Our Persona:

Running coaches; typically 15-45 year old people with low to medium technical literacy.  They have a smart phone.  What's important to them is quality running shoes, the smell of fresh air and crushing it on the clay or gravel.

## Our User Story:

```
As a running coach
	I want to time a runner
	as they complete an arbitrary number of laps
	around the race track.
```

## Our User Experience Vignette:

1. Launch the RunCorpRun App
2. Press "Start Timing"
3. Press "Lap Complete" each time the "runner" passes the lap line on the "race track"
4. Press "Done Timing" when the runner completes their final lap

As you can see, this is a very advanced user experience.

## Our Technical Solution

When the user presses "Start Timing", we set the Active Timer to 0 and clear any previously stored Lap Entries.  Further, we start a new timer that shows on the screen.

Whenever the user clicks "Lap Complete" or "Done Timing", we must perform a set of calculations on a series of lap time(s) that the user has collected.

We know it's important to track average lap time for a runner as they loop around a track.  This is our zillion dollar app!  The data could be represented as such (with the units being seconds):

### Basic Example Data

```json
{
	"Runner": "Wile.E.Coyote",
	"Laps":
		[
			{ "LapNumber": 0, "LapTime": 21.509 },
			{ "LapNumber": 1, "LapTime": 22.3 },
			{ "LapNumber": 2, "LapTime": 21.71 },
			{ "LapNumber": 3, "LapTime": 23.622 },
			{ "LapNumber": 4, "LapTime": 22.01 },
			{ "LapNumber": 5, "LapTime": 21.3 },
			{ "LapNumber": 6, "LapTime": 22.43 },
			{ "LapNumber": 7, "LapTime": 24.838 }
		],

	"TotalTime": 179.719,
	"LapCount": 8,
	"AverageLapTime": 22.464875,
	"MinimumLapTime": 21.3,
	"MaximumLapTime": 24.838
}
```

### Our User Interface Calculation Code

Triggered on the press of both the "Lap Complete" and "Done Timing" buttons, the following code is executed:

```javascript
function calculateLapStatistics (Data)
{
	let tmpTotalTime = 0.0;
	let tmpLapCount = 0;
	let tmpMinimumLapTime = 0;
	let tmpMaximumLapTime = 0;

	// Iterate over each lap and calculate statistics
	for (let i = 0; i < Data.Laps.length; i++)
	{
		// The total time the person has been running laps
		tmpTotalTime += Data.Laps[i];
		// The number of laps the person has completed
		tmpLapCount++;

		// Keep track of the smallest lap time
		if (tmpMinimumLapTime > Data.Laps[i])
		{
			tmpMinimumLapTime = Data.Laps[i];
		}

		// Keep track of the largest lap time
		if (tmpMaximumLapTime < Data.Laps[i])
		{
			tmpMaximumLapTime = Data.Laps[i];
		}
	}

	// Stuff the aggregated values back into the object
	Data.TotalTime = tmpTotalTime;
	Data.LapCount = tmpLapCount;

	// Compute the median average
	Data.AverageLapTime = tmpTotalTime / tmpLapCount;

	// Stuff the computed min and max values back into the object
	Data.MinimumLapTime = tmpMinimumLapTime;
	Data.MaximumLapTime = tmpMaximumLapTime;

	return Data;
}
```

This function performs the computation completely separated from the user interface.  It is safe to call as many times as we like, and is idempotent.  There is no bounds or safety checking.  It is already a fairly complex function.

## Launch Day

It is an exciting day for RunCorpRun, launching our flagship lap tracking app.  Users respond favorably to the basic functionality but need a bit more to make it useful.  Our $99.99 lap timer is not doing as well as we hoped in the app store.

## Use Case Refinement

After launch of any software, users start imagining and requesting features.  We have some decisions to make on what persona features we want in our app!  Our user persona was a bit too generic and the software didn't hit the mark with a specific enough target market.  We haven't made our zillions yet.  Stopwatch technology is no longer valued as much as it used to be, we quietly lament.

### Cross Country

The cross country runners have much longer laps, so showing them the results in number of seconds doesn't make sense, and showing six significant digits is not useful to their users.  They would rather see minutes and seconds, with 2 digits of precision on the seconds.

### Sprinters

The sprinters care about high precision laps, so the digits of high precision are key.  Further, they want to see more than just the mean average.  They also want the Median value and the interquartile spread to determine how well the runners are staying within their optimal range.

### Trail Runners

Trail runners want to see hours!  Actual hours for laps.  They are running so far that their data fidelity is different from the other use cases.  But only a few users asked for this, so we might not prioritize this quite yet.

### Unexpected Use Cases

It turns out the software has an unexpected use case that has been valuable to a different type of user.  An asphalt concrete paving company is working to optimize the strides of their compactors as they roll over newly paved segments of roadway.

For some jobs, the distance the compactor rolls has been less efficient due to turn-around times.

The paving companies are eager to use the software for data analysis, but want to track an extra value: stride length.  This will allow them to compute total distance as the following equation:

TotalDistance = StrideLength * LapCount

Since turnaround time is being considered as a part of the lap time, adding this one simple value means they don't need to export the data to excel and track it somewhere else.

## RunCorpRun Version 2.0

Now that we have some new use cases, our design and development team is eager to start to add features to support the workflows our users are requesting.  Only one problem: our calculateLapStatistics function is already complicated.  And if we want to support all of the workflows requested, we have to start making that function insanely complex to understand since it will require branching for inputs, during processing and for the outputs.

# Why Have a Solver Library

Much as we want to use a Data Access Layer (DAL) to abstract away the complexity of persistence and access of data, we want a Solution Abstraction Library (SAL) to prevent spaghetti code on these mathematical solution features as we add complexity and branching.

When we use the word "Solution", we don't mean it in the "Software Solution" sense.  It is meant to convey "Mathematical or Logical Solution" to a problem space with some readable input state, expecting some output state.

This is because right now, the feature requests from our various user personas would most likely be solved by adding a muddy blend of configuration, code in the user interface, new state in the data object and code in this solution function.

Worse yet the more times we go through these iterations, the more complex a mess of entangled dependencies it becomes between the user interface code/layout, mid tier code and data.  Like, what do we even do when we need yards *or* meters?!

## An Expression of Our RunCorpRun Solver v1

The below solver configuration captures the first piece of the v1 code above: it sums the individual `LapTime` values into a single `TotalTime`, leaving the data object ready for downstream average / min / max steps.  The Step uses `InputHashAddressMap` / `OutputHashAddressMap` to bind the operation's data addresses onto the instruction hashes &mdash; `a` is the aggregate's input, `x` is its result.  Note the `Laps[].LapTime` address: the `[]` segment tells [manyfest](https://fable-retold.github.io/manyfest/) to collect that property from every element of the `Laps` array before aggregating.

```json
{
	"Description":
	{
		"Namespace": "RunCorpRun",
		"Operation": "LapStatistics",
		"Synopsis": "Aggregate lap statistics:  TotalTime from a set of Laps."
	},

	"Inputs":
	{
		"Laps": { "Hash": "Laps", "Type": "Set" }
	},

	"Outputs":
	{
		"TotalTime": { "Hash": "TotalTime", "Type": "Number" }
	},

	"Steps":
	[
		{
			"Namespace": "PreciseMath",
			"Instruction": "aggregate",
			"InputHashAddressMap":
				{
					"a": "Laps[].LapTime"
				},
			"OutputHashAddressMap":
				{
					"x": "TotalTime"
				}
		}
	]
}
```

Running this against the lap data above sets `TotalTime` to `"179.719"`.  As the use cases multiply (precise vs. rounded output, grouped aggregation, branching by runner type), you swap or add Steps &mdash; or register an alternate operation under the same inputs &mdash; without rewriting the user-interface code that calls `solveInternalOperation('RunCorpRun', 'LapStatistics', tmpData)`.

## Custom Solvers

You are not limited to the built-in namespaces.  Register your own operation, shaped to your own data, and call it like any other.  The hash translation tables let you keep your data's natural property names while the underlying `Math` / `PreciseMath` instructions keep using `a`, `b`, and `x`.

```javascript
let tmpData = { CarrotCost: 1000, AppleCost: 10 };

let tmpBillSolution =
{
	"Description":
	{
		"Namespace": "Custom",
		"Operation": "BillSolution",
		"Synopsis": "Add up the bill: BillTotal = CarrotCost + AppleCost"
	},

	"Inputs":
	{
		"CarrotCost": { "Hash": "a", "Type": "Number" },
		"AppleCost": { "Hash": "b", "Type": "Number" }
	},

	"Outputs":
	{
		"BillTotal": { "Hash": "x", "Type": "Number" }
	},

	"InputHashTranslationTable":
	{
		"a": "CarrotCost",
		"b": "AppleCost"
	},

	"OutputHashTranslationTable":
	{
		"x": "BillTotal"
	},

	"Steps":
	[
		{
			"Ordinal": 0,
			"Name": "Add",
			"Namespace": "Math",
			"Operation": "add"
		}
	]
};

_Elucidator.solveOperation(tmpBillSolution, tmpData);
// tmpData is now { CarrotCost: 1000, AppleCost: 10, BillTotal: 1010 }
```

See the [Quickstart](https://stevenvelozo.github.io/elucidator/#/quickstart.md) and [API reference](https://stevenvelozo.github.io/elucidator/#/api.md) in the documentation for the full set of patterns.

## Related Modules

- [precedent](https://fable-retold.github.io/precedent/) &mdash; the meta-templating engine that drives Elucidator's `{{Name:}}` / `{{InputValue:}}` / `{{OutputValue:}}` log substitutions.
- [manyfest](https://fable-retold.github.io/manyfest/) &mdash; the object description / address navigation library Elucidator uses to read and write values by hash and address.
- [fable](https://fable-retold.github.io/fable/) &mdash; the service dependency-injection framework Elucidator is built on.

## License

MIT
