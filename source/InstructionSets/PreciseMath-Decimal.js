let libElucidatorInstructionSet = require('../Elucidator-InstructionSet.js');

const libDecimal = require('decimal.js');

let add = (pOperation) =>
{
	// This could be done in one line, but, would be more difficult to comprehend.
	let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
	let tmpB = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b'));
	pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.plus(tmpB).toString());
	return true;
};

let subtract = (pOperation) =>
{
	// This could be done in one line, but, would be more difficult to comprehend.
	let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
	let tmpB = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b'));
	pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.sub(tmpB).toString());
	return true;
};

let multiply = (pOperation) =>
{
	// This could be done in one line, but, would be more difficult to comprehend.
	let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
	let tmpB = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b'));
	pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.mul(tmpB).toString());
	return true;
};

let divide = (pOperation) =>
{
	// This could be done in one line, but, would be more difficult to comprehend.
	let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
	let tmpB = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b'));
	pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.div(tmpB).toString());
	return true;
};

let round = (pOperation) =>
{
	let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));

	let tmpPrecision = parseInt(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'precision'));
	let tmpRoundingMode = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'roundingmode')

	// Eventually don't set this every time...
	if (tmpRoundingMode)
	{
		switch (tmpRoundingMode.toString().toLowerCase())
		{
			case 'round_up':
				libDecimal.set({ rounding: libDecimal.ROUND_UP });
				break;
			case 'round_down':
				libDecimal.set({ rounding: libDecimal.ROUND_DOWN });
				break;
			case 'round_ceil':
				libDecimal.set({ rounding: libDecimal.ROUND_CEIL });
				break;
			case 'round_floor':
				libDecimal.set({ rounding: libDecimal.ROUND_FLOOR });
				break;
			default:
			case 'round_half_up':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_UP });
				break;
			case 'round_half_down':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_DOWN });
				break;
			case 'round_half_even':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_EVEN });
				break;
			case 'round_half_ceil':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_CEIL });
				break;
			case 'round_half_floor':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_FLOOR });
				break;
			case 'euclid':
				libDecimal.set({ rounding: libDecimal.EUCLID });
				break;
		}
	}

	if (!isNaN(tmpPrecision))
	{
		libDecimal.set({ precision: tmpPrecision });
	}

	pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', libDecimal.round(tmpA).toString());
};


let tosignificantdigits = (pOperation) =>
{
	let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));

	let tmpDigits = parseInt(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'digits'));
	let tmpRoundingMode = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'roundingmode')

	// Eventually don't set this every time...
	if (tmpRoundingMode)
	{
		switch (tmpRoundingMode.toString().toLowerCase())
		{
			case 'round_up':
				libDecimal.set({ rounding: libDecimal.ROUND_UP });
				break;
			case 'round_down':
				libDecimal.set({ rounding: libDecimal.ROUND_DOWN });
				break;
			case 'round_ceil':
				libDecimal.set({ rounding: libDecimal.ROUND_CEIL });
				break;
			case 'round_floor':
				libDecimal.set({ rounding: libDecimal.ROUND_FLOOR });
				break;
			default:
			case 'round_half_up':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_UP });
				break;
			case 'round_half_down':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_DOWN });
				break;
			case 'round_half_even':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_EVEN });
				break;
			case 'round_half_ceil':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_CEIL });
				break;
			case 'round_half_floor':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_FLOOR });
				break;
			case 'euclid':
				libDecimal.set({ rounding: libDecimal.EUCLID });
				break;
		}
	}

	if (isNaN(tmpDigits))
	{
		tmpDigits = 12;
	}

	pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.toSignificantDigits(tmpDigits).toString());
};

