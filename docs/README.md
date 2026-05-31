# Elucidator

> Structural Solver &mdash; a multivariate solver service and API.

Elucidator is a multivariate solver built with audit-ability and comprehensibility in mind. It was built on the premise that complex solution logic should be decoupled from interactive software in the same way we decouple complex database logic.

> With a Data Access Library (DAL) pattern it should be trivial to change the back-end database engine, indexing strategy and schema without having to rewrite front-end software.

Elucidator applies the same idea to computation &mdash; a **Solution Abstraction Library** (SAL):

> With a Solution Abstraction Library pattern it should be trivial to change the underlying method for computing composite values without having to rewrite front-end software.

## Features

- **Composable Operations** - Chain built-in and custom operations into auditable solution graphs
- **Built-in Namespaces** - Math, PreciseMath, Geometry, Logic, String and Set operations out of the box
- **Arbitrary Precision** - The PreciseMath namespace uses Decimal.js for browser-consistent, mantissa-safe arithmetic
- **Address & Hash Mapping** - Bind your data's natural property names onto generic instruction inputs
- **Auditable Runs** - Every solve produces a templated, human-readable solution log
- **Recursive Control Flow** - Branch and execute other operations with the Logic namespace
- **Browser & Node.js** - Runs anywhere as a Fable service

## Quick Start

```javascript
const libFable = require('fable');
const libElucidator = require('elucidator');

let _Fable = new libFable();
let _Elucidator = new libElucidator(_Fable);

let tmpData = { a: 10, b: 3 };
_Elucidator.solveInternalOperation('PreciseMath', 'Add', tmpData);
// tmpData is now { a: 10, b: 3, x: '13' }
```

The result is written back into the same object at the operation's output address. `PreciseMath` returns its result as a string (arbitrary precision); the plain `Math` namespace returns a native number.

## Installation

```bash
npm install elucidator
```

## How It Works

An **Operation** describes a unit of work with three parts: `Inputs`, `Outputs`, and a list of `Steps`. Each Step either runs a low-level **Instruction** (the code that does the actual work) or recurses into another Operation. The data object flows through every Step, and results are written back into it.

```javascript
// Solve a built-in operation by namespace + operation hash
_Elucidator.solveInternalOperation('Geometry', 'RectangleArea', { Width: 10, Height: 2 });
// -> { Width: 10, Height: 2, Area: '20', Ratio: '5' }
```

A Step maps the operation's data addresses onto the short hashes its instruction expects:

```json
{
	"Namespace": "PreciseMath",
	"Instruction": "multiply",
	"InputHashAddressMap": { "a": "Width", "b": "Height" },
	"OutputHashAddressMap": { "x": "Area" }
}
```

You can also register your own operations shaped to your data &mdash; see the [Quickstart](quickstart.md).

## Documentation

- [Quickstart](quickstart.md) - A runnable end-to-end example in five minutes
- [Operations](operations.md) - The complete built-in operation reference
- [API](api.md) - The Elucidator service and Operation/Step schema

## Related Modules

- [precedent](https://fable-retold.github.io/precedent/) - Meta-templating engine behind the solution log substitutions
- [manyfest](https://fable-retold.github.io/manyfest/) - Object description and address-based navigation library
- [fable](https://fable-retold.github.io/fable/) - Service dependency injection framework
