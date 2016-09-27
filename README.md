# REMIE (Rich Error Module Is Excellent)
[![Build Status](https://img.shields.io/travis/livio/remie.svg)](https://travis-ci.org/livio/remie)
[![codecov coverage](https://img.shields.io/codecov/c/github/livio/remie.svg)](https://codecov.io/gh/livio/remie)
[![Version](https://img.shields.io/npm/v/remie.svg)](http://npm.im/remie)

Encapsulates additional information about an error that occurred in a standardized error object called a ```Remie error```.

## Installation
Install and save the Remie npm module to the package.json.

```bash
$ npm install --save remie
```

## Usage
Create and configure an instance of Remie.  Then create a new Remie error from a Node.js system error.
```javascript
// Require the Remie module.
let Remie = require('remie');

// Create and configure a new instance of Remie.
let remie = new Remie();

let myVariable,
  error;

// Let's make an error occur.
try {
  myVariable.myMethod();
} catch(e) {
  // Create a Remie error to extend the information provided in the error object.
  error = remie.create(e, {
    level: Remie.ERROR_LEVEL_FATAL,  // Give it an error level e.g. warning or fatal
    referenceData: {                 // Hint at what data could have caused the error.
      myVariable: myVariable
    }
  });
}
```

The error can be converted to an object to be passed between internal services as JSON.

```javascript
console.log(error.toObject());
```

The above command produces the following console logs:

```javascript
{
  error: {
	  code: undefined,
		message: 'Cannot read property \'myMethod\' of undefined',
		stack: 'TypeError: Cannot read property \'myMethod\' of undefined\n    at Object.<anonymous> (/remie/examples/basic.js:17:13)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Function.Module.runMain (module.js:575:10)\n    at startup (node.js:160:18)\n    at node.js:449:3'
	},
  internalOnly: false,
  internalMessage: undefined,
  level: 'fatal',
  messageData: undefined,
  referenceData: {
	  myVariable: undefined
	},
  statusCode: 500
}
```

The same object can then used to create a Remie error instance again.

```javascript
let myRemieError = remie.create(error);
```

Or, you can sanitize the error and send it to a client.

```javascript
console.log(error.sanitize());
```

The above command produces the following console logs:

```bash
{
  error: {
	  message: 'Cannot read property \'myMethod\' of undefined'
	},
  internalOnly: false,
	level: 'fatal',
	referenceData: {
	  myVariable: undefined
	},
	statusCode: 500
}
```

# Table of Contents

  * [Examples](#examples)
  * [Remie](#remie)
    * [Configure Remie](#configure-remie)
    * [Error Levels](#error-levels)
    * [Events](#events)
    * [Remie Methods](#remie-methods)
  * [Remie Error](#remie-error)
    * [Error Methods](#remie-error-methods)
  * [Tests](#tests)
  

# Remie

## Remie Methods
The Remie instance is used to create Remie errors with a standard set of configurations.  The following Remie methods are available.

  * [Copy](#copy)
  * [Create](#create)
    * [Create from String](#create-from-string)
    * [Create from Locale](#create-from-locale)
    * [Create from Node.js Error](#create-from-nodejs-error)
    * [Create from Remie Error](#create-from-remie-error)
  * [Create Internal](#create-internal)
  * [Get](#get)
  * [Set](#set)

### Create
Builds a new Remie error instance.  You can build it from a ```string```, ```i18next locale```, ```Node.js error```, or an existing ```Remie error``` object.

```javascript
remie.create(error, options);
```

| Parameters | Type | Required | Default | Description |
| -----------|------|----------|---------|-------------|
| error                   | ```String``` or ```Object``` | No | ```remie.defaultErrorMessage``` | The error that occurred. |
| options                 | ```Object```  | No | ```{}``` | Configurations for the error object being built. |
| options.error.code      | ```String```  | No | ```undefined``` | A unique value to reference the type of error that occurred. |
| options.internalMessage | ```String```  | No | ```undefined``` | Additional message to only display internally. |
| options.internalOnly    | ```Boolean``` | No | ```false``` | When true, error should only be displayed internally |
| options.level           | ```String```  | No | ```error``` | Error level (e.g. ```error```, ```fatal```, ```warn```) |
| options.messageData     | ```Object```  | No | ```undefined``` | Parameter data included in the error message. |
| options.referenceData   | ```Object```  | No | ```undefined``` | Data that may have caused the error. |
| options.statusCode      | ```Number```  | No | ```500``` | HTTP status code (e.g. 200, 400, 500) |

#### Create from String
Create a new Remie error object with a string as the ```error``` parameter.  Pass along any additional configurations in the ```options``` object parameter.

```javascript
let error = remie.create("Something went horribly wrong", {  level: Remie.ERROR_LEVEL_FATAL  });
```

#### Create from Locale
Create a new Remie error object with an i18next string locale as the ```error``` parameter.  Pass along any additional configurations in the ```options``` object parameter.

> Note:  i18next must be configured and included in the ```remie``` instance to handle the translation lookup.

```javascript
// Require and configure i18next.
let remie = new Remie({ i18next: i18next });

let error = remie.create("server.400.notFound", {  
  error: {
    code: "server.400.notFound"
  },
  "messageData": { page: "http://my.domain.com/this/page/doesnt/exist"}
});
```

#### Create from Node.js Error
Create a new Remie error object from an existing Node.js error as a parameter.  Pass along any additional configurations in the ```options``` object parameter.

```javascript
let myVariable = undefined;

// Let's make an error occur.
try {
  myVariable.myMethod();
} catch(e) {
  // Create a Remie error to extend the information provided in the error object.
  error = remie.create(e, {
    referenceData: {                 // Hint at what data could have caused the error.
      myVariable: myVariable
    }
  });
}
```

#### Create from Remie Error
Create a new Remie error object from an existing Remie error object as a parameter.  Pass along any additional configurations in the ```options``` object parameter.

```javascript
// Require and configure i18next.
let error1 = remie.create("something is wrong.");

let error2 = remie.create(error1, {
  internalMessage: "This is a copy of error1"
});
```

### Create Internal
Same as create only the error will be marked as internal only by setting the ```internalOnly``` attribute to ```true```.

```javascript
remie.createInternal(error, options);
```
| Parameters | Type | Required | Default | Description |
| -----------|------|----------|---------|-------------|
| error                   | ```String``` or ```Object``` | No | ```remie.defaultErrorMessage``` | The error that occurred. |
| options                 | ```Object```  | No | ```{}``` | Configurations for the error object being built. |
| options.error.code      | ```String```  | No | ```undefined``` | A unique value to reference the type of error that occurred. |
| options.internalMessage | ```String```  | No | ```undefined``` | Additional message to only display internally. |
| options.internalOnly    | ```Boolean``` | No | ```false``` | When true, error should only be displayed internally |
| options.level           | ```String```  | No | ```error``` | Error level (e.g. ```error```, ```fatal```, ```warn```) |
| options.messageData     | ```Object```  | No | ```undefined``` | Parameter data included in the error message. |
| options.referenceData   | ```Object```  | No | ```undefined``` | Data that may have caused the error. |
| options.statusCode      | ```Number```  | No | ```500``` | HTTP status code (e.g. 200, 400, 500) |

```javascript
let error = remie.createInternal("Something went horribly wrong", {  level: Remie.ERROR_LEVEL_FATAL  });
```

### copy
Make a copy of an existing Remie error instance.

```javascript
remie.copy(error, options);
```

| Parameters | Type | Required | Default | Description |
| -----------|------|----------|---------|-------------|
| error                   | ```Object``` | No | ```{}``` | The Remie error instance to copy. |
| options                 | ```Object```  | No | ```{}``` | Configurations for the error object being built. |
| options.error.code      | ```String```  | No | ```undefined``` | A unique value to reference the type of error that occurred. |
| options.internalMessage | ```String```  | No | ```undefined``` | Additional message to only display internally. |
| options.internalOnly    | ```Boolean``` | No | ```false``` | When true, error should only be displayed internally |
| options.level           | ```String```  | No | ```error``` | Error level (e.g. ```error```, ```fatal```, ```warn```) |
| options.messageData     | ```Object```  | No | ```undefined``` | Parameter data included in the error message. |
| options.referenceData   | ```Object```  | No | ```undefined``` | Data that may have caused the error. |
| options.statusCode      | ```Number```  | No | ```500``` | HTTP status code (e.g. 200, 400, 500) |

```javascript
let error1 = remie.create("this is an error");
let error2 = remie.copy(error1);
```

### set
Set an option in the Remie instance.  Provide the ```option``` name and new ```value``` as parameters.  See available [Remie configurations](#configure-remie).

```javascript
remie.set(option, value);
```

| Parameters | Type | Required | Default | Description |
| -----------|------|----------|---------|-------------|
| option | ```String``` | Yes | ```undefined``` | The name of the option to set. |
| value | ```Varies``` | Yes | ```undefined``` | The option's new value. |

```javascript
remie.set("defaultErrorMessage", "An internal error has occurred.");
```

### get
Get an option in the Remie instance by providing the ```option``` name as a parameter.  See available [Remie configurations](#configure-remie).

```javascript
remie.get(option);
```

| Parameters | Type | Required | Default | Description |
| -----------|------|----------|---------|-------------|
| option | ```String``` | Yes | ```undefined``` | The name of the option to set. |

```javascript
let defaultErrorMessage = remie.get("defaultErrorMessage");
```

## Events
Events are emitted by Remie using the standard Node.js EventEmitter.  You can listen for these events.

```javascript
let Remie = require('remie');

let remie = new Remie();

remie.on("MyEventHere", function() { /* Do Something Here */ });
```

### ON_CREATE_INTERNAL_MESSAGE
Called when an internal message is added to a Remie error instance.

```javascript
let Remie = require('remie');

let remie = new Remie();

remie.on(Remie.ON_CREATE_INTERNAL_MESSAGE, function(error, options) {
  console.log("[Internal Message]: " + error.internalMessage);
});
```

## Error Levels
Remie includes several standard error levels that can be used to categorizing or logging errors.  Remie uses the same error levels as [node-bunyan](https://github.com/trentm/node-bunyan#levels). 

| Level | String | Description |
| ------|--------|-------------|
| ERROR_LEVEL_FATAL | ```"fatal"``` | The service/app is going to stop or become unusable now. An operator should definitely look into this soon. |
| ERROR_LEVEL_ERROR | ```"error"``` | Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish). |
| ERROR_LEVEL_WARN | ```"warn"``` | A note on something that should probably be looked at by an operator eventually. |
| ERROR_LEVEL_INFO | ```"info"``` | Detail on regular operation. |
| ERROR_LEVEL_DEBUG | ```"debug"``` | Anything else, i.e. too verbose to be included in "info" level. |
| ERROR_LEVEL_TRACE | ```"trace"``` | Logging from external libraries used by your app or very detailed application logging. |

You can access the error levels statically using the Remie npm module instance.

```
let Remie = require('remie');

console.log(Remie.ERROR_LEVEL_FATAL);
```

> Note:  You cannot access these on a remie instance, aka not statically.

```
let Remie = require('remie');
let remie = new Remie();

Remie.ERROR_LEVEL_FATAL  // GOOD!  Works! WOW!
remie.ERROR_LEVEL_FATAL  // BAD!  NO WORK! WOW!
```

## Configure Remie
You can configure the Remie instance at anytime using the following attributes:

| Option | Type | Default | Description |
| -------|------|---------|-------------|
| defaultErrorMessage | ```String``` |  ```"Internal server error!"``` | Default Remie error message used when an error message is not provided. |
| defaultErrorLocale | ```String``` |  ```"server.500.generic"``` | Default Remie error locale for i18next used when an error locale is required, but not provided. |
| defaultErrorStatusCode | ```Number``` |  ```500``` | Default Remie error status code used when an error status code is not provided. |
| i18next | ```Object``` |  ```undefined``` | Instance of i18next used for translation of locales. |

To configure a Remie instance while being created pass values into the constructor as an object.

```
let remie = new Remie({
    defaultErrorMessage: "Oh crap!",
    defaultErrorStatusCode: 200       // Everything is ok, it's fine, really... no problems.
});
```

You can also change a configuration at anytime using the [set](#set) method.
```
remie.set("defaultErrorStatusCode", 500);  // Nvm, it's bad, really bad.
```

# Remie Error

## Remie Error Methods

## Attributes

| Parameter | Type | Default | Description | Required |
|-----------|------|---------|-------------|----------|
| err | Object, String | ```undefined``` | Node.js error that ocurred | ```yes``` |
| err.code | String | ```undefined``` | Unique string "server.400.error" | ```no``` |
| err.message | String | ```undefined``` | Readable description of the error | ```no``` |
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

## Methods

### toObject

### sanitize

### set

# Examples
First, clone the Remie repo and install any dependencies:
```bash
git clone https://github.com/livio/remie.git
cd remie/examples
npm install
```
You can now look over the examples and run each file using the ```node``` command.  For example:
```bash
node basic.js
```

# Tests
To run the tests, start by installing dependencies, then run ```npm test```:
```bash
npm install
npm test
```
