// Require Remie from npm, or in this require the local instance.
let Remie = require('../libs/index.js');

// Create and configure an instance of Remie.
let remie = new Remie();

// Create a new error object.  Include an optional error level of "fatal"
let error = remie.create("Crap, something went wrong.", { level: Remie.ERROR_LEVEL_FATAL });

console.log("\nThis is an error we created from scratch using Remie:\n");
console.log(error);
console.log("\n----------------------------------------------------------------------\n");


let myVariable = undefined;
try {
  myVariable.myMethod();
} catch(e) {
  error = remie.create(e, {
    level: Remie.ERROR_LEVEL_FATAL,
    referenceData: {
      myVariable: myVariable
    }
  });

  console.log("This is an error created by Node.js, but we extended to include more information about what happened:\n");
  console.log(error.toObject());
  console.log("\n----------------------------------------------------------------------\n");
}


console.log("This is the same Node.js error sanitized for a client:\n");
console.log(error.sanitize());
