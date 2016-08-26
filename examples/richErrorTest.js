/*
/Rich-Error
	/examples
		richErrorTest.js
	/libs
		index.js
	license
	/node_modules
		i18next
	package.json
	readme.md
	/test
		test.js
		*/
var RichError = require('../libs/index.js')
var i18next = require('i18next')
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
      	
        "server.400.forbidden" : "it might be working",
        // keySeparator must be set to false else 'server.400' is not recognized with '.'
        "server" : "this one works"
      }
    }
  }
}//, (err, t) => {
  //const hw = i18next.t('key'); // hw = 'hello world'
//}
)

//creates a new instance of RichError
var exampleRichError = new RichError(err, options, i18next, locale)

console.log("\n\n/* ******************** Rich Error Example ******************** */\n");

console.log(exampleRichError)

console.log("\n\n/* ******************** Rich Error Example ******************** */\n");

// creates a new RichError instance with a RichError passed in
console.log(new RichError(exampleRichError, options, i18next, locale))

console.log("\n\n/* ******************** Rich Error Example ******************** */\n");

// creates a new RichError instance with locale error passed in
// tries to find status code for the error
console.log(new RichError(localeErr, options, i18next, locale))

console.log("\n\n/* ******************** Rich Error Example ******************** */\n");

console.log(exampleRichError.toResponseObject(localeErr, options, i18next, locale))

// exists must be sent a string
console.log(i18next.exists('server'))
console.log(i18next.t(localeErr)) // returns "it might be working"
console.log(i18next.exists('server.400.forbidden'))

console.log("\n\n/* ******************** Rich Error Example ******************** */\n");

//					 ||||
//error here vvvv if options.i18next is not a string
console.log(RichError.buildInternal(err, options, localeErr))