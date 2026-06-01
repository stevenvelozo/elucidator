# Operations

This is the complete reference for the operations Elucidator registers by default. Operations are grouped into **namespaces**. You call one with `solveInternalOperation(namespace, operation, dataObject)`; the result is written back into `dataObject` at the operation's output address.

Namespace and operation hashes are matched **case-insensitively** - `RectangleArea`, `rectanglearea` and `RECTANGLEAREA` all resolve to the same operation.

The six default namespaces are: `Math`, `PreciseMath`, `Geometry`, `Logic`, `String` and `Set`.

> There is no `Array`, `Flow` or `Object` namespace. Array-style aggregation lives in `Math` / `PreciseMath` (the `Aggregate` operation reads scalars, arrays, or objects), and branching lives in `Logic`.

## Math

Plain JavaScript-number arithmetic. Inputs are read by hash and the result is a native JavaScript number written to the output hash.

| Operation | Inputs | Output | Description |
| --------- | ------ | ------ | ----------- |
| Add | `a`, `b` | `x` | Add two numbers: `x = a + b`. |
| Subtract | `a`, `b` | `x` | Subtract two numbers: `x = a - b`. |
| Multiply | `a`, `b` | `x` | Multiply two numbers: `x = a * b`. |
| Divide | `a`, `b` | `x` | Divide two numbers: `x = a / b`. |
| Aggregate | `a` | `x` | Sum every numeric value found at `a`. `a` may be a scalar, an array, or an object of values; non-numeric entries are skipped and noted in the solution log. |

```javascript
let tmpData = { a: 1, b: 2 };
_Elucidator.solveInternalOperation('Math', 'Add', tmpData);
// tmpData.x === 3   (native number)

let tmpSet = { a: [100, 200, 50, 3, 5] };
_Elucidator.solveInternalOperation('Math', 'Aggregate', tmpSet);
// tmpSet.x === 358
```

## PreciseMath