let todecimalplaces = (pOperation) =>
{
	let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));

	let tmpDecimalPlaces = parseInt(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'decimalplaces'));
	let tmpRoundingMode = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'roundingmode')

	// Eventually don't set this every time...
	if (tmpRoundingMode)
	{
		switch (tmpRoundingMode.toString().toLowerCase())
		{
			case 'round_up':
				libDecimal.set({ rounding: libDecimal.ROUND_UP });
				break;
			case 'round_down':
				libDecimal.set({ rounding: libDecimal.ROUND_DOWN });
				break;
			case 'round_ceil':
				libDecimal.set({ rounding: libDecimal.ROUND_CEIL });
				break;
			case 'round_floor':
				libDecimal.set({ rounding: libDecimal.ROUND_FLOOR });
				break;
			default:
			case 'round_half_up':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_UP });
				break;
			case 'round_half_down':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_DOWN });
				break;
			case 'round_half_even':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_EVEN });
				break;
			case 'round_half_ceil':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_CEIL });
				break;
			case 'round_half_floor':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_FLOOR });
				break;
			case 'euclid':
				libDecimal.set({ rounding: libDecimal.EUCLID });
				break;
		}
	}

	if (isNaN(tmpDecimalPlaces))
	{
		tmpDecimalPlaces = 2;
	}

	pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.toDecimalPlaces(tmpDecimalPlaces).toString());
};

let setprecision = (pOperation) =>
{
	let tmpPrecision = parseInt(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'precision'));

	console.log(tmpPrecision)
	if (!isNaN(tmpPrecision))
	{
		libDecimal.set({ precision: tmpPrecision });
	}
};

let setroundingmode = (pOperation) =>
{
	let tmpRoundingMode = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'roundingmode')

	// Eventually don't set this every time...
	if (tmpRoundingMode)
	{
		switch (tmpRoundingMode.toString().toLowerCase())
		{
			case 'round_up':
				libDecimal.set({ rounding: libDecimal.ROUND_UP });
				break;
			case 'round_down':
				libDecimal.set({ rounding: libDecimal.ROUND_DOWN });
				break;
			case 'round_ceil':
				libDecimal.set({ rounding: libDecimal.ROUND_CEIL });
				break;
			case 'round_floor':
				libDecimal.set({ rounding: libDecimal.ROUND_FLOOR });
				break;
			default:
			case 'round_half_up':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_UP });
				break;
			case 'round_half_down':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_DOWN });
				break;
			case 'round_half_even':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_EVEN });
				break;
			case 'round_half_ceil':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_CEIL });
				break;
			case 'round_half_floor':
				libDecimal.set({ rounding: libDecimal.ROUND_HALF_FLOOR });
				break;
			case 'euclid':
				libDecimal.set({ rounding: libDecimal.EUCLID });
				break;
		}
	}
};

let aggregate = (pOperation) =>
{
	let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');

	let tmpObjectType = typeof (tmpA);

	let tmpAggregationValue = new libDecimal(0);

	if (tmpObjectType == 'object')
	{
		if (Array.isArray(tmpA))
		{
			for (let i = 0; i < tmpA.length; i++)
			{
				// If this is an array, enumerate it and try to aggregate each number
				let tmpValue = new libDecimal(tmpA[i]);

				if (isNaN(tmpValue))
				{
					pOperation.logError(`Array element index [${i}] could not be parsed as a number by Decimal.js; skipping.  (${tmpA[i]})`);
				}
				else
				{
					tmpAggregationValue = tmpAggregationValue.plus(tmpValue);
					pOperation.logInfo(`Adding element [${i}] value ${tmpValue} totaling: ${tmpAggregationValue}`)
				}
			}
		}
		else
		{
			let tmpObjectKeys = Object.keys(tmpA);
			for (let i = 0; i < tmpObjectKeys.length; i++)
			{
				let tmpValue = new libDecimal(tmpA[tmpObjectKeys[i]]);

				if (isNaN(tmpValue))
				{
					pOperation.logError(`Object property [${tmpObjectKeys[i]}] could not be parsed as a number; skipping.  (${tmpA[tmpObjectKeys[i]]})`);
				}
				else
				{
					tmpAggregationValue = tmpAggregationValue.plus(tmpValue);
					pOperation.logInfo(`Adding object property [${tmpObjectKeys[i]}] value ${tmpValue} totaling: ${tmpAggregationValue}`)
				}
			}
		}
	}
	else
	{
		let tmpValue = new libDecimal(tmpA);

		if (isNaN(tmpValue))
		{
			pOperation.logError(`Direct value could not be parsed as a number; skipping.  (${tmpA})`);
		}
		else
		{
			tmpAggregationValue = tmpValue;
		}
	}
	pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpAggregationValue.toString());
	return true;
};

