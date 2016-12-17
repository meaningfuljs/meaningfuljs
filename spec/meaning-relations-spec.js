var _ = require('underscore');
var meaningful = require('../meaningful');

describe('Meaningful.js', function() {

	afterEach(function() {
		meaningful.reset();
	});

	it('builds an expression with {_} relation', function() {
		var string = 'what{_}';
		var result = meaningful.build(string);
		expect(result).toEqual({});
	});
	
	it('builds an expression with {} relation', function() {
		var string = 'book {} star';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'book': {
				$rel: [ 'star' ]
			},
			'star': {
				$rel: [ 'book' ]
			}
		});
	});

	it('builds an expression with {rel} relation', function() {
		var string = 'book {rel} star';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'book': {
				$rel: [ 'star' ]
			},
			'star': {
				$rel: [ 'book' ]
			}
		});
	});

	it('builds an expression with {is similar} relation', function() {
		var string = 'The Sun {is similar} Sirius';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'Sirius': {
				$similar: [ 'The Sun' ]
			},
			'The Sun': {
				$similar: [ 'Sirius' ]
			}
		});
	});

	it('builds an expression with {is the same} relation', function() {
		var string = 'The Sun {is the same} Soleil';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'Soleil': {
				$same: [ 'The Sun' ]
			},
			'The Sun': {
				$same: [ 'Soleil' ]
			}
		});
	});
	
	it('builds an expression with {is} relation', function() {
		var string = 'The Sun {is} star';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'star': {
				$is: [ 'The Sun' ]
			},
			'The Sun': {
				$is: [ 'star' ]
			}
		});
	});

	it('builds an expression with {of} relation', function() {
		var string = 'atmosphere {of} The Sun';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'The Sun': {
				$has: [ 'atmosphere' ]
			}
		});
	});

	it('builds an expression with {has} relation', function() {
		var string = 'The Sun {has} atmosphere';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'The Sun': {
				$has: [ 'atmosphere' ]
			}
		});
	});

	it('builds an expression with {is part of} relation', function() {
		var string = 'atmosphere {is part of} The Sun';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'The Sun': {
				$parts: [ 'atmosphere' ]
			}
		});
	});

	it('builds an expression with {has part} relation', function() {
		var string = 'The Sun {has part} atmosphere';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'The Sun': {
				$parts: [ 'atmosphere' ]
			}
		});
	});
	
	it('builds an expression with {is id of} relation', function() {
		var string = 'name {is id of} star';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'star': {
				$ids: [ 'name' ]
			}
		});
	});

	it('builds an expression with {has id} relation', function() {
		var string = 'star {has id} name';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'star': {
				$ids: [ 'name' ]
			}
		});
	});
	
	it('builds an expression with {is property of} relation', function() {
		var string = 'color {is property of} The Sun';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'The Sun': {
				$props: [ 'color' ]
			}
		});
	});

	it('builds an expression with {has property} relation', function() {
		var string = 'The Sun {has property} color';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'The Sun': {
				$props: [ 'color' ]
			}
		});
	});

	it('builds an expression with {is value of} relation', function() {
		var string = 'yellow {is value of} color';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'color': {
				$values: [ 'yellow' ]
			}
		});
	});

	it('builds an expression with {has value} relation', function() {
		var string = 'color {has value} yellow';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'color': {
				$values: [ 'yellow' ]
			}
		});
	});

	it('builds an expression with {is instance of} relation', function() {
		var string = 'The Sun {is instance of} star';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'star': {
				$instances: [ 'The Sun' ]
			},
			'The Sun': {
				$types: [ 'star' ]
			}
		});
	});

	it('builds an expression with {is type of} relation', function() {
		var string = 'star {is type of} The Sun';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'star': {
				$instances: [ 'The Sun' ]
			},
			'The Sun': {
				$types: [ 'star' ]
			}
		});
	});

	it('builds an expression with {abstracts} relation', function() {
		var string = 'Mars {abstracts} https://en.wikipedia.org/wiki/Mars';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'Mars': {
				$abstracts: [ 'https://en.wikipedia.org/wiki/Ma~1' ]
			}
		});
	});

	it('builds an expression with {specifies} relation', function() {
		var string = 'https://en.wikipedia.org/wiki/Mars {specifies} Mars';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'https://en.wikipedia.org/wiki/Ma~1': {
				$specifies: [ 'Mars' ]
			}
		});
	});

	it('builds an expression with 2 {has part} relation', function() {
		var string = 'The Sun {has part} atmosphere {has part} heliosphere';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'The Sun': {
				$parts: [{
					'atmosphere': {
						$parts: [ 'heliosphere' ]
					}
				}]
			}
		});
	});

	it('builds an expression with {and} relation', function() {
		var result = meaningful.build('planet {is type of} Mercury {and} Venus {and} Earth {and} Mars');
		expect(result).toEqual({
			'planet': {
				$instances: [ 'Mercury', 'Venus', 'Earth', 'Mars' ]
			},
			'Mercury': {
				$types: [ 'planet' ]
			},
			'Venus': {
				$types: [ 'planet' ]
			},
			'Earth': {
				$types: [ 'planet' ]
			},
			'Mars': {
				$types: [ 'planet' ]
			}
		});
	});

	it('builds an expression with {@able} relation', function() {
		var result = meaningful.build('bird {@able} fly');
		expect(result).toEqual({
			'bird': {
				'@able': [ 'fly' ]
			}
		});
		expect(result).toEqual(meaningful.build('bird {@able #1} fly {#1}'));
		expect(result).toEqual(meaningful.build('bird {@able #1} can {/} fly {/#1}'));
	});
	
});