Arbitrary-precision arithmetic backed by [Decimal.js](https://mikemcl.github.io/decimal.js/). Use this namespace when floating-point rounding error matters (currency, measurements, cross-browser consistency). **Results are returned as strings.**

| Operation | Inputs | Output | Description |
| --------- | ------ | ------ | ----------- |
| Add | `a`, `b` | `x` | Precisely add two numbers: `x = a + b`. |
| Subtract | `a`, `b` | `x` | Precisely subtract two numbers: `x = a - b`. |
| Multiply | `a`, `b` | `x` | Precisely multiply two numbers: `x = a * b`. |
| Divide | `a`, `b` | `x` | Precisely divide two numbers: `x = a / b`. |
| Aggregate | `a` | `x` | Precisely sum every numeric value found at `a` (scalar, array, or object of values). |
| GroupValuesAndAggregate | `inputDataSet`, `groupByProperty`, `groupValueProperty`, `recordIndicatorProperty` | `outputDataSet` | Group the objects in `inputDataSet` by the value of `groupByProperty`, then sum each group's `groupValueProperty`. Produces a `{ group: total }` map of strings. |
| Round | `a`, `precision`, `roundingmode` | `x` | Round `a` using the supplied precision and rounding mode. |
| ToDecimalPlaces | `a`, `decimalplaces`, `roundingmode` | `x` | Round `a` to a fixed number of decimal places (default `2`). |
| ToSignificantDigits | `a`, `digits`, `roundingmode` | `x` | Round `a` to a number of significant digits (default `12`). |
| SetPrecision | `precision` | _(none)_ | Set the global Decimal.js precision (default `2`) used by subsequent operations. |
| SetRoundingMode | `roundingmode` | _(none)_ | Set the global Decimal.js rounding mode (default `ROUND_HALF_UP`) used by subsequent operations. |

```javascript
let tmpData = { a: [100, '200.10293112', 50, '3.01', 5] };
_Elucidator.solveInternalOperation('PreciseMath', 'Aggregate', tmpData);
// tmpData.x === '358.11293112'   (string)
```

### Rounding modes

The `roundingmode` input (and the `SetRoundingMode` operation) accepts the following values, matched case-insensitively:

`ROUND_UP`, `ROUND_DOWN`, `ROUND_CEIL`, `ROUND_FLOOR`, `ROUND_HALF_UP`, `ROUND_HALF_DOWN`, `ROUND_HALF_EVEN`, `ROUND_HALF_CEIL`, `ROUND_HALF_FLOOR`, `EUCLID`.

### Grouped aggregation

```javascript
let tmpData = {
	inputDataSet: [
		{ SetName: 'Food',  Value: 100 },
		{ SetName: 'Drink', Value: 100 },
		{ SetName: 'Food',  Value: 11 },
		{ SetName: 'Drink', Value: 200.132 },
		{ SetName: 'Food',  Value: 13.12 }
	],
	groupByProperty: 'SetName',
	groupValueProperty: 'Value'
};
_Elucidator.solveInternalOperation('PreciseMath', 'GroupValuesAndAggregate', tmpData);
// tmpData.outputDataSet === { Food: '124.12', Drink: '300.132' }
```

## Geometry

Higher-order geometry operations composed from `PreciseMath` instructions. Because the work is done in `PreciseMath`, the outputs are strings.

| Operation | Inputs | Outputs | Description |
| --------- | ------ | ------- | ----------- |
| RectangleArea | `Width`, `Height` | `Area`, `Ratio` | Compute the area (`Width * Height`) and aspect ratio (`Width / Height`) of a rectangle. |

```javascript
let tmpData = { Width: 10, Height: 2 };
_Elucidator.solveInternalOperation('Geometry', 'RectangleArea', tmpData);
// tmpData === { Width: 10, Height: 2, Area: '20', Ratio: '5' }
```

> Geometry registers **no instructions of its own** - `RectangleArea` is an example of an operation built entirely from other namespaces' instructions.

## Logic

Control flow. These operations can recurse into other operations, which makes branching and chaining possible from configuration alone.

| Operation | Inputs | Output | Description |
| --------- | ------ | ------ | ----------- |
| If | `leftValue`, `rightValue`, `comparator`, `trueNamespace`, `trueOperation`, `falseNamespace`, `falseOperation` | `truthinessResult` | Compare `leftValue` and `rightValue` using `comparator`. Writes the boolean result to `truthinessResult`, then runs the true-branch operation when true, or the false-branch operation when false. Branch operations default to `logic` / `noop` (do nothing). |
| Execute | `namespace`, `operation` | _(varies)_ | Run another operation identified by `namespace` + `operation`, sharing the current input/output object. |

### Comparators

The `comparator` input accepts any of these (aliases on the same row are equivalent):

| Comparison | Accepted values |
| ---------- | --------------- |
| Equal | `==`, `eq`, `equal` |
| Not equal | `!=`, `noteq`, `notequal` |
| Strict equal (identity) | `===`, `id`, `identity` |
| Greater than | `>`, `gt`, `greaterthan` |
| Greater than or equal | `>=`, `gte`, `greaterthanorequal` |
| Less than | `<`, `lt`, `lessthan` |
| Less than or equal | `<=`, `lte`, `lessthanorequal` |

```javascript
// Branch: add if equal, subtract if not.
let tmpData = {
	leftValue: 10, rightValue: 10, comparator: '==',
	trueNamespace: 'Math', trueOperation: 'Add',
	falseNamespace: 'Math', falseOperation: 'Subtract',
	a: 1000, b: 215
};
_Elucidator.solveInternalOperation('Logic', 'If', tmpData);
// tmpData.truthinessResult === true, tmpData.x === 1215

// Execute another operation indirectly.
let tmpExec = { namespace: 'Math', operation: 'add', a: 60, b: 33 };
_Elucidator.solveInternalOperation('Logic', 'Execute', tmpExec);
// tmpExec.x === 93
```

## String

Basic string manipulation. Each reads `inputString` and writes `outputString`.

| Operation | Inputs | Output | Description |
| --------- | ------ | ------ | ----------- |
| Trim | `inputString` | `outputString` | Remove leading and trailing whitespace. |
| Replace | `inputString`, `searchFor`, `replaceWith` | `outputString` | Replace the first occurrence of `searchFor` with `replaceWith`. |
| Substring | `inputString`, `indexStart`, `indexEnd` | `outputString` | Return the characters from `indexStart` up to the optional `indexEnd`. `indexStart` defaults to `0`; if `indexEnd` is omitted the substring runs to the end of the string. |

```javascript
let tmpData = { inputString: '   Weird whitespace abounds. ' };
_Elucidator.solveInternalOperation('String', 'Trim', tmpData);
// tmpData.outputString === 'Weird whitespace abounds.'

let tmpSub = { inputString: 'No whitespace abounds.', indexStart: 8, indexEnd: 13 };
_Elucidator.solveInternalOperation('String', 'Substring', tmpSub);
// tmpSub.outputString === 'space'
```

## Set

Set/collection manipulation.

| Operation | Inputs | Output | Description |
| --------- | ------ | ------ | ----------- |
| GroupValuesBy | `inputDataSet`, `groupByProperty`, `groupValueProperty` | `outputDataSet` | Group the objects in `inputDataSet` by the value of `groupByProperty`, collecting each group's `groupValueProperty` into an array. Produces a `{ group: [values] }` map. |

```javascript
let tmpData = {
	inputDataSet: [
		{ SetName: 'Food',  Value: 100 },
		{ SetName: 'Drink', Value: 100 },
		{ SetName: 'Food',  Value: 11 },
		{ SetName: 'Drink', Value: 200 }
	],
	groupByProperty: 'SetName',
	groupValueProperty: 'Value'
};
_Elucidator.solveInternalOperation('Set', 'GroupValuesBy', tmpData);
// tmpData.outputDataSet === { Food: [100, 11], Drink: [100, 200] }
```

## Instructions vs. Operations

Every operation in the tables above is a thin wrapper over a same-named **instruction** that does the work. Instructions are the endpoints of a solve - they never recurse. A few namespaces register extra instructions beyond their operations:

- **Math** and **PreciseMath** register short instruction aliases: `sub` (subtract), `mul` (multiply), `div` (divide). These are usable inside a Step's `Instruction` field but have no stand-alone operation.
- **PreciseMath** registers a `tofraction` instruction (convert a value to its `numerator/denominator` string form). It has **no** corresponding operation - use it as a Step instruction only.
- **Logic** and **Set** register the base `noop` instruction (do nothing), which `Logic.If` uses as the default branch target.

See [API](api.md) for how Steps reference instructions and operations.
