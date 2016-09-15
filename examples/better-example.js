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
/*
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

/*let myEmit = new EventEmitter()
myEmit.on('internalError', function(err){
  console.log(err)
})
myEmit.emit('internalError', 'its working')*/

console.log("\n\n/* ******************** Rich Error Default Example ******************** */\n");
var remie = new Remie(),
  defRich = remie.create();
console.log(defRich)
// RichError {}
console.log("\n\n/* ******************** Rich Error Example ******************** */\n");
var exRich = remie.create(myErr, options).toResponseObject() // call toResponseObject to remove any empty properties
console.log(exRich)
/* 
{ error: 
  { message: 'Something went wrong',
    stack: 'Error: Something went wrong\n    at /Users/You/wherever/your-file\n at here\n at there' },
  level: 'error',
  statusCode: 500 }
*/
console.log("\n\n/* ******************** Rich Error With A Caught Error ******************** */\n");
try {
  let exRich = notReal.create("Something went wrong", {}); // calls a function that doesn't exist, throws error
} catch (e) { // error is caught here
  var exRemie = remie.create(e, options) // uses the error and options to create new RichError
  console.log(exRemie)
/*
RichError {
  error: 
   { ReferenceError: notReal is not defined
       at Object.<anonyomous> (/Users/You/wherever/your-file)
       at here
       at there
       at file:line:col code: undefined },
  internalOnly: false,
  internalMessage: 'I\'m the internal message for developer eyes only',
  level: 'error',
  messageData: undefined,
  options: 
   { internalMessage: 'I\'m the internal message for developer eyes only',
     level: 'error',
     code: 'server.400.forbidden' },
  referenceData: undefined,
  statusCode: 500 }
*/
  console.log("\n\n/* ******************** Rich Error toResponseObject ******************** */\n");
  console.log(exRemie.toResponseObject())
/*
{ error: 
   { message: 'notReal is not defined',
     stack: 'ReferenceError: notReal is not defined\n    at Object.<anonymous> (/Users/You/wherever/your-file)\n    at here\n    at there\n    at file:line:col' },
  level: 'error',
  statusCode: 500 }
*/
  console.log("\n\n/* ******************** Rich Error removeEmptyProps ******************** */\n");
  console.log(remie.create(e).removeEmptyProps())
/*
RichError {
  error: 
   ReferenceError: notReal is not defined
      at Object.<anonymous> (/Users/You/wherever/your-file)
      at here
      at there
      at file:line:col,
  internalOnly: false,
  level: 'error',
  options: {},
  statusCode: 500 }
*/
}
myErr = { error: 
   { message: 'notReal is not defined',
     stack: 'ReferenceError: notReal is not defined\n    at Object.<anonymous> (/Users/You/wherever/your-file)\n    at here\n    at there\n    at file:line:col' },
  level: 'error',
  statusCode: 500 }
console.log(myErr.error.stack)