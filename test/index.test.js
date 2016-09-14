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
	other = remie.create(myErr, options)
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
	describe('copy', function(){
		it('copy calls toObject', function(){
			let copy = remie.copy(exRich) // need to create error: code, message, stack, etc. properties
			expect(copy).to.be.instanceof(RichError)
			expect(copy).to.have.property('error').and.to.have.property('code')
			.and.to.equal('server.400.forbidden')
			expect(copy.error).to.have.property('message')
			.and.to.equal('Something went wrong')
			expect(copy.error).to.have.property('stack')
			//.and.to.equal('Error: Something went wrong\n    at RichError.buildFromString (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:116:29)\n    at RichError.build (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:74:27)\n    at new RichError (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:52:10)\n    at REMIE.create (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/index.js:39:12)\n    at Object.<anonymous> (/Users/NicholasLivio/Documents/R2/REMIE-livio/test/index.test.js:10:17)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.require (module.js:468:17)\n    at require (internal/module.js:20:19)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:220:27\n    at Array.forEach (native)\n    at Mocha.loadFiles (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:217:14)\n    at Mocha.run (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:485:10)\n    at Object.<anonymous> (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/bin/_mocha:403:18)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.runMain (module.js:575:10)\n    at run (bootstrap_node.js:352:7)\n    at startup (bootstrap_node.js:144:9)\n    at bootstrap_node.js:467:3')
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
			expect(remie.create().build(undefined, options)).to.equal(3)
		})
		it('build calls correct methods and they run properly when sent correct parameters', function(){
			expect(remie.create().build(undefined)).to.equal(undefined)
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
			let systemErr = remie.create().buildFromSystemError(myErr, options)
			expect(systemErr).to.be.an('object')
			expect(systemErr).to.include({
				'internalOnly': false, 
				'internalMessage': "I'm the internal message for developer eyes only",
				'level': 'error', 
				'messageData': undefined, 
				'referenceData': undefined, 
				'statusCode': 400})
			expect(systemErr).to.have.property('error').and.to.include({
				'code': 'server.400.notfound', 
				'message': 'message in an error', 
				'stack': 'stack: tells you where the error came from'})
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
			options.code = 'server.400.forbidden',
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
			//.and.to.equal('Error: The page is forbidden\n    at RichError.buildFromLocale (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:101:29)\n    at Context.<anonymous> (/Users/NicholasLivio/Documents/R2/REMIE-livio/test/index.test.js:129:22)\n    at callFn (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runnable.js:334:21)\n    at Test.Runnable.run (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runnable.js:327:7)\n    at Runner.runTest (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:429:10)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:535:12\n    at next (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:349:14)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:359:7\n    at next (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:285:14)\n    at Immediate.<anonymous> (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:327:5)\n    at runCallback (timers.js:570:20)\n    at tryOnImmediate (timers.js:550:5)\n    at processImmediate [as _immediateCallback] (timers.js:529:5)')
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
			//.and.to.equal('Error: Something went wrong\n    at RichError.buildFromString (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:116:29)\n    at Context.<anonymous> (/Users/NicholasLivio/Documents/R2/REMIE-livio/test/index.test.js:145:26)\n    at callFn (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runnable.js:334:21)\n    at Test.Runnable.run (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runnable.js:327:7)\n    at Runner.runTest (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:429:10)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:535:12\n    at next (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:349:14)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:359:7\n    at next (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:285:14)\n    at Immediate.<anonymous> (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:327:5)\n    at runCallback (timers.js:570:20)\n    at tryOnImmediate (timers.js:550:5)\n    at processImmediate [as _immediateCallback] (timers.js:529:5)')
		})
	})
	describe('get', function(){
		it('get returns error code, stack, or message', function(){
			expect(exRich.get('code')).to.be.a('string')
			.and.to.equal('server.400.forbidden')
			expect(exRich.get('stack')).to.be.a('string')
			//.and.to.equal('Error: Something went wrong\n    at RichError.buildFromString (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:116:29)\n    at RichError.build (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:74:27)\n    at new RichError (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:52:10)\n    at REMIE.create (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/index.js:39:12)\n    at Object.<anonymous> (/Users/NicholasLivio/Documents/R2/REMIE-livio/test/index.test.js:10:17)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.require (module.js:468:17)\n    at require (internal/module.js:20:19)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:220:27\n    at Array.forEach (native)\n    at Mocha.loadFiles (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:217:14)\n    at Mocha.run (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:485:10)\n    at Object.<anonymous> (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/bin/_mocha:403:18)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.runMain (module.js:575:10)\n    at run (bootstrap_node.js:352:7)\n    at startup (bootstrap_node.js:144:9)\n    at bootstrap_node.js:467:3')
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
			//.and.to.equal('Error: Something went wrong\n    at RichError.buildFromString (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:116:29)\n    at RichError.build (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:74:27)\n    at new RichError (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:52:10)\n    at REMIE.create (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/index.js:39:12)\n    at Object.<anonymous> (/Users/NicholasLivio/Documents/R2/REMIE-livio/test/index.test.js:10:17)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.require (module.js:468:17)\n    at require (internal/module.js:20:19)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:220:27\n    at Array.forEach (native)\n    at Mocha.loadFiles (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:217:14)\n    at Mocha.run (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:485:10)\n    at Object.<anonymous> (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/bin/_mocha:403:18)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.runMain (module.js:575:10)\n    at run (bootstrap_node.js:352:7)\n    at startup (bootstrap_node.js:144:9)\n    at bootstrap_node.js:467:3')
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
		it('toResponseObject', function() {
			let exRich = remie.create('Something went wrong', options)
			expect(remie.create().toResponseObject()).to.be.an('object')
			expect(remie.create().toResponseObject()).to.not.be.an.instanceof(RichError)
			expect(exRich.toResponseObject()).to.include({
				'level': 'error', 
				'statusCode': 400})
			expect(exRich.toResponseObject()).to.have.property('error').to.include({
				'message': 'Something went wrong', 
				'code': 'server.400.forbidden'})
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