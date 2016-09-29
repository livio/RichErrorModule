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
| option | ```String``` | Yes | ```undefined``` | The name of the option to get. |

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

```javascript
let Remie = require('remie');

console.log(Remie.ERROR_LEVEL_FATAL);
```

> Note:  You cannot access these on a remie instance, aka non-statically.

```javascript
let Remie = require('remie');
let remie = new Remie();

Remie.ERROR_LEVEL_FATAL  // GOOD!  Works!    WOW!
remie.ERROR_LEVEL_FATAL  // BAD!   NO WORK!  WOW!
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

```javascript
let remie = new Remie({
    defaultErrorMessage: "Oh crap!",
    defaultErrorStatusCode: 200       // Everything is ok, it's fine, really... no problems.
});
```

You can also change a configuration at anytime using the [set](#set) method.
```javascript
remie.set("defaultErrorStatusCode", 500);  // Nvm, it's bad, really bad.
```

# Remie Error

  * [Attributes](#remie-error-attributes)
  * [Methods](#remie-error-methods)

## Remie Error Attributes

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| error | ```Object``` | ```undefined``` | Contains information about the error that occurred. |
| error.code | String | ```undefined``` | A unique string that can programmatically identify the type of error that occurred. |
| error.message | String | ```undefined``` | A user friendly description of the error that occurred. |
| error.stack | String | ```undefined``` | A stack trace for the error that occurred. |
| internalOnly | Boolean | ```false``` | When true, denotes the error is for the developer's eyes only. |
| internalMessage | String | ```undefined``` | A special message that should not be shown to a user or client. |
| level | String | ```error``` | Indicates the level of error that occurred.  (e.g. warning, info, error, trace) |
| messageData | String | ```undefined``` | Extra data that was included in the error message.
| referenceData | Object | ```undefined``` | Data that may have caused or is related to the error |
| statusCode | Number | ```500``` | HTTP status code. (e.g. 200, 400, 500) |

### i18next Translations
When using i18next the locale will be placed in the ```error.code``` and ```options.messageData``` will contain any parameter keys/values included in the locale.

## Remie Error Methods

  * [build](#build)
  * [get](#error-get)
  * [set](#error-set)
  * [sanitize](#sanitize)
  * [toObject](#toObject)

### Build
Builds the current Remie error instance.  You can build it from a ```string```, ```i18next locale```, ```Node.js error```, or an existing ```Remie error``` object.  The Remie [Create](#create) method calls this method internally, see the create method documentation for more details.
 
 ```javascript
 error.build(error, options, remie)
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
 | remie | ```Object``` | Yes | ```undefined``` | An instance of the Remie class.  (e.g. ```new Remie({})```) |
 
 See the [Create](#create) method documentation for more details.
 
  * [Create from String](#create-from-string)
  * [Create from Locale](#create-from-locale)
  * [Create from Node.js Error](#create-from-nodejs-error)
  * [Create from Remie Error](#create-from-remie-error)
 
### Error Get
Get an attribute in the Remie error instance by providing the ```attribute``` name as a parameter.  See available [Remie error attributes](#remie-error-attributes).

```javascript
error.get(attribute);
```

| Parameters | Type | Required | Default | Description |
| -----------|------|----------|---------|-------------|
| attribute | ```String``` | Yes | ```undefined``` | The name of the attribute to get. |


### Error Set
Set an attribute in the Remie error instance.  Provide the ```attribute``` name and new ```value``` as parameters.  See available [Remie error attributes](#remie-error-attributes).

```javascript
error.set(attribute, value);
```

| Parameters | Type | Required | Default | Description |
| -----------|------|----------|---------|-------------|
| attribute | ```String``` | Yes | ```undefined``` | The name of the attribute to set. |
| value | ```Varies``` | Yes | ```undefined``` | The attribute's new value. |

```javascript
error.set("internalOnly", true);
```

### Sanitize
Convert the Remie error instance into a JSON object that can then be passed to a client or user.  This removes attributes that are considered private or not needed by a client or user.  Include an attributes name as the key with a value of ```false``` in the options parameter to exclude it from the returned sanitized object.

```javascript
error.santitize(options);
```

| Parameters              | Type          | Required | Default   | Description |
| ------------------------|---------------|----------|-----------|-------------|
| options                 | ```Object```  | No | ```{}```        | Includes key/value pairs of options for the sanitize method. |
| options.error.code      | ```Boolean``` | No | ```undefined``` | When true, includes ```error.code``` in the returned sanitized object. |
| options.error.message   | ```Boolean``` | No | ```undefined``` | When true, includes ```error.message``` in the returned sanitized object. |
| options.error.stack     | ```Boolean``` | No | ```undefined``` | When true, includes ```error.stack``` in the returned sanitized object. |
| options.internalOnly    | ```Boolean``` | No | ```undefined``` | When true, returns undefined instead of a sanitized object. |
| options.level           | ```Boolean``` | No | ```undefined``` | When true, includes ```level``` in the returned sanitized object. |
| options.messageData     | ```Boolean``` | No | ```undefined``` | When true, includes ```messageData``` in the returned sanitized object. |
| options.referenceData   | ```Boolean``` | No | ```undefined``` | When true, includes ```referenceData``` in the returned sanitized object. |
| options.statusCode      | ```Boolean``` | No | ```undefined``` | When true, includes ```statusCode``` in the returned sanitized object. |


### toObject
Convert the Remie error instance into a JSON object.  This object can be passed from system to system as JSON, then be used to recreate the Remie error instance again.
 
```javascript
error.toObject();
```

# Examples
A series of examples exist to help you understand how to use remie.  They are all located in the [examples](https://github.com/livio/remie/tree/develop/examples) folder.  You can follow these steps to use and play with the examples.
  
  1. Download or clone the repo.

    ```bash
    git clone https://github.com/livio/remie.git
    ```
    
  2. Navigate to the examples folder.
  
    ```bash
    cd remie/examples
    ```
    
  3. Install dependencies
   
   ```bash
   npm install
   ```
  
  4. Run any example using ```node nameOfExampleFile.js```
  
  ```bash
  node basic.js
  ```

# Tests
Remie includes tests using the mocha framework.  Run and ensure these tests pass before submitting code to a stable branch or finished pull-request.
  
  1. Download or clone the repo.
  
  ```bash
  git clone https://github.com/livio/remie.git
  ```
  
  2. Install dependencies

  ```bash
  npm install
  ```
  
  3. Run the tests
 
  ```bash
  npm test
  ```