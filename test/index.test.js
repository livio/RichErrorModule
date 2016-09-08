let expect = require('chai').expect,
	assert = require('chai').assert,
	RichError = require('../libs/RichError.js'),
	REMIE = require('../libs/index.js'),
	options = {};
	options.internalMessage = "I'm the internal message for developer eyes only",
	options.code = 'server.400.forbidden',
	options.statusCode = 400,
	remie = new REMIE('Something went wrong', options), // used to call REMIE methods, need create an instance of REMIE with RichError properties
	exRich = remie.create('Something went wrong', options) // used to call Rich Error methods

let locale = 'server.400.forbidden'
let err = {}
err.code = 'server.400.notFound'
err.message = 'message in an error'
err.stack = 'stack would go here'
	
//causes and catches an error
/*try {
	let exRich = RichError.create("Something went wrong", {});
} catch (e) {
	console.log('error caught')
	console.log(e)
}*/

describe('Rich-Error', function(){
	it('build returns undefined when passed an undefined err', function(){
		expect(exRich.build(undefined)).to.equal(undefined)
	}),

	it('build returns undefined and logs internal Message when err is undefined but options.internalMessage is not', function(){
		expect(exRich.build(undefined, options)).to.equal(3)
	}),

	it("toObject returns object with correct Rich Error properties", function(){
		let objct = exRich.toObject()
		expect(objct).to.be.an('object')
		expect(objct.error).to.have.property('code').and.to.equal('server.400.forbidden')
		expect(objct.error).to.have.property('message').and.to.equal('Something went wrong')
		expect(objct.error).to.have.property('stack')//.and.to.equal('Error: Something went wrong\n    at RichError.buildFromString (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:116:29)\n    at RichError.build (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:74:27)\n    at new RichError (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:52:10)\n    at REMIE.create (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/index.js:39:12)\n    at Object.<anonymous> (/Users/NicholasLivio/Documents/R2/REMIE-livio/test/index.test.js:10:17)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.require (module.js:468:17)\n    at require (internal/module.js:20:19)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:220:27\n    at Array.forEach (native)\n    at Mocha.loadFiles (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:217:14)\n    at Mocha.run (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:485:10)\n    at Object.<anonymous> (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/bin/_mocha:403:18)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.runMain (module.js:575:10)\n    at run (bootstrap_node.js:352:7)\n    at startup (bootstrap_node.js:144:9)\n    at bootstrap_node.js:467:3')
		expect(objct).to.include({
			'internalOnly': false,
			'internalMessage': "I'm the internal message for developer eyes only",
			'level': 'error',
			'messageData': undefined,
			'referenceData': undefined,
			'statusCode': 400})
	}),

	it('copy calls toObject', function(){
		let copy = remie.copy(exRich) // need to create error: code, message, stack, etc. properties
		expect(copy).to.be.instanceof(RichError)
		expect(copy.error).to.have.property('code').and.to.equal('server.400.forbidden')
		expect(copy.error).to.have.property('message').and.to.equal('Something went wrong')
		expect(copy.error).to.have.property('stack')//.and.to.equal('Error: Something went wrong\n    at RichError.buildFromString (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:116:29)\n    at RichError.build (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:74:27)\n    at new RichError (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:52:10)\n    at REMIE.create (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/index.js:39:12)\n    at Object.<anonymous> (/Users/NicholasLivio/Documents/R2/REMIE-livio/test/index.test.js:10:17)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.require (module.js:468:17)\n    at require (internal/module.js:20:19)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:220:27\n    at Array.forEach (native)\n    at Mocha.loadFiles (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:217:14)\n    at Mocha.run (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:485:10)\n    at Object.<anonymous> (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/bin/_mocha:403:18)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.runMain (module.js:575:10)\n    at run (bootstrap_node.js:352:7)\n    at startup (bootstrap_node.js:144:9)\n    at bootstrap_node.js:467:3')
		expect(copy).to.include({
			'internalOnly': false,
			'internalMessage': "I'm the internal message for developer eyes only",
			'level': 'error',
			'messageData': undefined,
			'referenceData': undefined,
			'statusCode': 400})
		expect(copy.options).to.equal(options)
	}),

	it('buildFromSystemError returns an object with default properties of a Rich Error', function(){
		let defSystErr = exRich.buildFromSystemError(undefined, undefined)
		expect(defSystErr).to.be.an('object')
		expect(defSystErr).to.include({
			'internalOnly': false, 
			'internalMessage': undefined, 
			'level': 'error', 
			'messageData': undefined, 
			'referenceData': undefined, 
			'statusCode': 500})
		expect(defSystErr.error).to.be.an.instanceof(Error)
		expect(defSystErr.options).to.be.empty
	}),

	it('buildFromLocale returns an object with default properties of a Rich Error', function(){
		let defLocaleErr = exRich.buildFromLocale(undefined, undefined)
		expect(defLocaleErr).to.be.an('object')
		expect(defLocaleErr).to.include({
			'internalOnly': false, 
			'internalMessage': undefined, 
			'level': 'error', 
			'messageData': undefined, 
			'referenceData': undefined, 
			'statusCode': 500})
		expect(defLocaleErr.error).to.be.an.instanceof(Error)
		expect(defLocaleErr.options).to.be.empty
	}),

	it('buildFromString returns an object with default properties of a Rich Error', function(){
		let defStringErr = exRich.buildFromString(undefined, undefined)
		expect(defStringErr).to.be.an('object')
		expect(defStringErr).to.include({
			'internalOnly': false, 
			'internalMessage': undefined, 
			'level': 'error', 
			'messageData': undefined, 
			'referenceData': undefined, 
			'statusCode': 500})
		expect(defStringErr.error).to.be.an.instanceof(Error)
		expect(defStringErr.options).to.be.empty
	}),

	it('buildFromSystemError returns an object with expected properties of a Rich Error', function(){
		let systemErr = exRich.buildFromSystemError(err, options)
		expect(systemErr).to.be.an('object')
		expect(systemErr).to.include({
			'internalOnly': false, 
			'internalMessage': "I'm the internal message for developer eyes only",
			'level': 'error', 
			'messageData': undefined, 
			'referenceData': undefined, 
			'statusCode': 400})
		expect(systemErr.error).to.include({
			'code': 'server.400.notfound', 
			'message': 'message in an error', 
			'stack': 'stack would go here'})
		expect(systemErr.options).to.equal(options)
	}),

	it('buildFromLocale returns an object with expected properties of a Rich Error', function(){
		let options = {};
		options.internalMessage = "I'm the internal message for developer eyes only",
		options.code = 'server.400.forbidden',
		localeErr = exRich.buildFromLocale(locale, options)
		expect(localeErr).to.be.an('object')
		expect(localeErr).to.include({
			'internalOnly': false,
			'internalMessage': "I'm the internal message for developer eyes only",
			'level': 'error',
			'messageData': undefined,
			'referenceData': undefined,
			'statusCode': 403})
		expect(localeErr.error).to.have.property('code').and.to.equal('server.400.forbidden')		
		expect(localeErr.error).to.have.property('message').and.to.equal('The page is forbidden')
		expect(localeErr.error).to.have.property('stack')//.and.to.equal('Error: The page is forbidden\n    at RichError.buildFromLocale (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:101:29)\n    at Context.<anonymous> (/Users/NicholasLivio/Documents/R2/REMIE-livio/test/index.test.js:129:22)\n    at callFn (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runnable.js:334:21)\n    at Test.Runnable.run (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runnable.js:327:7)\n    at Runner.runTest (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:429:10)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:535:12\n    at next (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:349:14)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:359:7\n    at next (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:285:14)\n    at Immediate.<anonymous> (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:327:5)\n    at runCallback (timers.js:570:20)\n    at tryOnImmediate (timers.js:550:5)\n    at processImmediate [as _immediateCallback] (timers.js:529:5)')
		expect(localeErr.options).to.equal(options)
	}),

	it('buildFromString returns an object with expected properties of a Rich Error', function(){
		let stringErr = exRich.buildFromString('Something went wrong', options)
		expect(stringErr).to.be.an('object')
		expect(stringErr).to.include({
			'internalOnly': false,
			'internalMessage': "I'm the internal message for developer eyes only",
			'level': 'error',
			'messageData': undefined,
			'referenceData': undefined,
			'statusCode': 400})
		expect(stringErr.error).to.have.property('code').and.to.equal('server.400.forbidden')
		expect(stringErr.error).to.have.property('message').and.to.equal('Something went wrong')
		expect(stringErr.error).to.have.property('stack')//.and.to.equal('Error: Something went wrong\n    at RichError.buildFromString (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:116:29)\n    at Context.<anonymous> (/Users/NicholasLivio/Documents/R2/REMIE-livio/test/index.test.js:145:26)\n    at callFn (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runnable.js:334:21)\n    at Test.Runnable.run (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runnable.js:327:7)\n    at Runner.runTest (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:429:10)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:535:12\n    at next (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:349:14)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:359:7\n    at next (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:285:14)\n    at Immediate.<anonymous> (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/runner.js:327:5)\n    at runCallback (timers.js:570:20)\n    at tryOnImmediate (timers.js:550:5)\n    at processImmediate [as _immediateCallback] (timers.js:529:5)')
	}),

	it('guessStatusCodeOfLocale properly guesses status code', function(){
		let guess = exRich.guessStatusCodeOfLocale
		expect(guess('server.400.forbidden')).to.equal(403)
		expect(guess('server.400.notFound')).to.equal(404)
		expect(guess('server.400.unauthorized')).to.equal(401)
		expect(guess('server.400.test')).to.equal(400)
	}),

	it('set returns an object with Rich Error properties', function(){
		let callSet = exRich.set(exRich)
		expect(callSet).to.be.an('object')
		expect(callSet).to.include({
			'internalOnly': false, 
			'internalMessage': "I'm the internal message for developer eyes only",
			'level' : 'error', 
			'messageData': undefined, 
			'referenceData': undefined, 
			'statusCode': 400})
		expect(callSet.options).to.equal(options)
		expect(callSet.error).to.be.an.instanceof(Error)
	}),

	it('get returns stuff', function(){
		let callGet = exRich.get
		expect(exRich.get('code')).to.be.a('string').and.to.equal('server.400.forbidden')
		expect(exRich.get('stack')).to.be.a('string')//.and.to.equal('Error: Something went wrong\n    at RichError.buildFromString (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:116:29)\n    at RichError.build (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:74:27)\n    at new RichError (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/RichError.js:52:10)\n    at REMIE.create (/Users/NicholasLivio/Documents/R2/REMIE-livio/libs/index.js:39:12)\n    at Object.<anonymous> (/Users/NicholasLivio/Documents/R2/REMIE-livio/test/index.test.js:10:17)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.require (module.js:468:17)\n    at require (internal/module.js:20:19)\n    at /Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:220:27\n    at Array.forEach (native)\n    at Mocha.loadFiles (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:217:14)\n    at Mocha.run (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/lib/mocha.js:485:10)\n    at Object.<anonymous> (/Users/NicholasLivio/.nvm/versions/node/v6.3.1/lib/node_modules/mocha/bin/_mocha:403:18)\n    at Module._compile (module.js:541:32)\n    at Object.Module._extensions..js (module.js:550:10)\n    at Module.load (module.js:458:32)\n    at tryModuleLoad (module.js:417:12)\n    at Function.Module._load (module.js:409:3)\n    at Module.runMain (module.js:575:10)\n    at run (bootstrap_node.js:352:7)\n    at startup (bootstrap_node.js:144:9)\n    at bootstrap_node.js:467:3')
		expect(exRich.get()).to.equal(undefined)
	}),

	it('build calls correct methods and they run properly WHEN SENT CORRECT PARAMETERS', function(){
		expect(exRich.build(undefined, options)).to.equal(3)
		expect(exRich.build(undefined)).to.equal(undefined)
		expect(exRich.build(exRich)).to.include({
			'internalOnly': false, 
			'internalMessage': "I'm the internal message for developer eyes only",
			'level': 'error', 
			'messageData': undefined, 
			'referenceData': undefined, 
			'statusCode': 400})
		expect(exRich.build(new Error())).to.include({
			'internalOnly': false, 
			'internalMessage': undefined, 
			'level': 'error', 
			'messageData': undefined, 
			'referenceData': undefined, 
			'statusCode': 500}) //calls buildFromSystemError
		expect(exRich.build('server.400.forbidden')).to.include({
			'internalOnly': false, 'internalMessage': undefined, 
			'level': 'error', 
			'messageData': undefined, 
			'referenceData': undefined, 
			'statusCode': 500}) //calls buildFromLocale
		expect(exRich.build('error')).to.include({
			'internalOnly': false, 
			'internalMessage': undefined, 
			'level': 'error', 
			'messageData': undefined, 
			'referenceData': undefined, 
			'statusCode': 500}) //calls buildFromString
		expect(exRich.build({})).to.include({
			'internalOnly': undefined, 
			'internalMessage': undefined,
			'level': undefined, 
			'messageData': undefined, 
			'referenceData': undefined, 
			'statusCode': undefined})
	}),

	it('toResponseObject', function() {
		let exRich = remie.create('Something went wrong', options)
		expect(exRich.toResponseObject()).to.be.an('object')
		expect(exRich.toResponseObject()).to.include({
			'level': 'error', 
			'statusCode': 400})
		expect(exRich.toResponseObject().error).to.include({
			'message': 'Something went wrong', 
			'code': 'server.400.forbidden'})
	}),

	it('exRich is not null or undefined', function(){
		expect(exRich).to.exist;
	}),

	it('exRich is an instance of Rich Error', function(){
		expect(exRich).to.be.an.instanceof(RichError);
	});
});