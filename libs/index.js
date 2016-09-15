/* ************************************************** *
 * ******************** Module Variables & Constants
 * ************************************************** */

var i18next = require('i18next'), 
  EventEmitter = require('events').EventEmitter,
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

class Remie {
  constructor(err, options = {}) {
    this.on('internalError', function(error){
      console.log('eventemitter worked')
      console.log(error)
    })
    return this
  };

  create(err, options = {}) {
    return new RichError(err, options)
  }

  static buildInternal(err, options) { 
    options.internalOnly = true;
    return new RichError(err, options);
  };

  copy(rich) {
    return new RichError(rich.toObject());
  };
};

util.inherits(Remie, EventEmitter)


/* ************************************************** *
 * ******************** Require Other Classes
 * ************************************************** */
let RichError = require('./RichError.js')
module.exports = Remie