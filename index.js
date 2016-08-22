/* ************************************************** *
 * ******************** Module Variables & Constants
 * ************************************************** */

var i18next = require('i18next')
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

class RichError {
  constructor(err, options, i18next, locale) {
    this.build(err, options, locale);
  };

  static buildInternal(err, options) { 
    console.log('static was called') //temporary
    options.internalOnly = true;
    return new RichError(err, options);
  };

  copy() {
    return new RichError(this.toObject());
  };

/* ************************************************** *
 * ******************** Private Methods
 * ************************************************** */

  guessStatusCodeOfLocale(locale) {
    console.log("guessStatusCodeOfLocale") //temp
    switch (locale) {
      //case "server.400.badRequest":
      //  return 400;
      case "server.400.forbidden":
        return 403;
      case "server.400.notFound":
        return 404;
      case "server.400.unauthorized":
        return 401;
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

  build(err, options = {}, locale) {
    console.log('build was called') //temp
    let self = this;
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

  toObject() {
    console.log('toObject was called') // temp
    return {
      error: {
        code: this.error.code,
        message: this.error.message,
        stack: this.error.stack
      },
      internalOnly: this.internalOnly,
      internalMessage: this.internalMessage,
      level: this.level,
      messageData: this.messageData,
      options: this.options,
      referenceData: this.referenceData,
      statusCode: this.statusCode
    };
  };

  log(logger) {
    console.log('log was called') //temp
    if(this.internalMessage) {
      logger[this.level](this.internalMessage);
    }
    if(this.error) {
      logger[this.level](JSON.stringify(this.error, undefined, 2));
      if(this.error.stack) {
        logger[this.level]("Stack Trace: %s", this.error.stack);
      }
    }
  };

  toResponseObject(options = {}) {
    console.log('toResponseObject was called') //temp
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
          error.stack = self.error.stack;
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
};
module.exports = RichError