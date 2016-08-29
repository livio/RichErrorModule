# RichError Code Review
1. Where is the cool name?
2. Add a .gitignore file to avoid checking in dependancies.
3. User interface design first, how will the developer use this module.

# User Interface Ideas

Current is cumbersome, lots of duplicate parameters.

```JavaScript
let RichError = require('RichError'),
  i18next = require('i18next');

// You would configure i18next here.

let error = new RichError("Something went wrong", {}, i18next);
let error = new RichError("Something else went wrong", {}, i18next);
let error = new RichError("Oh crap, what now", {}, i18next);
```

Instead, let's configure RichError once and use the module to create libraries instead.

```JavaScript
let richError = new (require('RichError'))(),
  i18next = require('i18next');

// You would configure i18next here.

richError.set({ i18next: i18next });

let error = richError.create("Something went wrong", {});
let error = richError.create("Something else went wrong", {});
let error = richError.create("Oh crap, what now", {});
```

This will also allow us to add things like event handlers.
```JavaScript
richError.on('on-internal-error', function(err) {
  console.log("Internal Error %s", err);
});
```

And this doesn't mean we can't still use it like we were.
```
let richError = new (require('RichError'))(),
  i18next = require('i18next');

// You would configure i18next here.

richError.set({ i18next: i18next });

```
