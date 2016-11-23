var _ = require('underscore');
var meaningful = require('../meaningful');

describe('Meaningful.js', function() {

	afterEach(function() {
		meaningful.reset();
	});

	it('executes and queries simple math problem', function() {
		var result = meaningful.execute(
			'{/}Mary{#m} {has} 5{#1} {@math units of #2} apples{#2} {/#ev1 @time then #ev2},' +
			'{/}and {/}Tom{/#3} {does} gave {has property #4 #5} {is the same @math add} her{#4 is the same #m} 7{#5} {@math units of #6} apples{#6}{/#ev2 @time then #ev3},' +
			'{/}then {/}Mary{/#m} {does} ate {has property #7} {is the same @math sub} 3 {#7 @math units of} apples{/#ev3}');
		expect(result).toEqual({
			'Mary': {
				$has: [{
					'9': { '@math $units': 'apples' }
				}]
			}
		});
		result = meaningful.query('How many{_ @math quantity} {@math units of} apples{#1} does {/}Mary{/#2 has _} have now');
		expect(result).toEqual([ '9' ]);
	});

	it('executes and queries simple math problem with different units', function() {
		var result = meaningful.execute(
			'{/}Mary{#m} {has #1a #1b} 5{#1a} {@math units of #2a} apples{#2a} and {/}4{/#1b} {@math units of #2b} pears{#2b} {/#ev1 @time then #ev2},' +
			'{/}and {/}Tom{/#3} {does} gave {has property #4 #5} {is the same @math add} her{#4 is the same #m} 7{#5} {@math units of #6} pears{#6}{/#ev2 @time then #ev3},' +
			'{/}then {/}Mary{/#m} {does} ate {has property #7} {is the same @math sub} 3 {#7 @math units of} apples{/#ev3}');
		expect(result).toEqual({
			"Mary": {
				$has: [{
					"2": { "@math $units": "apples"	}
				}, {
					"11": { "@math $units": "pears" }
				}
			]}
		});
		result = meaningful.query('How many{_ @math quantity} {@math units of} apples{#1} does {/}Mary{/#2 has _} have now');
		expect(result).toEqual([ '2' ]);
		result = meaningful.query('How many{_ @math quantity} {@math units of} pears{#1} does {/}Mary{/#2 has _} have now');
		expect(result).toEqual([ '11' ]);
	});

});