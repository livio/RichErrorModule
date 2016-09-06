# REMIE (Rich Error Module Is Excellent)
standardizes errors across micro-services

```js
var remie = require('remie')
```

## Installation (currently waiting for npm support to transfer ownership)
```$ npm install remie```

## Examples
First, clone the REMIE repo and install any dependencies:
```bash
$ git clone https://github.com/livio/RichErrorModule.git
$ cd RichErrorModule
$ npm install
```
Then run an example:
```bash
$ node examples/better-example
```

## Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| options | Object | ```{}``` | Overrides default behaviors |
| err | Object | ??? | Node.js error that ocurred |
| locale | String | ```server.500.generic``` | Similar to err.code??? |
| err.code | String | default depends on other parameters? | Uniquie string "server.400.error" |
| err.stack | String | ??? | String stack trace |
| options.internalOnly | Boolean | ```false``` | Specifies an error for the developer only |
| options.internalMessage | String | ```undefined``` | String message for developer |
| options.level | String | ```error``` | String error level (e.g. warning, info, error, trace) |
| options.referenceData | ??? | ```undefined``` | Data that may have caused the error |
| options.statusCode | Number | ```500``` | HTTP status code (e.g. 200, 400, 500) |

## License
[Ford](license)