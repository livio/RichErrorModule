/* ************************************************** *
 * ******************** Module Variables & Constants
 * ************************************************** */

var i18next = require('i18next'), 
  EventEmitter = require('events').EventEmitter,
  inherits = require('util').inherits;

/* ************************************************** *
 * ******************** RichError Class
 * ************************************************** */

class Remie {
  constructor(err, options = {}) {
    this.on('internalError', function(internalMessage) {
      console.log(internalMessage)
    })
    return this
  };

  create(err, options = {}, remie = new Remie()) {
    return new RichError(err, options, remie)
  }

  buildInternal(err, options = {}, remie = new Remie()) { // err must be RichError, Error, or locale
    options.internalOnly = true;
    return new RichError(err, options, remie);
  };

  copy(rich) {
    return new RichError(rich.toObject());
  };
};
inherits(Remie, EventEmitter)

/* ************************************************** *
 * ******************** Require Other Classes
 * ************************************************** */
var RichError = require('./RichError.js')
module.exports = Remie