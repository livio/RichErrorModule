/* ************************************************** *
 * ******************** REMIE
 * ************************************************** */
let REMIE = require('../libs/index.js'),
  remie = new REMIE(),
  i18next = require('i18next'),
  EventEmitter = require('events').EventEmitter;
  //EventListener = require('events').EventListener;
  //console.log(EventListener)
  var inherits = require('util').inherits;
  err = {}
  err.code = 'wooh!'
  err.internalMessage = 'internal message1'
//addEventListener here
// needs to be able to listen for when 'on-internal-error' is true, then it can emit signal to log it
// or change richError.on to an eventListener and skip a step
//console.log(richError)
console.log(remie, '2')
inherits(REMIE, EventEmitter)
//console.log(richError)
//have to fix this eventually vvvv
//RichError.set({i18next: i18next});

let error = remie.create(err, {})
//let error = richError.create("Something went wrong", {});
let error2 = remie.create("Something else went wrong", {});
//let error3 = richError.create("Oh crap, what now", {});
console.log('error2 %s', JSON.stringify(error2))

remie.on('on-internal-error', function(err){
  console.log("Internal Error %s", err.internalMessage);
});
var event = 'on-internal-error'
remie.emit(event, err)
/*
class EventListener{
  constructor(){
    this.events = [];
  }
  on(event, fn) {
    this.events[event] = this.events[event] || []
    this.events[event].push(fn);
  }
  fire(event) {
    if (this.events[event]) {
      this.events[event].forEach(function(fn) {
        fn()
      })
    }
  }
}

var EvList = new EventListener();

EvList.on('on-internal-error', function() {
  console.log('Internal Error %s', err);
})

EvList.fire('on-internal-error')
*/
/*
// creates a new Error instance
var err = new Error()
var options = {
  internalOnly: false,
  internalMessage: 'This is the internalMessage',
  level: undefined,
  messageData: 'This is the messageData.',
  referenceData: 'This is the referenceData.',
  statusCode: undefined,
  'i18next': 'i18next' // cannot be i18next, gives error 'TypeError: Converting circular structure to JSON'
// buildFromLocale, in index.js, tries to translate the many properties and methods of the i18next object
};

var locale = 'server.400.notFound' 

localeErr = 'server.400.forbidden'

i18next.init({
  lng: "en-US",
  //nsSeparator: false,
  keySeparator: false,
  //load:['en-US', 'fr', 'es'],
  //fallbackLng: 'en-US',
  //backend: {
  //  loadPath: '/language/static/{{lng}}/{{ns}}.json'
  //},
  resources: {
    en: {
      translation: { // did a lot of searching, still unsure how this works
        // probably have to load JSON file here
        "server":{
          "400":{
            "forbidden": "this is how it's done"
          }
        },
        "server.400.forbidden" : "it might be working",
        // keySeparator must be set to false else 'server.400' is not recognized with '.'
        "server" : "this one works"
      }
    }
  }
}//, (err, t) => {
  //const hw = i18next.t('key'); // hw = 'hello world'
//}
)*/
module.exports = error2