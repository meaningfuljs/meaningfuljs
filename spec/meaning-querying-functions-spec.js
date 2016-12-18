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

	it('creates a list and add elements to it', function() {
		meaningful.register({
			func: function(list) { eval(list + '= []'); },
			question: 'create {} list',
			input: [ { name: 'list' } ]
		});

		meaningful.register({
			func: function(list, element) { eval(list + '.push(\'' + element + '\')'); },
			question: 'add {} element {} to {} list',
			input: [ { name: 'list' }, { name: 'element' } ]
		});

		meaningful.build([ 'planets {is instance of} list' ]);
		meaningful.build([ 'Earth {is instance of} element' ]);
		meaningful.build([ 'Jupiter {is instance of} element' ]);

		meaningful.query('create {} planets', { execute: true });
		expect(planets).toEqual([]);
		meaningful.query('add {} Earth {} to {} planets', { execute: true });
		meaningful.query('add {} Jupiter {} to {} planets', { execute: true });
		expect(planets).toEqual([ 'Earth', 'Jupiter' ]);
	});

	it('tries to add planet but fails and then use explanation', function() {
		var addEnabled = true;
		var planets = [];

		meaningful.register({
			func: function(list, element) { if (addEnabled) eval(list + '.push(\'' + element + '\')'); else throw "add disabled"; },
			question: 'add {} element {} to {} list',
			input: [ { name: 'list' }, { name: 'element' } ],
			error: function(err) { if (err === 'add disabled') return 'enable {} add'; }
		});

		meaningful.register({
			func: function(list, element) { addEnabled = true; },
			question: 'enable {} add'
		});

		meaningful.build([ 'planets {is instance of} list' ]);
		meaningful.build([ 'Earth {is instance of} element' ]);
		meaningful.build([ 'Jupiter {is instance of} element' ]);

		meaningful.query('add {} Earth {} to {} planets', { execute: true });
		expect(planets).toEqual([ 'Earth' ]);
		addEnabled = false;
		meaningful.query('add {} Jupiter {} to {} planets', { execute: true, error: function(err) { meaningful.query(err, { execute: true }); } });
		expect(planets).toEqual([ 'Earth' ]);
		meaningful.query('add {} Jupiter {} to {} planets', { execute: true });
		expect(planets).toEqual([ 'Earth', 'Jupiter' ]);
	});

});