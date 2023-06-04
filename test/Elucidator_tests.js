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
						let _Elucidator = new libElucidator(getFable(),{});
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
						let _Elucidator = new libElucidator(getFable(),{Scope:'BadManifest', Descriptors:'BadDescriptors'});
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
						let _Elucidator = new libElucidator(getFable());
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
						let _Elucidator = new libElucidator(getFable());
						_Elucidator.log.error('Error...');
						_Elucidator.log.warn('Info...');
						_Elucidator.log.info('Info...');
						_Elucidator.log.info();

						fTestComplete();
					}
				);
			}
		);
	}
);
