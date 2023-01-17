/**
* Unit tests for Elucidator
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;

let libElucidator = require('../source/Elucidator.js');
let libManyfest = require('manyfest');

suite
(
	'Elucidator Set Operations',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Simple Group By Operations',
			()=>
			{
				test
				(
					'Execute a basic group by.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {
							namespace:'Set',
							operation:'GroupValuesBy',
							inputDataSet: [
									{SetName:'Food', Value:100},
									{SetName:'Drink', Value:100},
									{SetName:'Food', Value:11},
									{SetName:'Drink', Value:200},
									{SetName:'Food', Value:12},
									{SetName:'Drink', Value:300},
									{SetName:'Food', Value:13},
									{SetName:'Food', Value:14},
									{SetName:'Food', Value:15},
									{SetName:'Food', Value:16},
									{SetName:'Food', Value:17}
								],
							groupByProperty:'SetName',
							groupValueProperty:'Value' };
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Set', 'GroupValuesBy', tmpData);
						Expect(tmpData.outputDataSet.Food.length).to.equal(8);
						Expect(tmpData.outputDataSet.Drink.length).to.equal(3);
						Expect(tmpData.outputDataSet.Food[1]).to.equal(11);
						fTestComplete();
					}
				);
			}
		);

	}
);
