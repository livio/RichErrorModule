# REMIE (Rich Error Module Is Excellent)
[![Build Status](https://img.shields.io/travis/livio/remie.svg)](https://travis-ci.org/livio/remie)
[![codecov coverage](https://img.shields.io/codecov/c/github/livio/remie.svg)](https://codecov.io/gh/livio/remie)
[![Version](https://img.shields.io/npm/v/remie.svg)](http://npm.im/remie)
standardizing errors across micro-services

## Installation
```bash
$ npm install remie
```

## Usage
Create and configure an instance of Remie.  Then create a new Remie error from a system error.
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

```bash
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

and then used to create a Remie error instance again.

```javascript
let myRemieError = remie.create(error);
```

Or, you can sanitize the error and send it to a client.

```javascript
console.log(error.sanitize());
```
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

# Remie

## Methods
Remie instance methods.

### create
Builds a new RichError instance

### createInternal
Makes a copy of a RichError that has the same necessary properties

### copy
Use this when dealing with an internal error

### set

### get


## Events

### ON_CREATE_INTERNAL_MESSAGE

## Error Levels

## Configure

# Remie Error


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
