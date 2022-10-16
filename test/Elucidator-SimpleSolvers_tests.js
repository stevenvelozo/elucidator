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
	'Elucidator Simple Solvers',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Basic Javascript Math',
			()=>
			{
				test
				(
					'Add two numbers.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {a:1, b:2};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Math', 'Add', tmpData);
						// This should make us the best prime number.  Fight me.
						Expect(tmpData.x).to.equal(3);
						Expect(tmpOperationOutput.SolutionLog[0]).to.equal('Add a and b, storing the value in x.');
						Expect(tmpOperationOutput.SolutionLog[1]).to.equal('Operation complete: x = 1 + 2 = 3');
						fTestComplete();
					}
				);
				test
				(
					'Subtract two numbers.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {a:1003, b:1000};
						_Elucidator.solveInternalOperation('Math', 'Subtract', tmpData);
						// This should make us the best prime number.  Fight me.
						Expect(tmpData.x)
							.to.equal(3);
						fTestComplete();
					}
				);
				test
				(
					'Multiply two numbers.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {a:103, b:10};
						_Elucidator.solveInternalOperation('Math', 'Multiply', tmpData);
						Expect(tmpData.x)
							.to.equal(1030);
						fTestComplete();
					}
				);
				test
				(
					'Divide two numbers.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {a:1000, b:10};
						_Elucidator.solveInternalOperation('Math', 'Divide', tmpData);
						// This should make us the best prime number.  Fight me.
						Expect(tmpData.x)
							.to.equal(100);
						fTestComplete();
					}
				);
			}
		);
	}
);
