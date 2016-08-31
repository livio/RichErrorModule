let expect = require('chai').expect,
	test = require('../examples/better-example.js'),
	REMIE = require('../libs/index.js')

describe('Rich-Error', function(){
	it('REMIE is not null', function(){
		expect(test).to.not.be.a('null');
	});
});

describe('Rich-Error', function(){
	it('REMIE is not undefined', function(){
		expect(test).to.not.be.a('undefined');
	});
});

describe('Rich-Error', function(){
	it('REMIE is an instance of Rich Error', function(){
		expect(test).to.be.an.instanceof(REMIE);
	});
});