const groupValuesAndAggregate = (pOperation) =>
{
	let tmpInputDataSet = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'inputDataSet');
	let tmpGroupByProperty = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'groupByProperty');
	let tmpGroupValueProperty = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'groupValueProperty');

	let tmpOutputDataSet = {};
	let tmpProcessedOutputDataSet = {};

	let tmpObjectType = typeof (tmpInputDataSet);

	if (tmpObjectType == 'object')
	{
		if (Array.isArray(tmpInputDataSet))
		{
			for (let i = 0; i < tmpInputDataSet.length; i++)
			{
				if (typeof (tmpInputDataSet[i]) !== 'object')
				{
					pOperation.logInfo(`Element [${i}] was not an object; skipping group operation.`);
				}
				else
				{
					let tmpValue = tmpInputDataSet[i];
					let tmpGroupByValue = tmpValue[tmpGroupByProperty];
					if (!tmpValue.hasOwnProperty(tmpGroupByProperty))
					{
						pOperation.logInfo(`Element [${i}] doesn't have the group by property [${tmpGroupByProperty}]; setting group to [__NO_GROUP].`);
						tmpGroupByValue = '__NO_GROUP';
					}

					if (!tmpValue.hasOwnProperty(tmpGroupValueProperty))
					{
						pOperation.logInfo(`Element [${i}] doesn't have the group value property [${tmpGroupValueProperty}]; skipping group operation.`);
					}
					else
					{
						let tmpDecimalValue = new libDecimal(tmpValue[tmpGroupValueProperty]);

						if (isNaN(tmpDecimalValue))
						{
							pOperation.logError(`Object property [${i}] could not be parsed as a number; skipping.  (${tmpValue[tmpGroupValueProperty]})`);
						}
						else
						{
							if (!tmpOutputDataSet.hasOwnProperty(tmpGroupByValue))
							{
								tmpOutputDataSet[tmpGroupByValue] = tmpDecimalValue;
							}
							else
							{
								tmpOutputDataSet[tmpGroupByValue] = tmpOutputDataSet[tmpGroupByValue].plus(tmpDecimalValue);
							}
							pOperation.logInfo(`Adding object property [${i}] value ${tmpDecimalValue} totaling: ${tmpOutputDataSet[tmpGroupByValue]}`)
						}
					}
				}
			}
		}
		else
		{
			let tmpObjectKeys = Object.keys(tmpInputDataSet);
			for (let i = 0; i < tmpObjectKeys.length; i++)
			{
				if (typeof (tmpInputDataSet[tmpObjectKeys[i]]) !== 'object')
				{
					pOperation.logInfo(`Element [${i}] was not an object; skipping group operation.`);
				}
				else
				{
					let tmpValue = tmpInputDataSet[tmpObjectKeys[i]];
					let tmpGroupByValue = tmpValue[tmpGroupByProperty];
					if (!tmpValue.hasOwnProperty(tmpGroupByProperty))
					{
						pOperation.logInfo(`Element [${tmpObjectKeys[i]}][${i}] doesn't have the group by property [${tmpGroupByProperty}]; setting group to [__NO_GROUP].`);
						tmpGroupByValue = '__NO_GROUP';
					}

					if (!tmpValue.hasOwnProperty(tmpGroupValueProperty))
					{
						pOperation.logInfo(`Element [${tmpObjectKeys[i]}][${i}] doesn't have the group value property [${tmpGroupValueProperty}]; skipping group operation.`);
					}
					else
					{
						let tmpDecimalValue = new libDecimal(tmpValue[tmpGroupValueProperty]);

						if (isNaN(tmpDecimalValue))
						{
							pOperation.logError(`Object property [${tmpObjectKeys[i]}][${i}] to group ${tmpGroupByValue} could not be parsed as a number; skipping.  (${tmpValue[tmpGroupValueProperty]})`);
						}
						else
						{
							if (!tmpOutputDataSet.hasOwnProperty(tmpGroupByValue))
							{
								tmpOutputDataSet[tmpGroupByValue] = tmpDecimalValue;
							}
							else
							{
								tmpOutputDataSet[tmpGroupByValue] = tmpOutputDataSet[tmpGroupByValue].plus(tmpDecimalValue);
							}
							pOperation.logInfo(`Adding object property [${tmpObjectKeys[i]}][${i}] to group ${tmpGroupByValue} value ${tmpDecimalValue} totaling: ${tmpOutputDataSet[tmpGroupByValue]}`)
						}
					}
				}
			}
		}

		// Now marshal the aggregated values
		let tmpOutputGroups = Object.keys(tmpOutputDataSet);
		for (let j = 0; j < tmpOutputGroups.length; j++)
		{
			tmpProcessedOutputDataSet[tmpOutputGroups[j]] = tmpOutputDataSet[tmpOutputGroups[j]].toString();
		}
	}
	else
	{
		pOperation.logError(`Input set is neither an Array nor an Object`);
	}

	pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'outputDataSet', tmpProcessedOutputDataSet);

	return true;
}

