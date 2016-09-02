# REMIE (Rich Error Module Is Excellent)

##Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| options | Object | ```{}``` | Overrides default behaviors |
| err | Object | ??? | Node.js error that ocurred |
| locale | ??? | ??? | Similar to err.code??? |
| err.code | String | ??? | Uniquie string "server.400.error" |
| err.stack | String | ??? | String stack trace |
| options.internalOnly | Boolean | ??? | Specifies an error for the developer only |
| options.internalMessage | String | ```undefined``` | String message for developer |
| options.level | String | ??? | String error level (e.g. warning, info, error, trace) |
| options.referenceData | ??? | ```undefined``` | Data that may have caused the error |
| options.statusCode | Number | ??? | HTTP status code (e.g. 200, 400, 500) |