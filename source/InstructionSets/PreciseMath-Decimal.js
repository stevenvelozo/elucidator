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

    if (!isNaN(tmpPrecision))
    {
        libDecimal.set({ precision: tmpPrecision });
    }

    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', libDecimal.round(tmpA).toString());
};

let aggregate = (pOperation) =>
{
    let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');

    let tmpObjectType = typeof(tmpA);

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
        this.addOperation('round', require('./Operations/PreciseMath-Round.json'));
        this.addOperation('aggregate', require('./Operations/PreciseMath-Aggregate.json'));

        return true;
    }
}

module.exports = PreciseMath;