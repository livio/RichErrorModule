let Remie = require('./index.js');


let sanitizeError = function(instance, options = {}) {
  let obj = {};

  if(instance["error"]) {
    if (options.message !== false && instance.error.message !== undefined) {
      obj.message = instance.error.message;
    }

    if (options.code !== false && instance.error.code !== undefined) {
      obj.code = instance.error.code;
    }

    if (options.stack === true && instance.error.stack !== undefined) {
      obj.stack = instance.error.stack;
    }
  }

  return obj;
};

class RichError{
  constructor(err, options, remie) {
    return this.build(err, options, remie)
  };

  build(err, options = {}, remie) {
    let self = this,
      obj;

    if(err) {
      let errHasType;
      if (err instanceof String) {
        errHasType = 'string';
      } else if (err instanceof RichError) {
        errHasType = 'richError';
      } else if (err instanceof Error) {
        errHasType = 'error';
      } else {
        errHasType = typeof err;
      }

      switch (errHasType) {
        // Already a RichError, so copy the error
        case 'richError':
          obj = err.toObject(err);
          break;

        // Convert a Node.js error to a RichError
        case 'error':
          obj = this.buildFromSystemError(err, options, remie);
          break;

        // Attempt to translate string as a locale in i18next,
        // otherwise build from a string.
        case 'string':
          if (remie.i18next && remie.i18next.exists(err)) {
            obj = this.buildFromLocale(err, options, remie);
          } else {
            obj = this.buildFromString(err, options, remie);
          }
          break;

        default:
          obj = err;
          break;

      }
    }

    if( ! options.sanitizeOptions) {
      options.sanitizeOptions = remie.defaultSanitizeOptions;
    }

    obj = self.applyBuildOptions(options, obj);
    self.set(obj, remie);
    return this;
  };

  applyBuildOptions(options = {}, obj = {}) {
    obj.internalMessage = options.internalMessage || undefined;
    obj.messageData = options.messageData || undefined;
    obj.referenceData = options.referenceData || undefined;

    if(options.internalOnly !== undefined) {
      obj.internalOnly = (options.internalOnly === true) ? true : false;
    } else if(obj.internalOnly === undefined) {
      obj.internalOnly = false;
    }

    if(options.level) {
      obj.level = options.level;
    } else if( ! obj.level) {
      obj.level = Remie.ERROR_LEVEL_ERROR;
    }

    if(options.httpStatusCode) {
      obj.httpStatusCode = options.httpStatusCode;
    } else if( ! obj.httpStatusCode) {
      obj.httpStatusCode = 500;
    }

    if(options.sanitizeOptions) {
      obj.sanitizeOptions = options.sanitizeOptions;
    }

    return obj;
  }

  buildFromSystemError(err, options = {}, remie) {
    if( ! err) {
      err = new Error(remie.defaultErrorMessage);
    }

    let obj = {};
    obj.error = err;

    if(err.code) {
      if(typeof err.code.toLowerCase == 'function') {
        obj.error.code = err.code.toLowerCase();
      }
      obj.error.code = err.code;
    }
    return obj;
  };

  buildFromLocale(locale, options = {}, remie) {
    if( ! locale) {
      locale = remie.defaultErrorLocale
    }

    let obj = {};
    obj.error = (remie.i18next) ? new Error(remie.i18next.t(locale, options.messageData)) : new Error(locale);
    obj.httpStatusCode = options.httpStatusCode || this.guessStatusCodeOfLocale(locale, remie);
    obj.messageData = options.messageData;

    if(typeof locale.toLowerCase == 'function') {
        obj.error.code = locale.toLowerCase();
    }
    obj.error.code = locale;

    return obj;
  };

  buildFromString(errorString, options = {}, remie) {
    if( ! errorString) {
      errorString = remie.defaultErrorMessage;
    }

    let obj = {};
    obj.error = new Error(errorString);

    if(options.error && options.error.code) {
      if(typeof options.error.code.toLowerCase == 'function') {
        obj.error.code = options.error.code.toLowerCase();
      }
      obj.error.code = options.error.code;
    }

    return obj;
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

  guessStatusCodeOfLocale(locale, remie) {
    if( ! locale) {
      locale = remie.defaultErrorLocale;
    }
    switch (locale) {
      case "server.400.forbidden":
        return 403;
      case "server.400.notfound":
        return 404;
      case "server.400.unauthorized":
        return 401;
      default:
        let categories = locale.split(".");
        if (categories[0] == "server") {
          return Number(categories[1]);
        }
        
        return 500;
    }
  };

  /**
   * Set's this instance's attributes using the same attributes
   * found in the passed object.
   * @param obj contains the same attributes to be applied.
   * @param remie is the current instance of the Remie class.
   * @returns {RichError} an reference to this instance.
   */
  set(obj, remie) {
    // Node.js error object.  Contains two important child attributes "code" and "stack".
    if(obj.error instanceof Error) {
      this.error = obj.error;
    } else if(obj.error !== null && typeof obj.error === 'object') {
      this.error = new Error(obj.error.message);
      this.error.code = obj.error.code;
      this.error.stack = obj.error.stack;
    }

    // HTTP status code associated with the error.
    this.httpStatusCode = obj.httpStatusCode;

    // When true, the error should not be shown to an external client.
    this.internalOnly = obj.internalOnly;

    // An additional message to be displayed internally only.
    this.internalMessage = obj.internalMessage;
 
    // The error level, e.g. fatal, error, warn, info, debug, trace.
    this.level = obj.level;

    // Data that was used to create the error message, usually by i18next.
    this.messageData = obj.messageData;

    // The options used to create the Rich Error.
    this.options = obj.options;

    // Data that may have caused or is related to the error.
    this.referenceData = obj.referenceData;

    // The default options used by the sanitize method
    this.sanitizeOptions = obj.sanitizeOptions;

    // Handle the creation of an internal message.
    if(remie && this.internalMessage) {
      remie.handle(Remie.ON_CREATE_INTERNAL_MESSAGE, this, obj);
    }

    return this;
  };

  toObject() {
    return {
      error: {
        code: this.error.code,
        message: this.error.message,
        stack: this.error.stack
      },
      httpStatusCode: this.httpStatusCode,
      internalOnly: this.internalOnly,
      internalMessage: this.internalMessage,
      level: this.level,
      messageData: this.messageData,
      referenceData: this.referenceData,
      sanitizeOptions: this.sanitizeOptions
    };
  };

  sanitizeResponseObject(instance, options = {}, obj) {
    for(var key in instance) {
      if (instance.hasOwnProperty(key)) {
        if (options[key] !== false && instance[key] !== undefined) {
          switch (key) {

            case "internalMessage":
            case "internalOnly":
            case "sanitizeOptions":
              break;

            default:
              obj[key] = instance[key];
              break;

            case "error":
              obj[key] = sanitizeError(instance, options[key]);
              break;
          }
        }
      }
    }
    return obj;
  }

  sanitize(options) {
    let self = this,
      obj = {};

    if(options === undefined) {
      options = self.sanitizeOptions || {};
    }

    // Do not return internal only errors to a client.
    if(self.internalOnly === true || options.internalOnly === true) {
      obj = undefined;
    } else {
      obj = self.sanitizeResponseObject(self, options, obj);
    }

    return obj;
  }
  
}

module.exports = RichError;