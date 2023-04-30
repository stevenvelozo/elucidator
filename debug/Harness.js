let libElucidator = require('../source/Elucidator.js');

let _Elucidator = new libElucidator();

let tmpInput = { a: 10, b: 3 };

let tmpInstructionSet = 'PreciseMath';
let tmpInstruction = 'Add';

console.log(`Testing instruction [${tmpInstructionSet}]::[${tmpInstruction}] with the following data: ${JSON.stringify(tmpInput)}`);

_Elucidator.solve(tmpInstructionSet, tmpInstruction, tmpInput);

console.log(`Outcome: ${JSON.stringify(tmpInput)}`);