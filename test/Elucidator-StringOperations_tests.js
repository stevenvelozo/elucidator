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
	'Elucidator String Operations',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Simple String Manipulation',
			()=>
			{
				test
				(
					'Trim a string.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {inputString:'   Weird whitespace abounds. '};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('String', 'Trim', tmpData);
						Expect(tmpData.outputString).to.equal('Weird whitespace abounds.');
						Expect(tmpOperationOutput.SolutionLog[0]).to.equal('Trim the whitespace from value [   Weird whitespace abounds. ].');
						Expect(tmpOperationOutput.SolutionLog[1]).to.equal('Operation complete: outputString = [Weird whitespace abounds.] from [   Weird whitespace abounds. ]');
						fTestComplete();
					}
				);
				test
				(
					'Trim an already trim string.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {inputString:'No whitespace abounds.'};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('String', 'Trim', tmpData);
						Expect(tmpData.outputString).to.equal('No whitespace abounds.');
						fTestComplete();
					}
				);
				test
				(
					'Replace a value in a string.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {inputString:'No whitespace abounds.', searchFor:'whitespace', replaceWith:'notwhitespace'};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('String', 'Replace', tmpData);
						Expect(tmpData.outputString).to.equal('No notwhitespace abounds.');
						fTestComplete();
					}
				);
				test
				(
					'Get a substring.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {inputString:'No whitespace abounds.', indexStart:8, indexEnd:13};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('String', 'Substring', tmpData);
						Expect(tmpData.outputString).to.equal('space');
						fTestComplete();
					}
				);
			}
		);
	}
);
