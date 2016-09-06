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
err.code = 'server.400.notFound'
err.message = 'Message in an error!'
//err.stack = 'errors stacked on errors'
//err.internalMessage = 'internal message'

let options = {}
options.internalMessage = 'internal Message'
options.level = 'warning'
//options.code = 'server.400.notFound'

let locale = 'server.400.notFound'

remie.i18next = i18next

inherits(REMIE, EventEmitter.EventEmitter)

let error = remie.create('Something went wrong', options, locale)
//let error = remie.create("Something went wrong", {})
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