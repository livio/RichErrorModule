let expect = require('chai').expect,
	remie = require('../examples/better-example.js'),
	RichError = require('../libs/RichError.js')

describe('Rich-Error', function(){
	it('REMIE is not null', function(){
		expect(remie).to.not.be.a('null');
	});
});

describe('Rich-Error', function(){
	it('REMIE is not undefined', function(){
		expect(remie).to.not.be.a('undefined');
	});
});

describe('Rich-Error', function(){
	it('REMIE is an instance of Rich Error', function(){
		expect(remie).to.be.an.instanceof(RichError);
	});
});