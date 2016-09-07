let expect = require('chai').expect,
	RichError = require('../libs/RichError.js'),
	REMIE = require('../libs/index.js'),
	options = {};
	options.internalMessage = "I'm the internal message for developer eyes only",
	options.code = 'server.400.forbidden',
	remie = new REMIE('Something went wrong', options), // used to call REMIE methods, need create an instance of REMIE with RichError properties
	exRemie = remie.create('Something went wrong', options) // used to call Rich Error methods

let locale = 'server.400.forbidden'
let err = {}
err.code = 'server.400.notFound'
err.message = 'message in an error'
err.stack = 'stack would go here'
let objct = exRemie.toObject(exRemie)
//let copy = remie.copy(remie) // need to create error: code, message, stack, etc. properties
//console.log(copy)
	
//causes and catches an error
/*try {
	let exRemie = RichError.create("Something went wrong", {});
} catch (e) {
	console.log('error caught')
	console.log(e)
}*/
let systemErr = exRemie.buildFromSystemError(err, options)
let localeErr = exRemie.buildFromLocale(locale, options)
let stringErr = exRemie.buildFromString(undefined, options)
let defSystErr = exRemie.buildFromSystemError(undefined, undefined)
let defLocaleErr = exRemie.buildFromLocale(undefined, undefined)
let defStringErr = exRemie.buildFromString(undefined, undefined)
let guess = exRemie.guessStatusCodeOfLocale
let callSet = exRemie.set(exRemie)
let callGet = exRemie.get
let callBuild = exRemie.build

describe('Rich-Error', function(){
	it('build returns undefined when passed an undefined err', function(){
		expect(exRemie.build(undefined)).to.equal(undefined)
	}),

	it('build returns undefined and logs internal Message when err is undefined but options.internalMessage is not', function(){
		expect(exRemie.build(undefined, options)).to.equal(3)
	}),

	it("toObject returns object with correct Rich Error properties", function(){
		expect(objct.error).to.have.property('code')
		expect(objct.error).to.have.property('message')
		expect(objct.error).to.have.property('stack')
		expect(objct).to.have.property('internalOnly')
		expect(objct).to.have.property('internalMessage')
		expect(objct).to.have.property('level')
		expect(objct).to.have.property('messageData')
		expect(objct).to.have.property('options')
		expect(objct).to.have.property('referenceData')
		expect(objct).to.have.property('statusCode')
	}),
/* fix this
	it('copy calls toObject', function(){
		//expect(copy).to.be.instanceof(RichError)
		expect(copy.error).to.have.property('code')
		expect(copy.error).to.have.property('message')
		expect(copy.error).to.have.property('stack')
		expect(copy).to.have.property('internalOnly')
		expect(copy).to.have.property('internalMessage')
		expect(copy).to.have.property('level')
		expect(copy).to.have.property('messageData')
		expect(copy).to.have.property('options')
		expect(copy).to.have.property('referenceData')
		expect(copy).to.have.property('statusCode')
	})*/

	it('buildFromSystemError returns an object with default properties of a Rich Error', function(){
		expect(defSystErr).to.include({'internalOnly': false, 'internalMessage': undefined, 'level': 'error', 
			'messageData': undefined, 'referenceData': undefined, 'statusCode': 500})
		expect(defSystErr.error).to.be.an.instanceof(Error)
		expect(defSystErr.options).to.be.empty
	}),

	it('buildFromLocale returns an object with default properties of a Rich Error', function(){
		expect(defLocaleErr).to.include({'internalOnly': false, 'internalMessage': undefined, 
			'level': 'error', 'messageData': undefined, 'referenceData': undefined, 'statusCode': 500})
		expect(defLocaleErr.error).to.be.an.instanceof(Error)
		expect(defLocaleErr.options).to.be.empty
		expect(defLocaleErr.options.i18next).to.equal(undefined)
	}),

	it('buildFromString returns an object with default properties of a Rich Error', function(){
		expect(defStringErr).to.include({'internalOnly': false, 'internalMessage': undefined, 'level': 'error', 
			'messageData': undefined, 'referenceData': undefined, 'statusCode': 500})
		expect(defStringErr.error).to.be.an.instanceof(Error)
		expect(defStringErr.options).to.be.empty
	}),

	it('guessStatusCodeOfLocale properly guesses status code', function(){
		expect(guess('server.400.forbidden')).to.equal(403)
		expect(guess('server.400.notFound')).to.equal(404)
		expect(guess('server.400.unauthorized')).to.equal(401)
		expect(guess('server.400.test')).to.equal(400)
	}),

	it('set returns an object with Rich Error properties', function(){
		expect(callSet).to.include({'internalOnly': false, 'internalMessage': "I'm the internal message for developer eyes only",
			'level' : 'error', 'messageData': undefined, 'referenceData': undefined, 'statusCode': 500})
		expect(callSet.options).to.equal(options)
		expect(callSet.error).to.be.an.instanceof(Error)
	}),
/*	come back to this later
	it('get returns stuff', function(){
		expect(callGet('code')).to.throw(TypeError)
	})*/

	it('build calls correct methods and they run properly WHEN SENT CORRECT PARAMETERS', function(){
		expect(exRemie.build(undefined, options)).to.equal(3)
		expect(exRemie.build(undefined)).to.equal(undefined)
		expect(exRemie.build(exRemie)).to.include({'internalOnly': false, 'internalMessage': "I'm the internal message for developer eyes only",
			'level': 'error', 'messageData': undefined, 'referenceData': undefined, 'statusCode': 500})
		expect(exRemie.build(new Error())).to.include({'internalOnly': false, 'internalMessage': undefined, 'level': 'error', 
			'messageData': undefined, 'referenceData': undefined, 'statusCode': 500}) //calls buildFromSystemError
		expect(exRemie.build('server.400.forbidden')).to.include({'internalOnly': false, 'internalMessage': undefined, 
			'level': 'error', 'messageData': undefined, 'referenceData': undefined, 'statusCode': 500}) //calls buildFromLocale
		expect(exRemie.build('error')).to.include({'internalOnly': false, 'internalMessage': undefined, 'level': 'error', 
			'messageData': undefined, 'referenceData': undefined, 'statusCode': 500}) //calls buildFromString
		expect(exRemie.build({})).to.include({'internalOnly': undefined, 'internalMessage': undefined,
			'level': undefined, 'messageData': undefined, 'referenceData': undefined, 'statusCode': undefined})
	}),

	it('exRemie is not null or undefined', function(){
		expect(exRemie).to.exist;
	}),

	it('exRemie is an instance of Rich Error', function(){
		expect(exRemie).to.be.an.instanceof(RichError);
	});
});