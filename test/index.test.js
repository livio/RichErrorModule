let expect = require('chai').expect,
	RichError = require('../libs/RichError.js'),
	REMIE = require('../libs/index.js'),
//	error = require('../examples/better-example.js')
	remie = new REMIE('Something went wrong'), // used to call REMIE methods
	options = {};
	options.internalMessage = "I'm the internal message for developer eyes only"
	options.code = 'server.400.forbidden'
	exRemie = remie.create('Something went wrong', options), // used to call Rich Error methods

	console.log(exRemie)/*
	let exRich = new RichError(exRemie.error)
	console.log(exRich)
	if (exRemie == exRich) {
		console.log('yes')
	} else {
		console.log('no')
	}
*/

let err = {}
err.code = 'server.400.notFound'
err.message = 'message in an error'
err.stack = 'stack would go here'

let objct = remie.toObject(exRemie)
let copy = remie.copy(exRemie)
console.log(copy)
	
//causes and catches an error
/*try {
	let exRemie = RichError.create("Something went wrong", {});
} catch (e) {
	console.log('error caught')
	console.log(e)
}*/

describe('Rich-Error', function(){
	it('build returns undefined when passed an undefined err', function(){
		expect(exRemie.build(undefined)).to.equal(undefined)
	}),

	it('build returns undefined and logs internal Message when err is undefined but options.internalMessage is not', function(){
		expect(exRemie.build(undefined, options)).to.equal(3)
	}),

	it("toObject returns object with correct richError properties", function(){
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
	})

	it('exRemie is not null or undefined', function(){
		expect(exRemie).to.exist;
	}),

	it('exRemie is an instance of Rich Error', function(){
		expect(exRemie).to.be.an.instanceof(RichError);
	});
});