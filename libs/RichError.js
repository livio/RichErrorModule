let EventEmitter = require('events');
//module.exports = function() {
console.log('module was called')
let i18next = require('i18next'),
  _ = require('lodash');

  const ERROR_LEVEL_FATAL = 'fatal',
    ERROR_LEVEL_ERROR = 'error',
    ERROR_LEVEL_WARN = 'warn',
    ERROR_LEVEL_INFO = 'info',
    ERROR_LEVEL_DEBUG = 'debug',
    ERROR_LEVEL_TRACE = 'trace';
  
  const DEFAULT_ERROR_MESSAGE = "Internal server error!",
    DEFAULT_ERROR_LOCALE = "server.500.generic";

  class RichError{
    constructor(err, options, i18next, locale) {
      console.log('RE constructor was called')
      this.build(err, options, locale)
    };

    build(err, options = {}, locale) {
      console.log('build was called') //temp
      let self = this;
      console.log(self)
      if(err === undefined) {
        if (options.internalMessage !== undefined) {
          console.log(options.internalMessage)
        };
        return undefined
      } else {
        if (err instanceof RichError) {
          self.set(err.toObject());
        } else {
          if (err instanceof Error) {
            self.set(this.buildFromSystemError(err, options));
          } else if(typeof err === 'string' || err instanceof String) {
            if (i18next && i18next.exists(err)) { 
              self.set(this.buildFromLocale(locale, options));// sent err before but buildFromLocale had locale as parameter
            } else {
              self.set(this.buildFromString(err, options));
            }
          } else {
            self.set(err);
          }
        }
      }
      return this;
    };
    buildFromSystemError(err = new Error(DEFAULT_ERROR_MESSAGE), options = {}) { // 'Internal server error!'
      console.log('buildFromSystemError was called') //temp
      let richErrorObject = {};
      richErrorObject.error = err;
      richErrorObject.error.code = (err.code) ? err.code.toLowerCase() : undefined;
      richErrorObject.internalOnly = (options.internalOnly === true) ? true : false;
      richErrorObject.internalMessage = options.internalMessage || undefined;
      richErrorObject.level = options.level || ERROR_LEVEL_ERROR; // 'error'
      richErrorObject.messageData = options.messageData || undefined;
      richErrorObject.options = options;
      richErrorObject.referenceData = options.referenceData || undefined;
      richErrorObject.statusCode = options.statusCode || 500;
      return richErrorObject;
    };

    buildFromLocale(locale = DEFAULT_ERROR_LOCALE, options = {}) { // 'server.500.generic'
      console.log('buildFromLocale was called') //temp
      let richErrorObject = {};
      richErrorObject.error = new Error(i18next.t(locale, options.i18next));
      richErrorObject.error.code = locale.toLowerCase();
      richErrorObject.internalOnly = (options.internalOnly === true) ? true : false;
      richErrorObject.internalMessage = options.internalMessage || undefined;
      richErrorObject.level = options.level || ERROR_LEVEL_ERROR; // 'error'
      richErrorObject.messageData = options.i18next;
      richErrorObject.options = options;
      richErrorObject.referenceData = options.referenceData || undefined;
      richErrorObject.statusCode = options.statusCode || this.guessStatusCodeOfLocale(locale);
      return richErrorObject;
    };

    buildFromString(errorString = DEFAULT_ERROR_MESSAGE, options = {}) { // 'Internal server error!'
      console.log('buildFromString was called') //temp
      let richErrorObject = {};
      richErrorObject.error = new Error(errorString);
      richErrorObject.error.code = (options.code) ? options.code.toLowerCase() : undefined;
      richErrorObject.internalOnly = (options.internalOnly === true) ? true : false;
      richErrorObject.internalMessage = options.internalMessage || undefined;
      richErrorObject.level = options.level || ERROR_LEVEL_ERROR; // 'error'
      richErrorObject.messageData = options.messageData || undefined;
      richErrorObject.options = options;
      richErrorObject.referenceData = options.referenceData || undefined;
      richErrorObject.statusCode = options.statusCode || 500;
      return richErrorObject;
    };

    get(key) {
      switch (key) {
        case "code":
        case "stack":
          return (this.error) ? this.error[key] : undefined;
        default:
          return this[key];
      }
    };

    set(richErrorObject) { 
      console.log('set was called') //temp
      // Node.js error object.  Contains two important child attributes "code" and "stack".
      if(richErrorObject.error instanceof Error) {
        this.error = richErrorObject.error;
      } else if(richErrorObject.error !== null && typeof richErrorObject.error === 'object') {
        this.error = new Error(richErrorObject.error.message);
        this.error.code = richErrorObject.error.code;
        this.error.stack = richErrorObject.error.stack;
      }

      // When true, the error should not be shown to an external client.
      this.internalOnly = richErrorObject.internalOnly;

      // An additional message to be displayed internally only.
      this.internalMessage = richErrorObject.internalMessage;

      // The error level, e.g. fatal, error, warn, info, debug, trace.
      this.level = richErrorObject.level;

      // Data that was used to create the error message, usually by i18next.
      this.messageData = richErrorObject.messageData;

      // The options used to create the Rich Error.
      this.options = richErrorObject.options;

      // Data that may have caused or is related to the error.
      this.referenceData = richErrorObject.referenceData;

      // HTTP status code associated with the error.
      this.statusCode = richErrorObject.statusCode;

      return this;
    };
  }
//  return RichError
//};
module.exports = RichError



var inherits = require('util').inherits;  