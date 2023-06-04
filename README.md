# Structural Solver

This library is a multivariate solver with audit-ability and comprehensibility in mind.  It was built on the premise that we should be decoupling complex solution logic from interactive software in the same way we decouple complex database logic.

Said another way:

> With a Data Access Library (DAL) pattern it should be trivial to change the back-end database engine, indexing strategy and schema without having to rewrite front-end software.

Similarly with this Solver library/API:

> With a Solution Abstraction Library pattern it should be trivial to change the underlying method for computing composite values without having to rewrite front-end software.

## Basic Usage

Elucidator is a fable service.  It can be initialized either directly, with a passed-in fable.  Or.  As a full-fledged service (which is a preferable pattern, as it will be accessible to other fable services then).

### Initializing the Library Directly

```
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

### Initializing the Library as a Fable Service

Fable services are meant to be composable single-purpose modules.  Service in this case doesn't mean API or web service; it means there are shared functionality with well defined interfaces.  For instance, this library leverages a few fable services to function: logging, object manifest navigation and metatemplating.

```
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
| Inputs  | Inputs are the variable inputs for a specific operation.  Each input is required to have a unique `Hash` identifier inside the operation.  For instance a simple _Rectangle Area Calculation_ might have the inputs of `Width` and `Height`.  Inputs can have configured types, and options for default values.  Some inputs can be flagged as *required* for the Operation to complete successfully. |
| Outputs | Outputs are the values that are generated when the Operation has completed.  For our _Rectangle Area Calculation_, it might output `Area` and `AspectRatio`.  Outputs also have types. |
| SolutionSteps | Operations are made up of series of chained-together Operations.  For instance our _Rectangle Area Calculation_ solution would leverage the `Math.Multiply` built-in Instruction, to multiply `Width` by `Height`.  There are a number of built-in operations in a number of scopes... the `Math` scope leverages an external library for arbitrary precision math.  Operations can also call previously defined operations.  Mixed with Control Flow operations (branching based on basic conditions), solutions can do some pretty complex stuff. |

When to use an instruction versus operation: you should in general use the instruction as a step if one is available.  Chaining built-in operations together is possible, but, requires great care to make the automatic messaging work.  If you are composing your own operations, shaped to your data, use them as you wish!

### Example Operation: Rectangle Area Calculation

This is a basic _Rectangle Area Calculation_ Operation.  It takes in the Width and Height, and outputs both Area and Ratio of a rectangle.  It can be used in subsequent Solution series as a "Geometry.RectangleArea" SolutionStep.

```
{
	"Description":
	{
		"Scope": "Geometry",
		"Name": "RectangleArea",
		"Description": "Compute the area of a 2 dimensional rectangular space."
	},

	"Inputs": 
	{
		"Width": { "Required": true, "Type": "Float" },
		"Height": { "Required": true, "Type": "Float" }
	},

	"Outputs":
	{
		"Area": { "Type": "Float" },
		"Ratio": { "Type": "Float" }
	},
	
	"SolverSteps":
	[
		{
			"Ordinal": 0,
			"Name": false,

			"SolutionType": "Math",
			"Operation": "Multiply",

			"InputHashAddressMap": 
				{
					"Inputs.Width",
					"Inputs.Height"
				},
			
			"OutputAddressSet":
				[
					"Outputs.Area"
				]
		}
	]
}
```

## Built-in Operations

There are a number of built-in operations to use in Solvers.

### Math

