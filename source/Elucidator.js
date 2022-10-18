/**
* @license MIT
* @author <steven@velozo.com>
*/
const libSimpleLog = require('./Elucidator-LogToConsole.js');
const libManyfest = require('manyfest');
const libPrecedent = require('precedent');

const libElucidatorInstructionSet = require('./Elucidator-InstructionSet.js');

/**
* Elucidator object address-based descriptions and manipulations.
*
* @class Elucidator
*/
class Elucidator
{
    constructor(pOperations, fInfoLog, fErrorLog)
    {
        // Wire in logging
        this.logInfo = (typeof(fInfoLog) === 'function') ? fInfoLog : libSimpleLog.info;
        this.logWarning = (typeof(fWarningLog) === 'function') ? fWarningLog : libSimpleLog.warning;
        this.logError = (typeof(fErrorLog) === 'function') ? fErrorLog : libSimpleLog.error;

		// Instructions are the basic building blocks for operations
		this.instructionSets = {};

		// Operations are the solvers that can be called (instructions can't be called directly)
		// These can be added at run-time as well
		this.operationSets = {};

		// Decide later how to make this truly unique.
		this.UUID = 0;

		this.loadDefaultInstructionSets();

		if (pOperations)
		{
			let tmpSolverHashes = Object.keys(pOperations);
			for (let i = 0; i < tmpSolverHashes.length; i++)
			{
				this.addOperation('Custom',tmpSolverHashes[i], pOperations[tmpSolverHashes[i]]);
			}
		}
    }

	// Load an instruction set
	loadInstructionSet(cInstructionSet)
	{
		let tmpInstructionSet = new cInstructionSet(this);
		// Setup the namespace
		tmpInstructionSet.initializeNamespace();
		tmpInstructionSet.initializeInstructions();
		tmpInstructionSet.initializeOperations();
	}

	loadDefaultInstructionSets()
	{
		// The javascript math instructions and operations
		// These provide the "Math" namespace
		this.loadInstructionSet(require(`./InstructionSets/Math-Javascript.js`));

		// A precision javascript math library that is consistent across browsers, stable and without mantissa issues
		// Uses Decimal.js
		// These provide the "PreciseMath" namespace
		this.loadInstructionSet(require(`./InstructionSets/PreciseMath-Decimal.js`));

		// The abstract geometry instructions and operations (rectangle area, circle area, etc.)
		// These provide the "Geometry" namespace
		this.loadInstructionSet(require(`./InstructionSets/Geometry.js`));

		// The logic operations (if, execution of instructions, etc.)
		// These provide the "Logic" namespace
		this.loadInstructionSet(require(`./InstructionSets/Logic.js`));

		// Basic string manipulation instructions and operations
		// These provide the "String" namespace
		this.loadInstructionSet(require(`./InstructionSets/String.js`));
	}

	operationExists(pNamespace, pOperationHash)
	{
		if ((typeof(pNamespace) != 'string') || (typeof(pOperationHash) != 'string'))
		{
			return false;
		}

		let tmpNamespace = pNamespace.toLowerCase();
		return (this.operationSets.hasOwnProperty(tmpNamespace) && this.operationSets[tmpNamespace].hasOwnProperty(pOperationHash.toLowerCase()));
	}

	addOperation(pNamespace, pOperationHash, pOperation)
	{
        if (typeof(pNamespace) != 'string')
        {
            this.logError(`Attempted to add an operation at runtime via Elucidator.addOperation with an invalid namespace; expected a string but the type was ${typeof(pNamespace)}`, pOperation);
            return false;
        }

		let tmpOperationInjector = new libElucidatorInstructionSet(this);
		tmpOperationInjector.initializeNamespace(pNamespace);

		return tmpOperationInjector.addOperation(pOperationHash, pOperation);
	}

