// Require modules and libs.
var assert = require('chai').assert,
  async = require('async'),
  expect = require('chai').expect,
  Remie = (require("../libs/index.js")),
	RichError = require("../libs/RichError.js"),
	path = require("path"),
	_ = require("lodash");

var remie;

let validateError = function(e, error, options, cb) {
  let tasks = [];

  tasks.push(function(cb) {
    validateErrorInstance(e, cb);
  });

  tasks.push(function(cb) {
    validateToObject(e, cb);
  });

  tasks.push(function(cb) {
    validateErrorDefaults(e, options, cb);
  });

  tasks.push(function (cb) {
    //compareErrors(e, error, options, cb);
    cb();
  });

  async.series(tasks, cb);
};

let validateErrorInstance = function(e, cb) {
  // The instance should be a defined, a Rich Error instance, and an object type.
  expect(e).to.exist;
  expect(e).to.be.an.instanceOf(RichError);
  expect(e).to.be.a('object');

  // Error object should be defined... and an error object.
  expect(e.error).to.exist;
  expect(e.error).to.be.a('error');

  // Error message should be defined and a string.
  expect(e.error.message).to.exist;
  expect(e.error.message).to.be.a('string');

  // Internal Only should be a defined boolean.
  expect(e.internalOnly).to.exist;
  expect(e.internalOnly).to.be.a('boolean');

  // Level should be defined and a string.
  expect(e.level).to.exist;
  expect(e.level).to.be.a('string');

  // Status code should be defined and a number from 100 - 599 (inclusive)
  expect(e.statusCode).to.exist;
  expect(e.statusCode).to.be.a('number');
  expect(e.statusCode).to.be.at.least(100);
  expect(e.statusCode).to.be.below(600);

  // Error stack should be defined and a string.
  expect(e.error.stack).to.exist;
  expect(e.error.stack).to.be.a('string');

  // Begin Optional fields

  // If defined, message data should be an object.
  if(e.messageData) {
    expect(e.messageData).to.be.a('object');
  }

  // If defined, reference data should be an object.
  if(e.referenceData) {
    expect(e.referenceData).to.be.a('object');
  }

  // If defined, internal message should be a string.
  if(e.internalMessage) {
    expect(e.internalMessage).to.be.a('string');
  }

  // If defined, error code should be a string.
  if(e.error.code) {
    expect(e.error.code).to.be.a('string');
  }

  if(cb) {
    cb();
  }
};

let validateErrorDefaults = function(e, options = {}, cb) {
  //let obj = e.toObject();

  if(options.error !== undefined) {
    if (options.error.code === undefined) {
      expect(e.error.code).to.be.undefined;
    }
  }

  if(options.internalOnly === undefined) {
    expect(e.internalOnly).to.equal(false);
  }

  if(options.level === undefined) {
    expect(e.level).to.equal('error');
  }

  if(options.statusCode === undefined) {
    expect(e.statusCode).to.equal(500);
  }

  if(options.messageData === undefined) {
    expect(e.messageData).to.be.undefined;
  }

  if(options.referenceData === undefined) {
    expect(e.referenceData).to.be.undefined;
  }

  if(options.internalMessage === undefined) {
    expect(e.internalMessage).to.be.undefined;
  }

  cb();
};

let validateToObject = function(e, cb) {
  // TODO: Check for valid and invalid fields.
  cb();
};


/*
let compareErrors = function(actualErrorInstance, expectedError, options, cb) {
  actual = actualErrorInstance.toObject();

  for(var key in expected) {
    switch(key) {
      case 'error':
        for(var subKey in expected[key]) {
          if(expected[key][subKey] !== undefined) {
            assert.equal(actual[key][subKey], expected[key][subKey]);
          }
        }
        break;
      default:
        if(expected[key] !== undefined) {
          assert.equal(actual[key], expected[key]);
        }
        break;
    }
  }
  if(cb) {
    cb();
  }
};
*/

describe('RichError', function() {

  beforeEach(function (done) {
    remie = new Remie();
    done();
  });

  afterEach(function (done) {
    remie = undefined;
    done();
  });
  
  describe('build', function() {
    
    it('from a string', function (done) {
      let errorString = "My error string",
        options = {};

      validateError(
        new RichError(errorString, options, remie),
        errorString,
        options,
        done);
    });

    it('', function (done) {
      done();
    });
  });

});