# REMIE (Rich Error Module Is Excellent)
standardizes errors across micro-services

```js
let remie = new (require('remie'))(),
	exRich = remie.create(err, options, locale), // creates a new instance of Rich Error
	copy = remie.copy(exRich), // makes a copy of the Rich Error
```

## Parameters
| Parameter | Type | Default | Description | Required |
|-----------|------|---------|-------------|----------|
| options | Object | ```{}``` | Overrides default behaviors | ```no``` |
| err | Object | ??? | Node.js error that ocurred | ```yes``` |
| locale | String | ```server.500.generic``` | Similar to err.code??? | ```no``` |
| err.code | String | default depends on other parameters? | Unique string "server.400.error" | ```no``` |
| err.stack | String | ??? | String stack trace |
| options.internalOnly | Boolean | ```false``` | Specifies an error for the developer only | ```no``` |
| options.internalMessage | String | ```undefined``` | String message for developer | ```no``` |
| options.level | String | ```error``` | String error level (e.g. warning, info, error, trace) | ```no``` |
| options.messageData | ??? | ```undefined``` | Extra data included in the message | ```no``` |
| options.referenceData | ??? | ```undefined``` | Data that may have caused the error | ```no``` |
| options.statusCode | Number | ```500``` | HTTP status code (e.g. 200, 400, 500) | ```no``` |

## Rich Error Methods
###call these methods by using exRich.method()
| Method | Parameters | Description |
|--------|------------|-------------|
| build | ```err, options``` | Determines what err is, then calls the correct method |
| buildFromSystemError | ```err, options``` | err is an Error instance. Sets richErrorObject properties to those of err and options, or to the default |
| buildFromLocale | ```locale, options``` | err is a locale. Sets richErrorObject properties to those of err and options, or to the default |
| buildFromString | ```errorString, options``` | err is a string. Sets richErrorObject properties to those of err and options, or to the default |
| get | ```key``` | Is sent a string and returns corresponding element in the error property(error code, stack, message) |
| guessStatusCodeOfLocale | ```locale``` | Guesses the status code based on the locale. |
| set | ```richErrorObject``` | Call this on a RichError and send it a different RichError or an object with similar properties to set the first's required properties to those of the second |
| toObject | none | Returns an object with properties of the RichError |
| toResponseObject | ```options``` | Uses options to return an object with the same properties |
## REMIE Methods
### call these methods by using remie.method()
| Method | Parameters | Description |
|--------|------------|-------------|
| create | ```err, options``` | Builds a new RichError instance |
| copy | ```rich``` | Makes a copy of a RichError that has the same necessary properties |

## Installation
```bash
$ npm install remie
```

## Examples
First, clone the REMIE repo and install any dependencies:
```bash
$ git clone https://github.com/livio/RichErrorModule.git
$ cd RichErrorModule
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

## License
[Ford](license)