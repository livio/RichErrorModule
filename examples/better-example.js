/* ************************************************** *
 * ******************** REMIE
 * ************************************************** */
let REMIE = require('../libs/index.js'),
  remie = new (require('../libs/index.js'))(),
  i18next = require('i18next'),
  EventEmitter = require('events');
  //EventListener = require('events').EventListener;
  //console.log(EventListener)
var inherits = require('util').inherits;
  err = {}
  err.code = 'wooh!'
  err.message = 'Message in an error!'
  err.stack = 'errors stacked on errors'
  err.internalMessage = 'internal message'

remie.i18next = i18next
//console.log(remie, '2')
inherits(REMIE, EventEmitter.EventEmitter)

//let error = remie.create(err, {})
let error = remie.create("Something went wrong", {})
// |||
// vvv does not work if richErrorObject.error is undefined, null. must be object with property "message"
//let error2 = remie.toObject(error)
//let error2 = remie.create("Something else went wrong", {});
//let error3 = remie.create("Oh crap, what now", {});
console.log(error)

/*
remie.on('on-internal-error', function(err){
  console.log("Internal Error %s", err.internalMessage);
});
var event = 'on-internal-error'
remie.emit(event, err)
*/