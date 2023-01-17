// Solution providers are meant to be stateless, and not classes.
// These solution providers are akin to drivers, connecting code libraries or 
// other types of behavior to mapping operations.

let libElucidatorInstructionSet = require('../Elucidator-InstructionSet.js');

const groupValuesBy = (pOperation) =>
{
    let tmpInputDataSet = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'inputDataSet');
    let tmpGroupByProperty = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'groupByProperty');
    let tmpGroupValueProperty = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'groupValueProperty');

    let tmpOutputDataSet = {};
 
    let tmpObjectType = typeof(tmpInputDataSet);

    if (tmpObjectType == 'object')
    {
        if (Array.isArray(tmpInputDataSet))
        {
            for (let i = 0; i < tmpInputDataSet.length; i++)
            {
                if (typeof(tmpInputDataSet[i]) !== 'object')
                {
                    pOperation.logInfo(`Element [${i}] was not an object; skipping group operation.`);
                }
                else
                {
                    let tmpValue = tmpInputDataSet[i];
                    let tmpGroupByValue = tmpValue[tmpGroupByProperty];
                    if (!tmpValue.hasOwnProperty(tmpGroupByProperty))
                    {
                        pOperation.logInfo(`Element [${i}] doesn't have the group by property [${tmpGroupByProperty}]; setting group to [__NO_GROUP].`);
                        tmpGroupByValue = '__NO_GROUP';
                    }

                    if (!tmpValue.hasOwnProperty(tmpGroupValueProperty))
                    {
                        pOperation.logInfo(`Element [${i}] doesn't have the group value property [${tmpGroupValueProperty}]; skipping group operation.`);
                    }
                    else
                    {
                        if (!tmpOutputDataSet.hasOwnProperty(tmpGroupByValue))
                        {
                            // Create a new grouped value
                            pOperation.logInfo(`Creating a new group [${tmpGroupByValue}] for element [${i}].`);
                            tmpOutputDataSet[tmpGroupByValue] = [];
                        }

                        tmpOutputDataSet[tmpGroupByValue].push(tmpValue[tmpGroupValueProperty]);
                    }
                }
            }
        }
        else
        {
            let tmpObjectKeys = Object.keys(tmpInputDataSet);
            for (let i = 0; i < tmpObjectKeys.length; i++)
            {
                if (typeof(tmpInputDataSet[tmpObjectKeys[i]]) !== 'object')
                {
                    pOperation.logInfo(`Element [${i}] was not an object; skipping group operation.`);
                }
                else
                {
                    let tmpValue = tmpInputDataSet[tmpObjectKeys[i]];
                    let tmpGroupByValue = tmpValue[tmpGroupByProperty];
                    if (!tmpValue.hasOwnProperty(tmpGroupByProperty))
                    {
                        pOperation.logInfo(`Element [${tmpObjectKeys[i]}][${i}] doesn't have the group by property [${tmpGroupByProperty}]; setting group to [__NO_GROUP].`);
                        tmpGroupByValue = '__NO_GROUP';
                    }

                    if (!tmpValue.hasOwnProperty(tmpGroupValueProperty))
                    {
                        pOperation.logInfo(`Element [${tmpObjectKeys[i]}][${i}] doesn't have the group value property [${tmpGroupValueProperty}]; skipping group operation.`);
                    }
                    else
                    {
                        if (!tmpOutputDataSet.hasOwnProperty(tmpGroupByValue))
                        {
                            // Create a new grouped value
                            pOperation.logInfo(`Creating a new group [${tmpGroupByValue}] for element [${tmpObjectKeys[i]}][${i}].`);
                            tmpOutputDataSet[tmpGroupByValue] = [];
                        }

                        tmpOutputDataSet[tmpGroupByValue].push(tmpValue[tmpGroupValueProperty]);
                    }
                }
            }
        }
    }
    else
    {
        pOperation.logError(`Input set is neither an Array nor an Object`);
    }

    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'outputDataSet', tmpOutputDataSet);

    return true;
}

class Set extends libElucidatorInstructionSet
{
    constructor(pElucidator)
    {
        super(pElucidator);
        this.namespace = 'Set';
    }

    initializeInstructions()
    {
        // Logic actually wants a noop instruction!
        super.initializeInstructions();

        this.addInstruction('groupvaluesby', groupValuesBy);

        return true;
    }

    initializeOperations()
    {
        this.addOperation('groupvaluesby', require(`./Operations/Set-GroupValuesBy.json`));

        return true;
    }
}

module.exports = Set;