let toFraction = (pOperation) =>
{
	// This could be done in one line, but, would be more difficult to comprehend.
	let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
	pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.toFraction().toString());
	return true;
};


class PreciseMath extends libElucidatorInstructionSet
{
	constructor(pElucidator)
	{
		super(pElucidator);
		this.namespace = 'PreciseMath';
	}

	initializeInstructions()
	{
		this.addInstruction('add', add);

		this.addInstruction('subtract', subtract);
		this.addInstruction('sub', subtract);

		this.addInstruction('multiply', multiply);
		this.addInstruction('mul', multiply);

		this.addInstruction('divide', divide);
		this.addInstruction('div', divide);

		this.addInstruction('aggregate', aggregate);
		this.addInstruction('groupvaluesandaggregate', groupValuesAndAggregate);

		this.addInstruction('setprecision', setprecision);
		this.addInstruction('setroundingmode', setroundingmode);

		this.addInstruction('todecimalplaces', todecimalplaces);
		this.addInstruction('tosignificantdigits', tosignificantdigits);
		this.addInstruction('round', round);
		this.addInstruction('tofraction', toFraction);


		return true;
	}

	initializeOperations()
	{
		this.addOperation('add', require(`./Operations/PreciseMath-Add.json`));
		this.addOperation('subtract', require(`./Operations/PreciseMath-Subtract.json`));
		this.addOperation('multiply', require(`./Operations/PreciseMath-Multiply.json`));
		this.addOperation('divide', require(`./Operations/PreciseMath-Divide.json`));

		this.addOperation('aggregate', require('./Operations/PreciseMath-Aggregate.json'));
		this.addOperation('groupvaluesandaggregate', require('./Operations/PreciseMath-GroupValuesAndAggregate.json'));

		this.addOperation('setprecision', require('./Operations/PreciseMath-SetPrecision.json'));
		this.addOperation('setroundingmode', require('./Operations/PreciseMath-SetRoundingMode.json'));

		this.addOperation('tosignificantdigits', require('./Operations/PreciseMath-ToSignificantDigits.json'));
		this.addOperation('todecimalplaces', require('./Operations/PreciseMath-ToDecimalPlaces.json'));
		this.addOperation('round', require('./Operations/PreciseMath-Round.json'));

		return true;
	}
}

module.exports = PreciseMath;