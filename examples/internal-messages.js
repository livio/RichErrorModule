// Require the Remie library.
let Remie = require('../libs/index.js');

// Create and configure an instance of Remie.
let remie = new Remie({});

// Set an event listener on Remie for when an internal error message is created.
remie.on(Remie.ON_CREATE_INTERNAL_MESSAGE, function(richError, options) {
  // Log the internal message.
  if(richError.error && richError.error.message) {
    console.log("[Error]:  " + richError.error.message);
  }
  console.log("[Internal Message]: " + richError.internalMessage);
});

// Create an error instance with only an internal message.
let error = remie.create(undefined, {
  internalMessage: "I blame Nick, this should have definitely worked."
});

// Create another error instance with an internal message.
error = remie.create(new Error("Username and/or password are invalid."), {
  internalMessage: "Like actually, that password is just totally wrong."
});
