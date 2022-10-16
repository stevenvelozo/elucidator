// Solution providers are meant to be stateless, and not classes.
// These solution providers are akin to drivers, connecting code libraries or 
// other types of behavior to mapping operations.

let libElucidatorInstructionSet = require('../Elucidator-InstructionSet.js');

class Geometry extends libElucidatorInstructionSet
{
    constructor(pElucidator)
    {
        super(pElucidator);
        this.namespace = 'Geometry';
    }

    // Geometry provides no instructions
    initializeInstructions()
    {
        return true;
    }

    initializeOperations()
    {
        this.addOperation('rectanglearea', require(`./Operations/Geometry-RectangleArea.json`));

        return true;
    }
}

module.exports = Geometry;