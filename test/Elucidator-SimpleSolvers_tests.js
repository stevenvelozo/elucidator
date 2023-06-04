/**
* Unit tests for Elucidator
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const Chai = require("chai");
const Expect = Chai.expect;

const libFable = require('fable');
const _ElucidatorTestConfig = (
{
    Product: 'ElucidatorTest'
});
const getFable = () => { return new libFable(_ElucidatorTestConfig); };

const libElucidator = require('../source/Elucidator.js');


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
						let _Elucidator = new libElucidator(getFable(),);
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
						let _Elucidator = new libElucidator(getFable(),);
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
						let _Elucidator = new libElucidator(getFable(),);
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
						let _Elucidator = new libElucidator(getFable(),);
						let tmpData = {a:1000, b:10};
						_Elucidator.solveInternalOperation('Math', 'Divide', tmpData);
						// This should make us the best prime number.  Fight me.
						Expect(tmpData.x)
							.to.equal(100);
						fTestComplete();
					}
				);
				test
				(
					'Aggregate a set of numbers.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator(getFable(),);
						let tmpData = {a: [100, 200, 50, 3, 5]};
						let tmpSolverResults = _Elucidator.solveInternalOperation('Math', 'Aggregate', tmpData);
						// This should make us the best prime number.  Fight me.
						Expect(tmpData.x).to.equal(358);
						Expect(tmpSolverResults.SolutionLog[0]).to.equal('Aggregate all numeric values in a, storing the resultant in x.');
						Expect(tmpSolverResults.SolutionLog[3]).to.equal('[INFO][Operation Math:Aggregate - Step #0:Math:aggregate] Adding element [2] value 50 totaling: 350');
						fTestComplete();
					}
				);
				test
				(
					'Aggregate a set of numbers from an address in a complex object',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator(getFable(),);
						let tmpData = {a: {'Fruit':400, 'Cuvee':200, 'bread':10}};
						let tmpSolverResults = _Elucidator.solveInternalOperation('Math', 'Aggregate', tmpData);
						// This should make us the best prime number.  Fight me.
						Expect(tmpData.x).to.equal(610);
						Expect(tmpSolverResults.SolutionLog[0]).to.equal('Aggregate all numeric values in a, storing the resultant in x.');
						Expect(tmpSolverResults.SolutionLog[2]).to.equal('[INFO][Operation Math:Aggregate - Step #0:Math:aggregate] Adding object property [Cuvee] value 200 totaling: 600');
						fTestComplete();
					}
				);
				test
				(
					'Aggregate a set of numbers from an address in a complex object where one value is not a number',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator(getFable(),);
						let tmpData = {a: {'Fruit':400, 'Cuvee':'THIS IS NOT A NUMBER', 'bread':10}};
						let tmpSolverResults = _Elucidator.solveInternalOperation('Math', 'Aggregate', tmpData);
						// This should make us the best prime number.  Fight me.
						Expect(tmpData.x).to.equal(410);
						Expect(tmpSolverResults.SolutionLog[0]).to.equal('Aggregate all numeric values in a, storing the resultant in x.');
						Expect(tmpSolverResults.SolutionLog[2]).to.equal('[ERROR][Operation Math:Aggregate - Step #0:Math:aggregate] Object property [Cuvee] could not be parsed as a number; skipping.  (THIS IS NOT A NUMBER)');
						fTestComplete();
					}
				);
			}
		);
	}
);
