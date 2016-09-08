/* ************************************************** *
 * ******************** REMIE
 * ************************************************** */
let REMIE = require('../libs/index.js'),
//  remie = new (require('../libs/index.js'))(),
  i18next = require('i18next'),
  EventEmitter = require('events');
  //EventListener = require('events').EventListener;
  //console.log(EventListener)
var inherits = require('util').inherits;
err = 'server.400.notFound'
//err.code = 'server.400.notFound'
//err.message = 'Message in an error!'
//err.stack = 'errors stacked on errors'
//err.internalMessage = 'internal message'

let options = {}
options.internalMessage = 'internal Message'
options.level = 'warning'
//options.code = 'server.400.notFound'

let locale = 'server.400.notFound'
let remie = new REMIE(err, options, locale) //rich Error
//let remie = REMIE.methodCaller()
//remie.i18next = i18next

inherits(REMIE, EventEmitter.EventEmitter)
//let error = remie.methodCaller() // remie
let other = remie.create(err, options, locale) 
let copy = remie.copy(other)
console.log(other)
console.log(copy)
//if (error == other) {
//  console.log('wooh')
//}
//let error = remie.create(err, options, locale)
//let error = remie.create(err, options)

//let error = remie.create('Something went wrong', options, locale)
//let error = remie.create("Something went wrong", {})
// |||
// vvv does not work if richErrorObject.error is undefined, null. must be object with property "message"
//let error2 = remie.toObject(error)
//let error2 = remie.create("Something else went wrong", {});
//let error3 = remie.create("Oh crap, what now", {});
//console.log(error)

//module.exports = error

/* expected output:
RichError {
  error: 
   { Error: server.500.generic
       at RichError.buildFromLocale (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:105:29)
       at RichError.build (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:76:27)
       at new RichError (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:56:10)
       at REMIE.create (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/index.js:38:12)
       at Object.<anonymous> (/Users/NicholasLivio/Documents/R2/REMIE-livio/examples/better-example.js:29:19)
       at Module._compile (module.js:541:32)
       at Object.Module._extensions..js (module.js:550:10)
       at Module.load (module.js:458:32)
       at tryModuleLoad (module.js:417:12)
       at Function.Module._load (module.js:409:3) code: 'server.500.generic' },
  internalOnly: false,
  internalMessage: 'internal Message',
  level: 'warning',
  messageData: undefined,
  options: { internalMessage: 'internal Message', level: 'warning' },
  referenceData: undefined,
  statusCode: 500 }
*/