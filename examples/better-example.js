/* ************************************************** *
 * ******************** REMIE
 * ************************************************** */
let REMIE = require('../libs/index.js'),
//  remie = new (require('../libs/index.js'))(),
  i18next = require('i18next'),
  EventEmitter = require('events');
  //EventListener = require('events').EventListener;
var inherits = require('util').inherits;
err = 'server.400.notFound'

let options = {}
options.internalMessage = 'internal Message'
options.level = 'warning'
//options.code = 'server.400.notFound'

let locale = 'server.400.notFound'
let remie = new REMIE(err, options, locale)
let other = remie.create(err, options) 
let copy = remie.copy(other)
try {
  let exRich = RichError.create("Something went wrong", {});
} catch (e) {
  var exRemie = remie.create(e, options)
}

let exRich = notReal() // throw ReferenceError that is caught by remie
// program stops after the error
console.log(exRich + '2')
console.log('It\'s still running!')