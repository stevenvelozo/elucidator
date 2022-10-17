// Solution providers are meant to be stateless, and not classes.
// These solution providers are akin to drivers, connecting code libraries or 
// other types of behavior to mapping operations.

let libElucidatorInstructionSet = require('../Elucidator-InstructionSet.js');

let add = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');
    let tmpB = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b');
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA + tmpB);
    return true;
};

let subtract = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');
    let tmpB = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b');
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA - tmpB);
    return true;
};

let multiply = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');
    let tmpB = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b');
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA * tmpB);
    return true;
};

let divide = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');
    let tmpB = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b');
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA / tmpB);
    return true;
};

let aggregate = (pOperation) =>
{
    let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');

    let tmpObjectType = typeof(tmpA);

    let tmpAggregationValue = 0;

    if (tmpObjectType == 'object')
    {
        if (Array.isArray(tmpA))
        {
            for (let i = 0; i < tmpA.length; i++)
            {
                // If this is an array, enumerate it and try to aggregate each number
                let tmpValue = parseInt(tmpA[i]);

                if (isNaN(tmpValue))
                {
                    pOperation.logError(`Array element index [${i}] could not be parsed as a number; skipping.  (${tmpA[i]})`);
                }
                else
                {
                    tmpAggregationValue += tmpValue;
                    pOperation.logInfo(`Adding element [${i}] value ${tmpValue} totaling: ${tmpAggregationValue}`)
                }
            }
        }
        else
        {
            let tmpObjectKeys = Object.keys(tmpA);
            for (let i = 0; i < tmpObjectKeys.length; i++)
            {
                let tmpValue = parseInt(tmpA[tmpObjectKeys[i]]);

                if (isNaN(tmpValue))
                {
                    pOperation.logError(`Object property [${tmpObjectKeys[i]}] could not be parsed as a number; skipping.  (${tmpA[tmpObjectKeys[i]]})`);
                }
                else
                {
                    tmpAggregationValue += tmpValue;
                    pOperation.logInfo(`Adding object property [${tmpObjectKeys[i]}] value ${tmpValue} totaling: ${tmpAggregationValue}`)
                }
            }
        }
    }
    else
    {
        let tmpValue = parseInt(tmpA);

        if (isNaN(tmpValue))
        {
            pOperation.logError(`Direct value could not be parsed as a number; skipping.  (${tmpA})`);
        }
        else
        {
            tmpAggregationValue += tmpValue;
        }
    }
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpAggregationValue);
    return true;
};

class MathJavascript extends libElucidatorInstructionSet
{
    constructor(pElucidator)
    {
        super(pElucidator);
        this.namespace = 'Math';
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

        return true;
    }

    initializeOperations()
    {
        this.addOperation('add', require(`./Operations/Math-Add.json`));
        this.addOperation('subtract', require(`./Operations/Math-Subtract.json`));
        this.addOperation('multiply', require(`./Operations/Math-Multiply.json`));
        this.addOperation('divide', require(`./Operations/Math-Divide.json`));

        this.addOperation('aggregate', require(`./Operations/Math-Aggregate.json`));

        return true;
    }
}

module.exports = MathJavascript;