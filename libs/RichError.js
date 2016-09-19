let EventEmitter = require('events').EventEmitter;
var i18next;
const ERROR_LEVEL_FATAL = 'fatal',
  ERROR_LEVEL_ERROR = 'error',
  ERROR_LEVEL_WARN = 'warn',
  ERROR_LEVEL_INFO = 'info',
  ERROR_LEVEL_DEBUG = 'debug',
  ERROR_LEVEL_TRACE = 'trace',
  DEFAULT_ERROR_MESSAGE = "Internal server error!",
  DEFAULT_ERROR_LOCALE = "server.500.generic";

class RichError{
  constructor(err, options, remie) {
    this.build(err, options, remie)
  };

  build(err, options = {}, remie) { // if called without using Remie.create() then a Remie instance must be supplied
    // add space and comments here
    // determine err type/instance in one line then add switch statement
    if (!i18next) {
      let i18next = this.seti18next(options)
    }
    let self = this;
    if(err === undefined) {
      if (options.internalMessage !== undefined) {
        if (remie) {
          remie.emit('internalError', options.internalMessage)
        }
      };
      return undefined
    } else {

      // if already a rich error, copy the error
      if (err instanceof RichError) {
        self.set(err.toObject(err));
      } else {

        // if a Node.js error, convert to rich error
        if (err instanceof Error) {
          self.set(this.buildFromSystemError(err, options));

        // if a string, attempt to lookup in i18next and create new rich error
        } else if(typeof err === 'string' || err instanceof String) {
          if (i18next && i18next.exists(err)) { 
            self.set(this.buildFromLocale(err, options));// err is a locale
          } else {
            self.set(this.buildFromString(err, options));
          }

        // This is just an object or method, probably invalid
        } else {
          self.set(err);
        }
      }
    }
    return this;
  };
  buildFromSystemError(err = new Error(DEFAULT_ERROR_MESSAGE), options = {}) { // 'Internal server error!'
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
    let richErrorObject = {};
    i18next = this.seti18next(options)
    richErrorObject.error = (i18next) ? new Error(i18next.t(locale, options.i18next)) : new Error(locale); // options.i18next can not be i18next because of this line. It would mean calling translate on itself
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
      case "message":
        return (this.error) ? this.error[key] : undefined;
      default:
        return this[key];
    }
  };

  guessStatusCodeOfLocale(locale) {
    switch (locale) {
    //case "server.400.badRequest":
      //  return 400;
      case "server.400.forbidden":
        return 403;
      case "server.400.notFound":
        return 404;
      case "server.400.unauthorized":
        return 401;
      case undefined:
        return 500; //find out what happens as a result of this
      default:
        let categories = locale.split(".");
        if (categories.length != 0) {
          if (categories[0] == "server") {
            return Number(categories[1]);
          }
        }
        
        return 500;
    }
  };

  set(richErrorObject) { 
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

  toObject() {
    let self = this
    return { //possibly need to restructure to work when one or more values is not given
      error: {
        code: self.error.code,
        message: self.error.message,
        stack: self.error.stack
      },
      internalOnly: self.internalOnly,
      internalMessage: self.internalMessage,
      level: self.level,
      messageData: self.messageData,
      options: self.options,
      referenceData: self.referenceData,
      statusCode: self.statusCode
    };
  };

  toResponseObject(options = {}) { // Is this supposed to be what is returned to the user? Yes
    //change name
    let self = this,
      obj = {}; 
    if(self.internalOnly !== true && options.internalOnly !== false) { 
      if (self.error && options.error !== false) {
        let error = {},
          errorOptions = options.error || {};
        if (self.error.message && errorOptions.message !== false) {
          error.message = self.error.message;
        }
        if (self.error.code && errorOptions.code !== false) {
          error.code = self.error.code;
        }
        if (self.error.stack && errorOptions.stack !== false) {
          error.stack = self.error.stack; //causes stack to be put on one line when logging entire RichError but not when logging stack only 
        }
        obj.error = error;
      }
      if(self.referenceData && options.referenceData !== false) {
        obj.referenceData = self.referenceData;
      }
      if(self.level && options.level !== false) {
        obj.level = self.level;
      }
      if(self.messageData && options.messageData !== false) {
        obj.messageData = self.messageData;
      }
      if(self.statusCode && options.statusCode !== false) {
        obj.statusCode = self.statusCode;
      }
      return obj;
    } else {
      return undefined;
    }
  }
  seti18next(options = {}) {
    if (options.i18next) {
      var i18next = options.i18next;
      delete options.i18next
      return i18next
    } else {
      return undefined
    }
  }
  removeEmptyProps() {
    let self = this;
    //prototypical inheritance
    /*if(!this.error) {
      delete this.error
    } else {
      if (!this.error.code) {
      delete this.error.code
      }
      if (!this.error.message) {
        delete this.error.message
      }
      if (!this.error.stack) {
        delete this.error.stack
      }
    }
    if (typeof this.internalOnly != 'boolean') {
      delete this.internalOnly
    }
    if (!this.internalMessage) {
      delete this.internalMessage
    }
    if (!this.level) {
      delete this.level
    }
    if (!this.messageData) {
      delete this.messageData
    }
    if (!this.referenceData) {
      delete this.referenceData
    }
    if (!this.statusCode) {
      delete this.statusCode
    }
    return this*/
  }
};
module.exports = RichError