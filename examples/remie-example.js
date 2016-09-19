/* ************************************************** *
 * ******************** REMIE
 * ************************************************** */
var Remie = require('../libs/index.js'),
  remie = new Remie(),
  EventEmitter = require('events').EventEmitter,
  inherits = require('util').inherits,
  myErr = new Error('Something went wrong'),
  options = {};
options.internalMessage = 'I\'m the internal message for developer eyes only'
// explain
options.level = 'error'
// explain
options.code = 'server.400.forbidden'

var i18next = require('i18next')
// explain
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

console.log("\n\n/* ******************** Rich Error Default Example ******************** */\n");

var defRich = remie.create();

console.log(defRich)


console.log("\n\n/* ******************** Rich Error Example ******************** */\n");

var exRich = remie.create(myErr, options)

console.log(exRich)


console.log("\n\n/* ******************** Rich Error With A Caught Error ******************** */\n");

try {
  let exRich = notReal.create("Something went wrong", {}); // calls a function that doesn't exist, throws error
} catch (e) { // error is caught here
  var exRemie = remie.create(e, options) // uses the error and options to create new RichError

  console.log(exRemie)


  console.log("\n\n/* ******************** Rich Error toResponseObject ******************** */\n");

  console.log(exRemie.toResponseObject())


  console.log("\n\n/* ******************** Rich Error removeEmptyProps ******************** */\n");

  console.log(remie.create(e).removeEmptyProps())
}