	solveInternalOperation(pNamespace, pOperationHash, pInputObject, pOutputObject, pDescriptionManyfest, pInputAddressMapping, pOutputAddressMapping, pSolutionContext)
	{
		if (!this.operationExists(pNamespace, pOperationHash))
		{
			this.logError(`Attempted to solveInternalOperation for namespace ${pNamespace} operationHash ${pOperationHash} but the operation was not found.`);
			// TODO: Should this return something with an error log populated?
			return false;
		}
		let tmpOperation = this.operationSets[pNamespace.toLowerCase()][pOperationHash.toLowerCase()];
		return this.solveOperation(tmpOperation, pInputObject, pOutputObject, pDescriptionManyfest, pInputAddressMapping, pOutputAddressMapping, pSolutionContext);
	}

	solveOperation(pOperationObject, pInputObject, pOutputObject, pDescriptionManyfest, pInputAddressMapping, pOutputAddressMapping, pSolutionContext)
	{
		let tmpOperation = JSON.parse(JSON.stringify(pOperationObject));

		if (typeof(pInputObject) != 'object')
		{
            this.logError(`Attempted to run a solve but the passed in Input was not an object.  The type was ${typeof(pInputObject)}.`);
			return false;
		}
		let tmpInputObject = pInputObject;

		// Default to reusing the input object as the output object.
		let tmpOutputObject = tmpInputObject;

		// This is how recursive solutions bind their context together.
		let tmpSolutionContext = pSolutionContext;
		if (typeof(tmpSolutionContext) === 'undefined')
		{
			tmpSolutionContext = (
				{
					"SolutionGUID": `Solution-${this.UUID++}`, 
					"SolutionBaseNamespace": pOperationObject.Description.Namespace,
					"SolutionBaseOperation": pOperationObject.Description.Operation,
					"SolutionLog": []
				});
			
			// This is the root operation, see if there are Inputs and Outputs created ... if not, create them.
			if (!tmpOperation.hasOwnProperty('Inputs'))
			{
				tmpOperation.Inputs = {};
			}
			if (!tmpOperation.hasOwnProperty('Outputs'))
			{
				tmpOperation.Outputs = {};
			}

			// This is the root Operation, see if there is a hash translation available for either side (input or output)
			if (tmpOperation.hasOwnProperty('InputHashTranslationTable'))
			{
				tmpSolutionContext.InputHashMapping = JSON.parse(JSON.stringify(tmpOperation.InputHashTranslationTable));
			}
			else
			{
				tmpSolutionContext.InputHashMapping = {};
			}

			if (tmpOperation.hasOwnProperty('OutputHashTranslationTable'))
			{
				tmpSolutionContext.OutputHashMapping = JSON.parse(JSON.stringify(tmpOperation.OutputHashTranslationTable));
			}

			if ((typeof(pOutputObject) != 'object')
				&& (typeof(tmpOutputHashMapping) == 'undefined') 
				&& (typeof(tmpInputHashMapping) != 'undefined'))
			{
				// Reuse the input hash mapping if:
				//   1) we auto-mapped the input hash mapping to the output because only an input object was supplied
				//   2) there *was not* an output hash mapping supplied
				//   3) there *was* an input hash mapping supplied
				//
				// This seems simple at first but exposes some really interesting behaviors in terms of
				// reusing the same object and schema for input and output, but having different hash
				// mappings for each of them.
				tmpSolutionContext.OutputHashMapping = tmpSolutionContext.InputHashMapping;
			}
		}

		if (typeof(pOutputObject) == 'object')
		{
			// If the call defined an explicit, different output object from the input object use that instead.
			tmpOutputObject = pOutputObject;
		}

		let tmpDescriptionManyfest = false;
		if (typeof(pDescriptionManyfest) === 'undefined')
		{
			// We are going to use this for some clever schema manipulations, then recreate the object
			tmpDescriptionManyfest = new libManyfest();
			// Synthesize a manyfest from the Input and Output properties
			let tmpManyfestSchema = (
				{
					Scope: 'Solver Data Part Descriptions',
					Descriptors: tmpDescriptionManyfest.schemaManipulations.mergeAddressMappings(tmpOperation.Inputs, tmpOperation.Outputs)
				});
			}
		else
		{
			// Clone the passed-in manyfest, so mutations do not alter the upstream version
			tmpDescriptionManyfest = pDescriptionManyfest.clone();
		}
		// Now that the operation object has been created uniquely, apply any passed-in address-hash and hash-hash remappings
		if (pInputAddressMapping)
		{
			tmpDescriptionManyfest.schemaManipulations.resolveAddressMappings(tmpOperation.Inputs, pInputAddressMapping);
		}
		if (pOutputAddressMapping)
		{
			tmpDescriptionManyfest.schemaManipulations.resolveAddressMappings(tmpOperation.Inputs, pOutputAddressMapping);
		}
		if (tmpSolutionContext.InputHashMapping)
		{
			tmpDescriptionManyfest.hashTranslations.addTranslation(tmpSolutionContext.InputHashMapping);
		}
		if (tmpSolutionContext.OutputHashMapping)
		{
			tmpDescriptionManyfest.hashTranslations.addTranslation(tmpSolutionContext.OutputHashMapping);			
		}


		// Set some kind of unique identifier for the operation
		tmpOperation.UUID = this.UUID++;
		tmpOperation.SolutionContext = tmpSolutionContext;

		if (tmpOperation.Description.Synopsys)
		{
			tmpSolutionContext.SolutionLog.push(`[${tmpOperation.UUID}]: Solver running operation ${tmpOperation.Description.Synopsys}`);
		}

		let tmpPrecedent = new libPrecedent();
		tmpPrecedent.addPattern('{{Name:', '}}',
			(pHash)=>
			{
				let tmpHash = pHash.trim();
				let tmpDescriptor = tmpDescriptionManyfest.getDescriptorByHash(tmpHash)

				// Return a human readable value
				if ((typeof(tmpDescriptor) == 'object')  && tmpDescriptor.hasOwnProperty('Name'))
				{
					return tmpDescriptor.Name;
				}
				else
				{
					return tmpHash;
				}
			});
		tmpPrecedent.addPattern('{{InputValue:', '}}',
			(pHash)=>
			{
				let tmpHash = pHash.trim();
				return tmpDescriptionManyfest.getValueByHash(tmpInputObject,tmpHash);
			});
		tmpPrecedent.addPattern('{{OutputValue:', '}}',
			(pHash)=>
			{
				let tmpHash = pHash.trim();
				return tmpDescriptionManyfest.getValueByHash(tmpOutputObject,tmpHash);
			});

		if (tmpOperation.hasOwnProperty('Log') && tmpOperation.Log.hasOwnProperty('PreOperation'))
		{
			if (typeof(tmpOperation.Log.PreOperation) == 'string')
			{
				tmpOperation.SolutionContext.SolutionLog.push(tmpPrecedent.parseString(tmpOperation.Log.PreOperation));
			}
			else if (Array.isArray(tmpOperation.Log.PreOperation))
			{
				for (let i = 0; i < tmpOperation.Log.PreOperation.length; i++)
				{
					if ((typeof(tmpOperation.Log.PreOperation[i]) == 'string'))
					{
						tmpOperation.SolutionContext.SolutionLog.push(tmpPrecedent.parseString(tmpOperation.Log.PreOperation[i]));
					}
				}
			}
		}

		// Now step through each operation and solve
		for (let i = 0; i < tmpOperation.Steps.length; i++)
		{
			let tmpStep = tmpOperation.Steps[i];

			// Instructions are always endpoints -- they *do not* recurse.
			if (tmpStep.hasOwnProperty('Instruction'))
			{
				let tmpInputSchema = (
					{
						"Scope": "InputObject",
						"Descriptors": JSON.parse(JSON.stringify(tmpOperation.Inputs))
					});
				// Perform step-specific address mappings.
				tmpDescriptionManyfest.schemaManipulations.resolveAddressMappings(tmpInputSchema.Descriptors, tmpStep.InputHashAddressMap);
				let tmpInputManyfest = new libManyfest(tmpInputSchema);
				if (tmpSolutionContext.InputHashMapping)
				{
					tmpInputManyfest.hashTranslations.addTranslation(tmpSolutionContext.InputHashMapping);
				}

				let tmpOutputSchema = (
					{
						"Scope": "OutputObject",
						"Descriptors": JSON.parse(JSON.stringify(tmpOperation.Outputs))
					});
					tmpDescriptionManyfest.schemaManipulations.resolveAddressMappings(tmpOutputSchema.Descriptors, tmpStep.OutputHashAddressMap);
				let tmpOutputManyfest = new libManyfest(tmpOutputSchema);
				if (tmpSolutionContext.OutputHashMapping)
				{
					tmpOutputManyfest.hashTranslations.addTranslation(tmpSolutionContext.OutputHashMapping);
				}
	
				// Construct the instruction state object
				let tmpInstructionState = (
				{
					Elucidator: this,

					Namespace: tmpStep.Namespace.toLowerCase(),
					Instruction: tmpStep.Instruction.toLowerCase(),

					Operation: tmpOperation,

					SolutionContext: tmpSolutionContext,

					DescriptionManyfest: tmpDescriptionManyfest,

					InputObject: tmpInputObject,
					InputManyfest: tmpInputManyfest,

					OutputObject: tmpOutputObject,
					OutputManyfest: tmpOutputManyfest
				});

				tmpInstructionState.logError = 
					(pMessage) => 
					{
						tmpSolutionContext.SolutionLog.push(`[ERROR][Operation ${tmpInstructionState.Operation.Description.Namespace}:${tmpInstructionState.Operation.Description.Hash} - Step #${i}:${tmpStep.Namespace}:${tmpStep.Instruction}] ${pMessage}`)
					};

				tmpInstructionState.logInfo = 
					(pMessage) => 
					{
						tmpSolutionContext.SolutionLog.push(`[INFO][Operation ${tmpInstructionState.Operation.Description.Namespace}:${tmpInstructionState.Operation.Description.Hash} - Step #${i}:${tmpStep.Namespace}:${tmpStep.Instruction}] ${pMessage}`)
					};

				if (this.instructionSets[tmpInstructionState.Namespace].hasOwnProperty(tmpInstructionState.Instruction))
				{
					let fInstruction = this.instructionSets[tmpInstructionState.Namespace][tmpInstructionState.Instruction];
					fInstruction(tmpInstructionState);
				}
			}

			// Operations recurse.
			if (tmpStep.hasOwnProperty('Operation'))
			{
				if (typeof(tmpStep.Operation) == 'string')
				{
					this.solveInternalOperation(tmpStep.Namespace, tmpStep.Operation, tmpInputObject, tmpOutputObject, tmpDescriptionManyfest, tmpStep.InputHashAddressMap, tmpStep.OutputHashAddressMap, tmpSolutionContext);
				}
				else if (typeof(tmpStep.Operation) == 'object')
				{
					// You can even define an inline object operation!  This gets crazy fast
					this.solveOperation(tmpStep.Operation, tmpInputObject, tmpOutputObject, tmpDescriptionManyfest, tmpStep.InputHashAddressMap, tmpStep.OutputHashAddressMap, tmpSolutionContext);
				}
			}
		}

		if (tmpOperation.hasOwnProperty('Log') && tmpOperation.Log.hasOwnProperty('PostOperation'))
		{
			if (typeof(tmpOperation.Log.PostOperation) == 'string')
			{
				tmpOperation.SolutionContext.SolutionLog.push(tmpPrecedent.parseString(tmpOperation.Log.PostOperation));
			}
			else if (Array.isArray(tmpOperation.Log.PreOperation))
			{
				for (let i = 0; i < tmpOperation.Log.PostOperation.length; i++)
				{
					if ((typeof(tmpOperation.Log.PostOperation[i]) == 'string'))
					{
						tmpOperation.SolutionContext.SolutionLog.push(tmpPrecedent.parseString(tmpOperation.Log.PostOperation[i]));
					}
				}
			}
		}

		return tmpSolutionContext;
	}
};

module.exports = Elucidator;