/* ************************************************** *
 * ******************** REMIE
 * ************************************************** */
var Remie = require('../libs/index.js'),
//  remie = new (require('../libs/index.js'))(),
  EventEmitter = require('events').EventEmitter;
  //EventListener = require('events').EventListener;
var inherits = require('util').inherits;
myErr = new Error('Something went wrong')

let options = {}
options.internalMessage = 'I\'m the internal message for developer eyes only'
options.level = 'error'
options.code = 'server.400.forbidden'

var i18next = require('i18next')
i18next.init({
  lng: "en-US",
  nsSeparator: false,
  resources: {
    en: {
      translation: {
      "server" : {
        "400" : {
          "notFound": "The page could not be found",
          "forbidden": "The page is forbidden",
          "unauthorized": "You are not authorized to access this page"
          }
        }
      }
    }
  }
});

options.i18next = i18next

let locale = 'server.400.notFound'
let remie = new Remie(myErr, options)
let other = remie.create(locale, options) // sends locale as err 
let other2 = remie.create(locale, options) // does not have i18next
let copy = remie.copy(other)
console.log(other)
console.log(other2)
try {
  let exRich = notReal.create("Something went wrong", {}); // calls a function that doesn't exist, throws error
} catch (e) { // error is caught here
  var exRemie = remie.create(e, options) // uses the error and options to create new RichError
  console.log(exRemie)
}
remie.create(undefined, options)