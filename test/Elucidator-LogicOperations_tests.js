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
	'Elucidator Logic Operations',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Simple Executions',
			()=>
			{
				test
				(
					'Execute a basic operation.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {namespace:'Math', operation:'add', a:60, b:33 };
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Logic', 'Execute', tmpData);
						Expect(tmpData.x).to.equal(93);
						Expect(tmpOperationOutput.SolutionLog[0]).to.equal('Execute the add operation in namespace Math.');
						Expect(tmpOperationOutput.SolutionLog[3]).to.equal('Operation [Math:add] execution complete.');
						fTestComplete();
					}
				);
				test
				(
					'Execute a different operation.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {namespace:'Geometry', operation:'rectanglearea', Width:10, Height:3 };
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Logic', 'Execute', tmpData);
						Expect(tmpData.Area).to.equal('30');
						Expect(tmpOperationOutput.SolutionLog[0]).to.equal('Execute the rectanglearea operation in namespace Geometry.');
						Expect(tmpOperationOutput.SolutionLog[3]).to.equal('Operation [Geometry:rectanglearea] execution complete.');
						fTestComplete();
					}
				);
			}
		);

		suite
		(
			'Simple If',
			()=>
			{
				test
				(
					'Simple if statement comparing numbers.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {leftValue:10, rightValue:10, comparator:'=='};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Logic', 'If', tmpData);
						Expect(tmpData.truthinessResult).to.equal(true);
						Expect(tmpOperationOutput.SolutionLog[0]).to.equal("Compare leftValue and rightValue with the == operator, storing the truthiness in truthinessResult.");
						Expect(tmpOperationOutput.SolutionLog[1]).to.equal("Operation complete: 10 == 10 evaluated to true");
						fTestComplete();
					}
				);
				test
				(
					'Simple if statement comparing numbers where one is a string.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {leftValue:10, rightValue:'10', comparator:'=='};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Logic', 'If', tmpData);
						Expect(tmpData.truthinessResult).to.equal(true);
						Expect(tmpOperationOutput.SolutionLog[0]).to.equal("Compare leftValue and rightValue with the == operator, storing the truthiness in truthinessResult.");
						Expect(tmpOperationOutput.SolutionLog[1]).to.equal("Operation complete: 10 == 10 evaluated to true");
						fTestComplete();
					}
				);
				test
				(
					'Simple if statement comparing numbers with the identity operator where one is a string.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {leftValue:10, rightValue:'10', comparator:'==='};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Logic', 'If', tmpData);
						Expect(tmpData.truthinessResult).to.equal(false);
						// TODO: Right now the log doesn't show the data type of the two sides... should it?
						Expect(tmpOperationOutput.SolutionLog[1]).to.equal("Operation complete: 10 === 10 evaluated to false");
						fTestComplete();
					}
				);
				test
				(
					'Simple if statement with not equals.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {leftValue:10, rightValue:10, comparator:'!='};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Logic', 'If', tmpData);
						Expect(tmpData.truthinessResult).to.equal(false);
						fTestComplete();
					}
				);
				test
				(
					'Simple if statement with less than operator.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {leftValue:7, rightValue:10, comparator:'<'};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Logic', 'If', tmpData);
						Expect(tmpData.truthinessResult).to.equal(true);
						fTestComplete();
					}
				);
			}
		);

		suite
		(
			'Complex If',
			()=>
			{
				test
				(
					'Complex if statement adding two numbers if true.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {leftValue:10, rightValue:10, comparator:'==', trueNamespace:'Math', trueOperation:'Add', a:100, b:215};
						// Add a and b if this is true
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Logic', 'If', tmpData);						
						Expect(tmpData.truthinessResult).to.equal(true);
						Expect(tmpData.x).to.equal(315);
						fTestComplete();
					}
				);
				test
				(
					'Complex if statement doing nothing if false.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {leftValue:10, rightValue:10, comparator:'!=', trueNamespace:'Math', trueOperation:'Add', a:100, b:215};
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Logic', 'If', tmpData);						
						Expect(tmpData.truthinessResult).to.equal(false);
						Expect(tmpData.x).to.equal(undefined);
						fTestComplete();
					}
				);
				test
				(
					'Complex statement -- add if true, subtract if false.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = (
							{
								leftValue:10,
								rightValue:10, 
								comparator:'==', 
								trueNamespace:'Math', 
								trueOperation:'Add', 
								falseNamespace:'Math',
								falseOperation:'Subtract',
								a:1000, 
								b:215
							});
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Logic', 'If', tmpData);						
						Expect(tmpData.truthinessResult).to.equal(true);
						Expect(tmpData.x).to.equal(1215);
						// Now make it inequal and run it again
						tmpData.leftValue = 9;
						tmpOperationOutput = _Elucidator.solveInternalOperation('Logic', 'If', tmpData);						
						Expect(tmpData.truthinessResult).to.equal(false);
						Expect(tmpData.x).to.equal(785);
						fTestComplete();
					}
				);
			}
		);
	}
);
