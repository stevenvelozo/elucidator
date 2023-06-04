const libFable = require('fable');
//const libElucidator = require('../source/Elucidator.js');

let _Fable = new libFable();
//let _Elucidator = new libElucidator(_Fable);
let _Elucidator = _Fable.serviceManager.addAndInstantiateServiceType('Solver', require('../source/Elucidator.js'));

let tmpInput = { a: 10, b: 3 };

let tmpInstructionSet = 'PreciseMath';
let tmpInstruction = 'Add';

console.log(`Testing instruction [${tmpInstructionSet}]::[${tmpInstruction}] with the following data: ${JSON.stringify(tmpInput)}`);

_Elucidator.solveInternalOperation(tmpInstructionSet, tmpInstruction, tmpInput);

console.log(`Outcome: ${JSON.stringify(tmpInput)}`);