/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Elucidator browser shim loader
*/

// Load the manyfest module into the browser global automatically.
var libElucidator = require('./Elucidator.js');

if (typeof(window) === 'object') window.Elucidator = libElucidator;

module.exports = libElucidator;