/* ************************************************** *
 * ******************** Module Variables & Constants
 * ************************************************** */

var i18next = require('i18next'), 
  EventEmitter = require('events').EventEmitter,
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
    let self = this
    process.on('uncaughtException', function(err){
      console.log('REMIE detected an error!')
      var richieRich = self.create(err)
      console.log(richieRich)
      return richieRich
    })
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

  /* ************************************************** *
   * ******************** Private Methods
   * ************************************************** */

   onErrorHandler(target){

   }


  log(logger) {
    //console.log('log was called') //temp
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

  handle(event, data, options, cb) {
    //console.log('handle was called')
    this.emit(event, data, options);
    if (this.handlers[event]) {
      this.handlers[event](data, options, cb, this);
    }
    return this;
  }
  
  onLog(data, options = {}) {
    //console.log('onLog was called')
    if (this.log && data) {
      let method = this.log[options.level || "info"];
      method.apply(this.log, data);
    }
  };

  setDefault() {
    //console.log('setDefault was called') //temp
    this.i18next = i18next;
    this.log = undefined;

    // adds event listeners
    this.on(REMIE.ON_LOG, this.onLog);
    
    // add default handlers
    this.handlers = {};
    this.use(REMIE.HANDLER_TYPE_ERROR, HANDLER_INTERNAL_ERROR)
    this.use(REMIE.ON_REPLY_ERROR, this.onReplyError);
    this.use(REMIE.ON_REPLY_ERROR_TO_OBJECT, this.onReplyErrorToObject);
    this.use(REMIE.ON_SANITIZE_DATA, this.onSanitizeData);
    this.use(REMIE.ON_TRANSLATE, this.onTranslate);
    return this;
  }

  onSanitizeData(data, options = {}, cb, riposte) {
    //console.log('onSanitizeData was called')
    cb(undefined, data);
  }

  onTranslate(data, options = {}, cb, riposte) {
    //console.log('onTranslate was called')
    let self = this || self;

    let i18next = self.get("i18next");
    if(i18next) {
      cb(undefined, i18next.t(data, options));
    } else {
      cb(undefined, data);
    }
  }

  use(type, method) {
    //console.log('use was called') //temp
    this.handlers[type] = method;
    return this;
  }

  static get ON_LOG() { return "log" }
  static get HANDLER_INTERNAL_ERROR() {return 'internal error'}
  static get ON_REPLY_ERROR() { return "reply-error" }
  static get ON_REPLY_ERROR_TO_OBJECT() { return "reply-error-to-object" }
  static get ON_SANITIZE_DATA() { return "sanitize-data" }
  static get ON_TRANSLATE() { return "translate" }
};

util.inherits(REMIE, EventEmitter)


/* ************************************************** *
 * ******************** Require Other Classes
 * ************************************************** */
let RichError = require('./RichError.js')
module.exports = REMIE

const HANDLER_INTERNAL_ERROR = function(err, options, locale) {
  //console.log('HANDLER_INTERNAL_ERROR was called') //temp
  if (err.internalMessage) {
    console.log('Internal Error %s', err)
  }
}