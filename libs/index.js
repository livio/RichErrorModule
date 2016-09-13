/* ************************************************** *
 * ******************** Module Variables & Constants
 * ************************************************** */

var i18next = require('i18next'), 
//  EventEmitter = require('events').EventEmitter,
//  addEventListener = require('events').addEventListener,
  util = require('util');
const ERROR_LEVEL_FATAL = 'fatal',
  ERROR_LEVEL_ERROR = 'error',
  ERROR_LEVEL_WARN = 'warn',
  ERROR_LEVEL_INFO = 'info',
  ERROR_LEVEL_DEBUG = 'debug',
  ERROR_LEVEL_TRACE = 'trace';
  
const DEFAULT_ERROR_MESSAGE = "Internal server error!",
  DEFAULT_ERROR_LOCALE = "server.500.generic";


/* ************************************************** *
 * ******************** RichError Class
 * ************************************************** */

class REMIE {
  constructor(err, options = {}) {
    return this
  };

  create(err, options = {}) {
    //console.log('create was called')
    return new RichError(err, options)
  }

  static buildInternal(err, options) { 
    //console.log('static was called') //temporary
    options.internalOnly = true;
    return new RichError(err, options);
  };

  copy(rich) {
    //console.log('copy was called')
    return new RichError(rich.toObject()); //change to RichError when errors are fixed
  };
};

//util.inherits(REMIE, EventEmitter)


/* ************************************************** *
 * ******************** Require Other Classes
 * ************************************************** */
let RichError = require('./RichError.js')
module.exports = REMIE