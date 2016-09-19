# REMIE (Rich Error Module Is Excellent)
standardizing errors across micro-services

## Installation
```bash
$ npm install remie
```

## Usage
```js
var Remie = require('remie'),
	remie = new Remie(),
	myErr = new Error('Something went wrong'),
	options = {},
	exRich = remie.create(myErr, options); // creates a new instance of Rich Error
/* exRich should look like this but error.stack will vary:
RichError {
  error: 
   { Error: Something went wrong
       at Object.<anonymous> (/Users/You/wherever/your-file)
       at here
       at there
       at file:line:col code: undefined },
  internalOnly: false,
  internalMessage: undefined,
  level: 'error',
  messageData: undefined,
  options: {},
  referenceData: undefined,
  statusCode: 500 }
   */
```

## Parameters
| Parameter | Type | Default | Description | Required |
|-----------|------|---------|-------------|----------|
| err | Object | ```undefined``` | Node.js error that ocurred | ```yes``` |
| err.code | String | ```undefined``` | Unique string "server.400.error" | ```no``` |
| err.stack | String | ```undefined``` | String stack trace | ```no``` |
| locale | String | ```server.500.generic``` | String used to determine the user's language | ```no``` |
| options | Object | ```{}``` | Overrides default behaviors | ```no``` |
| options.internalOnly | Boolean | ```false``` | Specifies an error for the developer only | ```no``` |
| options.internalMessage | String | ```undefined``` | String message for developer | ```no``` |
| options.level | String | ```error``` | String error level (e.g. warning, info, error, trace) | ```no``` |
| options.messageData | String | ```undefined``` | Extra data included in the message | ```no``` |
| options.referenceData | String | ```undefined``` | Data that may have caused the error | ```no``` |
| options.statusCode | Number | ```500``` | HTTP status code (e.g. 200, 400, 500) | ```no``` |
| options.i18next | Module | ```undefined``` | [i18next](http://i18next.com/docs/) | ```no```|

## Remie Methods
### call these methods by using remie.method()
| Method | Parameters | Description |
|--------|------------|-------------|
| create | ```err, options, remie``` | Builds a new RichError instance |
| copy | ```rich``` | Makes a copy of a RichError that has the same necessary properties |

## Rich Error Methods
### call these methods by using exRich.method()
| Method | Parameters | Description |
|--------|------------|-------------|
| build | ```err, options, remie``` | Determines what err is, then calls the correct method |
| buildFromSystemError | ```err, options``` | err is an Error instance. Sets richErrorObject properties to those of err and options, or to the default |
| buildFromLocale | ```locale, options``` | err is a locale. Sets richErrorObject properties to those of err and options, or to the default |
| buildFromString | ```errorString, options``` | err is a string. Sets richErrorObject properties to those of err and options, or to the default |
| get | ```key``` | Is sent a string and returns corresponding element in the error property(error code, stack, message) |
| guessStatusCodeOfLocale | ```locale``` | Guesses the status code based on the locale. |
| set | ```richErrorObject``` | Call this on a RichError and send it a different RichError or an object with similar properties to set the first's required properties to those of the second |
| toObject | none | Returns an object with properties of the RichError |
| toResponseObject | ```options``` | If the RichError returned does not have internalOnly as true but it should then this can be used to return an object with the same properties as the RichError minus internal properties |
| seti18next | ```options, i18next``` | sets i18next to equal options.i18next then deletes options.i18next |
| removeEmptyProps | none | Removes empty or undefined properties in the Rich Error |

## buildInternal
buildInternal is a static method and must be called using the Remie class, not an instance of Remie.
It is used when dealing with an internal error.
| Do | Don't | Parameters |
|----|-------|------------|
| Remie.buildInternal() | remie.buildInternal() | ```err, options, remie``` |

## Examples
First, clone the Remie repo and install any dependencies:
```bash
$ git clone https://github.com/livio/remie.git
$ cd remie
$ npm install
```
Then run an example:
```bash
$ node examples/better-example.js
```

## Tests
To run the tests, start by installing dependencies, then run ```npm test```:
```bash
$ npm install
$ npm test
```