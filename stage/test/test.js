var should = require("should");

describe('My test of mocha', function(){


	var user = {
	    name: 'tj'
	    , pets: ['tobi', 'loki', 'jane', 'bandit']
	};


	it('should just execute itself', function(){
		user.should.have.property('name', 'tj');
	    });

	it('and just do something else', function(){
		user.should.have.property('name', 'tj');
	    });

    });