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

suite
(
	'Elucidator Basic',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Object Sanity',
			()=>
			{
				test
				(
					'The class should initialize itself into a happy little object.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator({});
						Expect(_Elucidator)
							.to.be.an('object', 'Elucidator should initialize as an object with no parameters.');
						fTestComplete();
					}
				);
				test
				(
					'The class should print an error message with a bad manifest.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator({Scope:'BadManifest', Descriptors:'BadDescriptors'});
						Expect(_Elucidator)
							.to.be.an('object', 'Elucidator should initialize as an object with no parameters.');
						fTestComplete();
					}
				);
				test
				(
					'Default properties should be automatically set.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						Expect(_Elucidator.instructionSets)
							.to.be.an('object', 'Elucidator should have instruction sets.');
						Expect(_Elucidator.operationSets)
							.to.be.an('object', 'Elucidator should have operation sets.');
						fTestComplete();
					}
				);
				test
				(
					'Exercise the default logging.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						_Elucidator.logError('Error...');
						_Elucidator.logWarning('Info...');
						_Elucidator.logInfo('Info...');
						_Elucidator.logInfo();

						fTestComplete();
					}
				);
				test
				(
					'Pass in a custom logger.',
					(fTestComplete)=>
					{
						let tmpLogState = [];
						let fWriteLog = (pLogLine, pLogObject) =>
						{
							tmpLogState.push(pLogLine);
						};

						let _Elucidator = new libElucidator(undefined, fWriteLog, fWriteLog, fWriteLog);
						_Elucidator.logError('Error...');
						Expect(tmpLogState.length)
							.to.equal(1);
						Expect(tmpLogState[0])
							.to.equal('Error...');
						_Elucidator.logInfo('Info...');
						_Elucidator.logInfo();
						Expect(tmpLogState.length)
							.to.equal(3);

						fTestComplete();
					}
				);
			}
		);
	}
);
