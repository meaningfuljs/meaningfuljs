var _ = require('underscore');
var meaningful = require('../meaningful');
var planet = require('../planet');

describe('Meaningful.js', function() {

	var debug = { log: { query: 'debug' } };

	function getBallVolume(diameter) {
		return (4/3) * Math.PI * Math.pow(diameter / 2, 3);
	}

	beforeEach(function() {
		//meaningful.config(debug);
	});

	afterEach(function() {
		meaningful.reset();
		//meaningful.config({ log: { query: 'info' } });
	});

	it('queries getBallVolume and getDiameter function', function() {
		meaningful.register({
			func: getBallVolume,
			question: 'What {_} {is} volume {of} ball',
			input: [
				{ name: 'diameter' }
			]
		});
		expect(meaningful.query('What {_} {is} volume {of} ball {has} diameter {has value} 2')).toEqual([ 4.1887902047863905 ]);
	});

	it('queries getDiameter function', function() {
		meaningful.register({
			func: planet.getPlanet,
			question: 'What {_} {is} diameter {of} planet',
			input: [
				{ name: 'planet', func: function(planetName) { return planetName ? planetName.toLowerCase() : undefined; } }
			],
			output: function(result) { return result.diameter; }
		});
		meaningful.build([ 'Jupiter {is instance of} planet' ]);
		expect(meaningful.query('What {_} {is} diameter {of} Jupiter')).toEqual([ 142984 ]);
	});

	it('queries getBallVolume and getDiameter function', function() {

		meaningful.register({
			func: planet.getPlanet,
			question: 'What {_} {is} diameter {of} planet',
			input: [
				{ name: 'planet', func: function(planetName) { return planetName ? planetName.toLowerCase() : undefined; } }
			],
			output: function(result) { return result.diameter; }
		});

		meaningful.register({
			func: getBallVolume,
			question: 'What {_} {is} volume {of} ball',
			input: [
				{ name: 'diameter' }
			]
		});
		meaningful.build([ 'Jupiter {is instance of} planet', 'planet {is} ball' ]);
		expect(meaningful.query('What {_} {is} volume {of} Jupiter')).toEqual([ 1530597322872155.8 ]);
	});

});