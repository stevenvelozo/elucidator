// Solution providers are meant to be stateless, and not classes.
// These solution providers are akin to drivers, connecting code libraries or 
// other types of behavior to mapping operations.

let libElucidatorInstructionSet = require('../Elucidator-InstructionSet.js');

let trim = (pOperation) =>
{
    let tmpInputString = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'inputString');

    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'outputString', tmpInputString.trim());

    return true;
};

let replace = (pOperation) =>
{
    let tmpInputString = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'inputString');
    let tmpSearchFor = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'searchFor');
    let tmpReplaceWith = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'replaceWith');

    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'outputString', tmpInputString.replace(tmpSearchFor, tmpReplaceWith));

    return true;
};

let substring = (pOperation) =>
{
    let tmpInputString = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'inputString');
    let indexStart = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'indexStart');
    let indexEnd = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'indexEnd');

    if (indexEnd != null)
    {
        pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'outputString', tmpInputString.substring(indexStart, indexEnd));
    }
    else
    {
        pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'outputString', tmpInputString.substring(indexStart));
    }

    return true;
};

class StringOperations extends libElucidatorInstructionSet
{
    constructor(pElucidator)
    {
        super(pElucidator);
        this.namespace = 'String';
    }

    initializeInstructions()
    {
        this.addInstruction('trim', trim);
        this.addInstruction('replace', replace);
        this.addInstruction('substring', substring);

        return true;
    }

    initializeOperations()
    {
        this.addOperation('trim', require(`./Operations/String-Trim.json`));
        this.addOperation('replace', require(`./Operations/String-Replace.json`));
        this.addOperation('substring', require(`./Operations/String-Substring.json`));

        return true;
    }
}

module.exports = StringOperations;