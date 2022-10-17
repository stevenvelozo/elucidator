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
	'Elucidator Abstract Operations',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Geometry',
			()=>
			{
				test
				(
					'Area of a rectangle.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {Width:10, Height:2};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Geometry', 'RectangleArea', tmpData);
						Expect(tmpData.Area).to.equal('20');
						Expect(tmpOperationOutput.SolutionLog[0]).to.equal('Solve for [ Area ] based on [ Width ] and [ Height ].');
						Expect(tmpOperationOutput.SolutionLog[1]).to.equal('Operation complete; [ Area ] = 10 * 2 = 20');
						fTestComplete();
					}
				);
			}
		);
	}
);