Math Operations are provided by the [BigNumber.js](https://mikemcl.github.io/bignumber.js/) library, which is an arbitrary precision math solver library.  It provides basic math, algebraic helpers, trig and calculus functions.

| Operation | Description |
| ------- | ----------- |
| Add | Add two numbers. |
| Subtract | Subtract two numbers. |
| Multiply | Multiply two numbers. |
| Divide | Divide two numbers. |


### Array

| Operation | Description |
| ------- | ----------- |
| Length | |
| Keys | |

### String

| Operation | Description |
| ------- | ----------- |
| Length | |
| WordCount | |
| Words | |

### Flow

| Operation | Description |
| ------- | ----------- |
| If | |
| Switch | |

### Object

| Operation | Description |
| ------- | ----------- |
| Keys | |

## Instructions

Instructions are the low-level code for the solvers.  They do the actual work.  They can be composed with operations.

Not all operations map to instructions, but usually an instruction provider will want to provide a 1:1 mapping between instructions and operations for the start of what they do.  Higher order functions are the next tier beyond this.

## Steps

A step is one configuration of an operation which is meant to define a solution.

Steps are discrete.  The operations define the sequence of operations (and eventually instructions) that complete a solution.

This sounds complicated and unnecessary.  This seems complicated and unneecessary.  But it does provide one thing that's really important: the ability to have multiple algorithms bound to a single set of inputs and features.  This system was born as a solution to differing requirements but similar inputs, and a desire to use context-based configuration rather than code to resolve the complexity.  This gives us the ability to use the same code to satisfy multiple customer needs, often with *very* differing business and mathematical rule sets.

# A Simple Example: RunCorpRun

Let’s take a simple example.  We have our idea for a hot new startup: RunCorpRun.  We want to revolutionize the world of lap timing technology, leveraging a fusion of applied mathematical prowess and our vision for timer user experience previously unimagined by the human race.  This is going to be the best damn lap timer the technology has ever seen, simultaneously synergizing with every possible user group.

## Our Persona:

Running coaches; typically 15-45 year old people with low to medium technical literacy.  They have a smart phone.  What’s important to them is quality running shoes, the smell of fresh air and crushing it on the clay or gravel.

## Our User Story:

```
As a running coach
	I want to time a runner
	as they complete an arbitrary number of laps
	around the race track.
```

## Our User Experience Vignette:

1. Launch the RunCorpRun App
2. Press “Start Timing”
3. Press “Lap Complete” each time the “runner” passes the lap line on the “race track”
4. Press “Done Timing” when the runner completes their final lap

As you can see, this is a very advanced user experience.

## Our Technical Solution

When the user presses “Start Timing”, we set the Active Timer to 0 and clear any previously stored Lap Entries.  Further, we start a new timer that shows on the screen.

Whenever the user clicks “Lap Complete” or “Done Timing”, we must perform a set of calculations on a series of lap time(s) that the user has collected.

We know it’s important to track average lap time for a runner as they loop around a track.  This is our zillion dollar app!  The data could be represented as such (with the units being seconds):

### Basic Example Data

```
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

Triggered on the press of both the “Lap Complete” and “Done Timing” buttons, the following code is executed:

```
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

After launch of any software, users start imagining and requesting features.  We have some decisions to make on what persona features we want in our app!  Our user persona was a bit too generic and the software didn’t hit the mark with a specific enough target market.  We haven't made our zillions yet.  Stopwatch technology is no longer valued as much as it used to be, we quietly lament.

### Cross Country

The cross country runners have much longer laps, so showing them the results in number of seconds doesn’t make sense, and showing six significant digits is not useful to their users.  They would rather see minutes and seconds, with 2 digits of precision on the seconds.

### Sprinters

The sprinters care about high precision laps, so the digits of high precision are key.  Further, they want to see more than just the mean average.  They also want the Median value and the interquartile spread to determine how well the runners are staying within their optimal range.

### Trail Runners

Trail runners want to see hours!  Actual hours for laps.  They are running so far that their data fidelity is different from the other use cases.  But only a few users asked for this, so we might not prioritize this quite yet.

### Unexpected Use Cases

It turns out the software has an unexpected use case that has been valuable to a different type of user.  An asphalt concrete paving company is working to optimize the strides of their compactors as they roll over newly paved segments of roadway.

For some jobs, the distance the compactor rolls has been less efficient due to turn-around times.

The paving companies are eager to use the software for data analysis, but want to track an extra value: stride length.  This will allow them to compute total distance as the following equation:

TotalDistance = StrideLength * LapCount

Since turnaround time is being considered as a part of the lap time, adding this one simple value means they don’t need to export the data to excel and track it somewhere else.

## RunCorpRun Version 2.0

Now that we have some new use cases, our design and development team is eager to start to add features to support the workflows our users are requesting.  Only one problem: our calculateLapStatistics function is already complicated.  And if we want to support all of the workflows requested, we have to start making that function insanely complex to understand since it will require branching for inputs, during processing and for the outputs.

# Why Have a Solver Library

Much as we want to use a Data Access Layer (DAL) to abstract away the complexity of persistence and access of data, we want a Solution Abstraction Library (SAL) to prevent spaghetti code on these mathematical solution features as we add complexity and branching.

When we use the word “Solution”, we don’t mean it in the “Software Solution” sense.  It is meant to convey “Mathematical or Logical Solution” to a problem space with some readable input state, expecting some output state.

This is because right now, the feature requests from our various user personas would most likely be solved by adding a muddy blend of configuration, code in the user interface, new state in the data object and code in this solution function.

Worse yet the more times we go through these iterations, the more complex a mess of entangled dependencies it becomes between the user interface code/layout, mid tier code and data.  Like, what do we even do when we need yards *or* meters?!

## An Expression of Our RunCorpRun Solver v1

The below solver configuration matches the code above, and allows for variations in solver logic as we continue to iterate.

```
{
	"Inputs": {},

	"Outputs": {},
	
	"SolverSteps":
	[
		{
			"Ordinal": 0,
			"Name": false,

			"SolutionType": "Math",
			"Operation": "Sum",

			"InputAddressSet": {},
			
			"OutputAddressSet": {}
		},
		{
			"Ordinal": 1,
			"Name": false,

			"SolutionType": "Array",
			"Operation": "CountLength",

			"InputAddressSet": {},
			
			"OutputAddressSet": {}
		}
	]
}
```





