/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Elucidator simple logging shim (for browser and dependency-free running)
*/

const logToConsole = (pLogLine, pLogObject, pLogLevel) =>
{
    let tmpLogLine = (typeof(pLogLine) === 'string') ? pLogLine : '';
    let tmpLogLevel = (typeof(pLogLevel) === 'string') ? pLogLevel : 'INFO';

    console.log(`[Elucidator:${tmpLogLevel}] ${tmpLogLine}`);

    if (pLogObject) console.log(JSON.stringify(pLogObject,null,4)+"\n");
};

const logInfo = (pLogLine, pLogObject) =>
{
    logToConsole(pLogLine, pLogObject, 'Info');
};


const logWarning = (pLogLine, pLogObject) =>
{
    logToConsole(pLogLine, pLogObject, 'Warning');
};


const logError = (pLogLine, pLogObject) =>
{
    logToConsole(pLogLine, pLogObject, 'Error');
};

module.exports = (
{
    logToConsole: logToConsole,
    info: logInfo,
    warning: logWarning,
    error: logError
});