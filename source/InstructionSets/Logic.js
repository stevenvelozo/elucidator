// Solution providers are meant to be stateless, and not classes.
// These solution providers are akin to drivers, connecting code libraries or 
// other types of behavior to mapping operations.

let libElucidatorInstructionSet = require('../Elucidator-InstructionSet.js');

const ifInstruction = (pOperation) =>
{
    let tmpLeftValue = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'leftValue');
    let tmpRightValue = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'rightValue');
    let tmpComparator = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'comparator').toString().toLowerCase();

    let tmpComparisonOperator = 'equal';

    // This may eventually come from configuration; for now just leave it here.
    let tmpComparisonOperatorMapping = (
        {
            '==':'equal',
            'eq':'equal',
            'equal':'equal',

            '!=':'notequal',
            'noteq':'notequal',
            'notequal':'notequal',

            '===':'identity',
            'id':'identity',
            'identity':'identity',

            '>':'greaterthan',
            'gt':'greaterthan',
            'greaterthan':'greaterthan',

            '>=':'greaterthanorequal',
            'gte':'greaterthanorequal',
            'greaterthanorequal':'greaterthanorequal',

            '<':'lessthan',
            'lt':'lessthan',
            'lessthan':'lessthan',

            '<=':'lessthanorequal',
            'lte':'lessthanorequal',
            'lessthanorequal':'lessthanorequal'
        });

    if (tmpComparisonOperatorMapping.hasOwnProperty(tmpComparator))
    {
        tmpComparisonOperator = tmpComparisonOperatorMapping[tmpComparator];
    }

    let tmpTrueNamespace = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'trueNamespace');
    let tmpTrueOperation = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'trueOperation');

    let tmpFalseNamespace = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'falseNamespace');
    let tmpFalseOperation = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'falseOperation');

    let tmpTruthiness = null;

    switch(tmpComparisonOperator)
    {
        case 'equal':
            tmpTruthiness = (tmpLeftValue == tmpRightValue);
            break;
        case 'identity':
            tmpTruthiness = (tmpLeftValue === tmpRightValue);
            break;
        case 'notequal':
            tmpTruthiness = (tmpLeftValue != tmpRightValue);
            break;
        case 'greaterthan':
            tmpTruthiness = (tmpLeftValue > tmpRightValue);
            break;
        case 'greaterthanorequal':
            tmpTruthiness = (tmpLeftValue >= tmpRightValue);
            break;
        case 'lessthan':
            tmpTruthiness = (tmpLeftValue < tmpRightValue);
            break;
        case 'lessthanorequal':
            tmpTruthiness = (tmpLeftValue <= tmpRightValue);
            break;
    }

    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'truthinessResult', tmpTruthiness);

    // Now execute the operations (unless it is a noop or a bunk operation)
    // This is, frankly, kindof a mind-blowing amount of recursion possibility.
    // Both of these are falling back on the base solution hash mapping.
    // --> Not certain if this is the correct approach and the only way to tell will be through exercise of this
    if (tmpTruthiness && (typeof(tmpTrueNamespace) == 'string') && (typeof(tmpTrueOperation) == 'string') && (tmpTrueOperation != 'noop'))
    {
        pOperation.Elucidator.solveInternalOperation(tmpTrueNamespace, tmpTrueOperation, pOperation.InputObject, pOperation.OutputObject, pOperation.DescriptionManyfest, pOperation.SolutionContext.InputHashMapping, pOperation.SolutionContext.OutputHashMapping, pOperation.SolutionContext);
    }
    else if ((typeof(tmpFalseNamespace) == 'string') &&  (typeof(tmpFalseOperation) == 'string') && (tmpFalseOperation != 'noop'))
    {
        pOperation.Elucidator.solveInternalOperation(tmpFalseNamespace, tmpFalseOperation, pOperation.InputObject, pOperation.OutputObject, pOperation.DescriptionManyfest, pOperation.SolutionContext.InputHashMapping, pOperation.SolutionContext.OutputHashMapping, pOperation.SolutionContext);
    }

    return true;
};

const executeOperation = (pOperation) =>
{
    let tmpNamespace = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'namespace');
    let tmpOperation = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'operation');

    pOperation.Elucidator.solveInternalOperation(tmpNamespace, tmpOperation, pOperation.InputObject, pOperation.OutputObject, pOperation.DescriptionManyfest, pOperation.SolutionContext.InputHashMapping, pOperation.SolutionContext.OutputHashMapping, pOperation.SolutionContext);

    return true;
}

class Logic extends libElucidatorInstructionSet
{
    constructor(pElucidator)
    {
        super(pElucidator);
        this.namespace = 'Logic';
    }

    initializeInstructions()
    {
        // Logic actually wants a noop instruction!
        super.initializeInstructions();

        this.addInstruction('if', ifInstruction);
        this.addInstruction('execute', executeOperation);

        return true;
    }

    initializeOperations()
    {
        this.addOperation('if', require(`./Operations/Logic-If.json`));
        this.addOperation('execute', require(`./Operations/Logic-Execute.json`));

        return true;
    }
}

module.exports = Logic;