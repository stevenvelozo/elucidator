let libElucidator = require('../source/Elucidator.js');

let _Elucidator = new libElucidator();

let tmpInput = { a: 10, b: 3 };

_Elucidator.solve('PreciseMath', 'Add', tmpInput);