var expect = require('chai').expect,
	assert = require('chai').assert,
	RichError = require('../libs/RichError.js'),
	Remie = require('../libs/index.js'),
	options = {};
	options.internalMessage = "I'm the internal message for developer eyes only",
	options.code = 'server.400.forbidden',
	options.statusCode = 400,
	remie = new Remie('Something went wrong', options), // used to call REMIE methods, need create an instance of REMIE with RichError properties
	exRich = remie.create('Something went wrong', options), // used to call Rich Error methods
//	locale = 'server.400.forbidden',
	i18next = require('i18next')
	myErr = {},
	myError = new Error('Something went wrong'),
	other = remie.create(myErr, options);
myErr.code = 'server.400.notFound'
myErr.message = 'message in an error'
myErr.stack = 'stack: tells you where the error came from'
i18next.init({
	lng: "en-US",
    nsSeparator: false,
    resources: {
    	en: {
            translation: {
                "server" : {
            	  	"400" : {
            		"notFound": "The page could not be found",
                	"forbidden": "The page is forbidden",
                	"unauthorized": "You are not authorized to access this page"
              		}
            	}
 			}
        }
    }
})
options.i18next = i18next
describe('Remie', function(){
	describe('constructor', function() {
		it('constructor returns a Remie', function(){
			expect(new Remie()).to.be.an.instanceof(Remie)
		})
	})
	describe('create', function(){
		it('create returns empty Rich Error when sent undefined', function(){
			expect(remie.create()).to.be.an.instanceof(RichError)
			.and.to.be.empty
		})
	})
	describe('buildInternal', function(){
		it('buildInternal returns RichError with internalOnly property of true', function(){
			let options = {}
			options.internalMessage = "I'm the internal message for developer eyes only"
			options.code = 'server.400.forbidden'
			options.statusCode = 400
			options.i18next = i18next
			let myErr = new Error('Something went wrong')
			expect(remie.buildInternal(myErr, options)).to.include({
				'internalOnly': true,
				'internalMessage': 'I\'m the internal message for developer eyes only',
				'level': 'error',
				'messageData': undefined,
				'referenceData': undefined,
				'statusCode': 400})
				.and.to.have.property('options')
		})
	})
	describe('copy', function(){
		it('copy calls toObject', function(){
			let copy = remie.copy(exRich) // need to create error: code, message, stack, etc. properties
			expect(copy).to.be.instanceof(RichError)
			expect(copy).to.have.property('error').and.to.have.property('code')
			.and.to.equal('server.400.forbidden')
			expect(copy.error).to.have.property('message')
			.and.to.equal('Something went wrong')
			expect(copy.error).to.have.property('stack')
			expect(copy).to.include({
				'internalOnly': false,
				'internalMessage': "I'm the internal message for developer eyes only",
				'level': 'error',
				'messageData': undefined,
				'referenceData': undefined,
				'statusCode': 400})
			expect(copy.options).to.equal(options)
		})
	})
})
describe('RichError', function(){
	describe('constructor', function(){
	})
	describe('build', function(){
		it('build returns undefined when passed an undefined err', function(){
			expect(remie.create().build(undefined)).to.equal(undefined)
		})
		it('build returns undefined and logs internal Message when err is undefined but options.internalMessage is not', function(){
			expect(remie.create().build(undefined, options, remie)).to.equal(undefined)
		})
		it('build calls correct methods and they run properly when sent correct parameters', function(){
			expect(remie.create().build(undefined)).to.equal(undefined)
			expect(exRich).to.be.an.instanceof(RichError)
			expect(remie.create().build(exRich)).to.include({
				'internalOnly': false, 
				'internalMessage': "I'm the internal message for developer eyes only",
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 400})
				.and.to.have.property('options')
			expect(remie.create().build(new Error())).to.include({
				'internalOnly': false, 
				'internalMessage': undefined, 
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 500})
				.and.to.have.property('options').to.be.empty //calls buildFromSystemError
			expect(remie.create().build('server.400.forbidden')).to.include({
				'internalOnly': false, 
				'internalMessage': undefined, 
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 500})
				.and.to.have.property('options').to.be.empty //calls buildFromLocale
			expect(remie.create().build('error')).to.include({
				'internalOnly': false, 
				'internalMessage': undefined, 
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 500}) //calls buildFromString
				.and.to.have.property('options').to.be.empty
			expect(remie.create().build({})).to.include({
				'internalOnly': undefined, 
				'internalMessage': undefined,
				'level': undefined, 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': undefined})
				.and.to.have.property('options').to.be.empty
			expect(remie.create().build(exRich, options)).to.include({
				'internalOnly': false, 
				'internalMessage': "I'm the internal message for developer eyes only",
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 400})
				.and.to.have.property('options').to.equal(options)
			expect(remie.create().build(new Error(), options)).to.include({
				'internalOnly': false, 
				'internalMessage': 'I\'m the internal message for developer eyes only', 
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 400})
				.and.to.have.property('options').to.equal(options) //calls buildFromSystemError
			expect(remie.create().build('server.400.forbidden', options)).to.include({
				'internalOnly': false, 
				'internalMessage': 'I\'m the internal message for developer eyes only', 
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 400})
				.and.to.have.property('options').to.equal(options) //calls buildFromLocale
			expect(remie.create().build('error', options)).to.include({
				'internalOnly': false, 
				'internalMessage': 'I\'m the internal message for developer eyes only', 
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 400}) //calls buildFromString
				.and.to.have.property('options').to.equal(options)
			expect(remie.create().build({}, options)).to.include({
				'internalOnly': undefined, 
				'internalMessage': undefined,
				'level': undefined, 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': undefined})
				.and.to.have.property('options').to.equal(undefined)
		})
		it('build works when sent an instanceof String not just with a variable that is a typeof string', function(){
			expect(remie.create().build(new String('error'), options)).to.include({
				'internalOnly': false, 
				'internalMessage': 'I\'m the internal message for developer eyes only', 
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 400}) //calls buildFromString
				.and.to.have.property('options').to.equal(options)
		})
	})
	describe('buildFromSystemError', function(){
		it('buildFromSystemError returns an object with default properties of a Rich Error', function(){
			let defSystErr = remie.create().buildFromSystemError(undefined, undefined)
			expect(defSystErr).to.be.an('object')
			expect(defSystErr).to.include({
				'internalOnly': false, 
				'internalMessage': undefined, 
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 500})
			expect(defSystErr).to.have.property('error').and.to.be.an.instanceof(Error)
			expect(defSystErr).to.have.property('options').and.to.be.empty
		})
		it('buildFromSystemError returns an object with expected properties of a Rich Error', function(){
			let systemErr = remie.create().buildFromSystemError(myError, options)
			expect(systemErr).to.be.an('object')
			expect(systemErr).to.include({
				'internalOnly': false, 
				'internalMessage': "I'm the internal message for developer eyes only",
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 400})
			expect(systemErr).to.have.property('error')
				.and.to.have.property('code')
				.to.equal(undefined);
			expect(systemErr.error).to.have.property('message')
				.and.to.equal('Something went wrong');
			expect(systemErr.error).to.have.property('stack')
			expect(systemErr).to.have.property('options').and.to.equal(options)
		})
	})
	describe('buildFromLocale', function(){
		it('buildFromLocale returns an object with default properties of a Rich Error', function(){
			let defLocaleErr = remie.create().buildFromLocale(undefined, undefined)
			expect(defLocaleErr).to.be.an('object')
			expect(defLocaleErr).to.include({
				'internalOnly': false, 
				'internalMessage': undefined, 
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 500})
			expect(defLocaleErr).to.have.property('error').and.to.be.an.instanceof(Error)
			expect(defLocaleErr).to.have.property('options').and.to.be.empty
		})
		it('buildFromLocale returns an object with expected properties of a Rich Error', function(){
			let options = {};
			options.internalMessage = "I'm the internal message for developer eyes only",
			options.code = 'server.400.notFound',
			options.i18next = require('i18next'),
			localeErr = remie.create().buildFromLocale('server.400.forbidden', options)
			expect(localeErr).to.be.an('object')
			expect(localeErr).to.include({
				'internalOnly': false,
				'internalMessage': "I'm the internal message for developer eyes only",
				'level': 'error',
				'messageData': undefined,
				'referenceData': undefined,
				'statusCode': 403
			})
			expect(localeErr).to.have.property('error').to.have.property('code')
			.and.to.equal('server.400.forbidden')		
			expect(localeErr.error).to.have.property('message')
			.and.to.equal('The page is forbidden') //should be 'This page is forbidden'
			expect(localeErr.error).to.have.property('stack')
			expect(localeErr).to.have.property('options').and.to.equal(options)
			})
	})
	describe('buildFromString', function(){
		it('buildFromString returns an object with default properties of a Rich Error', function(){
			let defStringErr = remie.create().buildFromString(undefined, undefined)
			expect(defStringErr).to.be.an('object')
			expect(defStringErr).to.include({
				'internalOnly': false, 
				'internalMessage': undefined, 
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 500})
			expect(defStringErr).to.have.property('error').and.to.be.an.instanceof(Error)
			expect(defStringErr.options).to.be.empty
		})
		it('buildFromString returns an object with expected properties of a Rich Error', function(){
			let stringErr = remie.create().buildFromString('Something went wrong', options)
			expect(stringErr).to.be.an('object')
			expect(stringErr).to.include({
				'internalOnly': false,
				'internalMessage': "I'm the internal message for developer eyes only",
				'level': 'error',
				'messageData': undefined,
				'referenceData': undefined,
				'statusCode': 400})
			expect(stringErr).to.have.property('error').and.to.have.property('code') // can't use include on an error
			.and.to.equal('server.400.forbidden')
			expect(stringErr.error).to.have.property('message')
			.and.to.equal('Something went wrong')
			expect(stringErr.error).to.have.property('stack')
		})
	})
	describe('get', function(){
		it('get returns error code, stack, or message', function(){
			expect(exRich.get('code')).to.be.a('string')
			.and.to.equal('server.400.forbidden')
			expect(exRich.get('stack')).to.be.a('string')
			expect(exRich.get('message')).to.be.a('string')
			.and.to.equal('Something went wrong')
			expect(exRich.get()).to.equal(undefined)
		})
	})
	describe('guessStatusCodeOfLocale', function(){
		it('guessStatusCodeOfLocale properly guesses status code', function(){
			let guess = remie.create().guessStatusCodeOfLocale
			expect(guess('server.400.forbidden')).to.equal(403)
			expect(guess('server.400.notFound')).to.equal(404)
			expect(guess('server.400.unauthorized')).to.equal(401)
			expect(guess('server.400.test')).to.equal(400)
		})
	})
	describe('set', function(){
		it('set can be used with create to make a copy', function(){
			let copy = remie.copy(exRich)
			expect(remie.create().set(exRich)).to.not.be.empty.and.to.equal(copy)
		})
		it('set returns a Rich Error wih the expected properties', function(){ // will always return a RichError
			let callSet = remie.create().set(exRich) // other must be a RichError to call set
			expect(callSet).to.be.an.instanceof(RichError)
			expect(callSet).to.have.property('error').and.to.have.property('code')
			.and.to.equal('server.400.forbidden')
			expect(callSet).to.have.property('error').and.to.have.property('message')
			.and.to.equal('Something went wrong')
			expect(callSet).to.have.property('error').and.to.have.property('stack')
			expect(callSet).to.include({
				'internalOnly': false, 
				'internalMessage': "I'm the internal message for developer eyes only",
				'level' : 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 400})
			expect(callSet).to.have.property('options').and.to.equal(options)
			expect(callSet).to.have.property('error').and.to.be.an.instanceof(Error)
		})
	})
	describe('toObject', function(){
		it("toObject returns object with Rich Error properties", function(){
			let objct = exRich.toObject()
			expect(objct).to.be.an('object')
			expect(objct).to.not.be.an.instanceof(RichError)	
			expect(objct).to.have.property('error').and.to.have.property('code')
			.and.to.equal('server.400.forbidden')
			expect(objct).to.have.property('error').and.to.have.property('message')
			.and.to.equal('Something went wrong')
			expect(objct).to.have.property('error').and.to.have.property('stack')
			expect(objct).to.include({
				'internalOnly': false,
				'internalMessage': "I'm the internal message for developer eyes only",
				'level': 'error',
				'messageData': undefined,
				'referenceData': undefined,
				'statusCode': 400})
		})
	})
	describe('toResponseObject', function(){
		it('toResponseObject returns an object without the internal properties of Rich Error', function() {
			let exRich = remie.create('Something went wrong', options)
			let resp = exRich.toResponseObject()
			expect(remie.create().toResponseObject()).to.be.an('object')
			expect(remie.create().toResponseObject()).to.not.be.an.instanceof(RichError)
			expect(exRich).to.have.property('internalMessage')
			expect(exRich).to.have.property('internalOnly')
			expect(resp).to.include({
				'level': 'error', 
				'statusCode': 400})
			expect(resp).to.not.have.property('internalOnly')
			expect(resp).to.not.have.property('internalMessage')
			expect(resp).to.have.property('error').to.include({
				'message': 'Something went wrong', 
				'code': 'server.400.forbidden'})
		})
	})
	describe('seti18next', function(){
		it('seti18next returns i18next when given options.i18next and removes it from options afterwards', function(){
			let options = {}
			options.internalMessage = 'I\'m the internal message for developer eyes only'
			options.code = 'server.400.forbidden'
			options.statusCode = 400
			options.i18next = i18next
			expect(remie.create().seti18next(options)).to.equal(i18next)
			expect(options.i18next).to.not.exist
		})
	})
	describe('removeEmptyProps', function(){
		it('removeEmptyProps works', function(){
			let exRich = remie.create(new Error(), options)
			expect(exRich).to.include({
				'internalOnly': false, 
				'internalMessage': 'I\'m the internal message for developer eyes only', 
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 400})
				.and.to.have.property('options').to.equal(options)
			expect(exRich.removeEmptyProps()).to.include({
				'internalOnly': false, 
				'internalMessage': 'I\'m the internal message for developer eyes only', 
				'level': 'error', 
				'statusCode': 400})
			expect(exRich.removeEmptyProps()).to.not.have.property('referenceData')
			expect(exRich.removeEmptyProps()).to.not.have.property('messageData')
		})
	})
	/*it('set does not need to be sent a Rich Error to work', function(){
		let other = {}
		other.error = {}
		other.error.message = 'hello'
		other.error.code = 7
		other.error.stack = 123
		other.statusCode = 3
		let callSet = exRich.set(other)
		expect(callSet).to.have.property('statusCode').and.to.equal(3)
	})*/

	it('exRich is not null or undefined', function(){
		expect(exRich).to.exist;
	})

	it('exRich is an instance of Rich Error', function(){
		expect(exRich).to.be.an.instanceof(RichError);
	})
});