/* ************************************************** *
 * ******************** Module Variables & Constants
 * ************************************************** */

var i18next = require('i18next'), 
  EventEmitter = require('events').EventEmitter,
  inherits = require('util').inherits,
  RichError;

const DEFAULT_ERROR_MESSAGE = "Internal server error!",
  DEFAULT_ERROR_LOCALE = "server.500.generic";


/* ************************************************** *
 * ******************** RichError Class
 * ************************************************** */

class Remie {
  constructor(options = {}) {
    // Must require RichError here so it can access the
    // static methods for Remie.
    RichError = require('./RichError.js');

    this.set(options);

    return this;
  };

  createInternal(err, options = {}) {
    options.internalOnly = true;
    return new RichError(err, options, this);
  };

  copy(richError = {}) {
    return new RichError(richError.toObject());
  };

  create(err, options = {}) {
    return new RichError(err, options, this)
  }

  get(key) {
    return this[key];
  }

  handle(event, data, options) {
    this.emit(event, data, options);
  }

  set(options = {}) {
    if(options.i18next) {
      this.i18next = options.i18next;
    }
    this.defaultErrorMessage = options.defaultErrorMessage || DEFAULT_ERROR_MESSAGE;
    this.defaultErrorLocale = options.defaultErrorLocale || DEFAULT_ERROR_LOCALE;
  }

  static get ERROR_LEVEL_FATAL() { return "fatal" }
  static get ERROR_LEVEL_ERROR() { return "error" }
  static get ERROR_LEVEL_WARN() { return "warn" }
  static get ERROR_LEVEL_INFO() { return "info" }
  static get ERROR_LEVEL_DEBUG() { return "debug" }
  static get ERROR_LEVEL_TRACE() { return "trace" }
  static get ON_CREATE_INTERNAL_MESSAGE() { return "create-internal-message" }

}

/* ************************************************** *
 * ******************** Require Other Classes
 * ************************************************** */

// Add the event emitter to the Remie class.
inherits(Remie, EventEmitter);

// Export Remie module.
module.exports = Remie;