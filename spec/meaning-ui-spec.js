var _ = require('underscore');
var jsdom;
try {
	jsdom = require('jsdom');
} catch (error) {
	return;
}
var meaningful = require('../meaningful');

describe('Meaningful.js', function() {

    var window = undefined;

    describe('reads planets.html and', function() {

		beforeEach(function(done) {
			setTimeout(function() {
				jsdom.env({
					file: 'planets.html',
					scripts: [ 'node_modules/jquery/dist/jquery.js', 'node_modules/underscore/underscore.js' ],
					done: function(err, win) {
						window = win;
						done();
					},
					virtualConsole: jsdom.createVirtualConsole().sendTo(console)
				});
			}, 0);
		});

		afterEach(function() {
			meaningful.reset();
			window.close();
		});

		it('retrieves planet instances', function() {
			meaningful.uiBuild(window.$);
			expect(meaningful.getRepo()).not.toBe(null);
			var result = meaningful.query('what{_} {is} planet');
			expect(result).toEqual([
				'Mercury',
				'Venus',
				'Earth',
				'Mars',
				'Jupiter',
				'Saturn',
				'Uranus',
				'Neptune'
			]);
		});

	});

	describe('reads operating_system.html and', function() {

		beforeEach(function(done) {
			setTimeout(function() {
				jsdom.env({
					file: 'operating_system.html',
					scripts: [ 'node_modules/jquery/dist/jquery.js', 'node_modules/underscore/underscore.js' ],
					done: function(err, win) {
						window = win;
						done();
					},
					virtualConsole: jsdom.createVirtualConsole().sendTo(console)
				});
			}, 0);
		});

		afterEach(function() {
			meaningful.reset();
			window.close();
		});

		it('check if OS_like_OS can be installed on my computer', function() {
			meaningful.uiBuild(window.$);
			expect(meaningful.getRepo()).not.toBe(null);
			var userRepo = [
				'my computer {is} computer',
				_.template('my computer {has #1} <%- freq %> {#2} {@math units of} GHz {/}processor{/#1} {has property frequency} {has value #2}'),
				_.template('my computer {has #1} <%- ram %> {#2} {@math units of} GB {/}RAM{/#1} {has property volume} {has value #2}'),
				_.template('my computer {has #1} <%- hdd %> {#2} {@math units of} GB {/}hard disk{/#1} {has property space} {has value #2}')
			];
			var userRepo1 = meaningful.build([ userRepo[0], userRepo[1]({ freq: 1 }), userRepo[2]({ ram: 2 }), userRepo[3]({ hdd: 200 }) ], { repo: {} });
			var userRepo2 = meaningful.build([ userRepo[0], userRepo[1]({ freq: 3 }), userRepo[2]({ ram: 8 }), userRepo[3]({ hdd: 200 }) ], { repo: {} });
			expect(meaningful.query('Can{_ @able} I {/}run{/#1 does what #2 has property #3} {/}OS_like_OS{/#2} on {/}my computer{/#3}', { userRepo:  userRepo1 })).toEqual(false);
			expect(meaningful.query('Can{_ @able} I {/}run{/#1 does what #2 has property #3} {/}OS_like_OS{/#2} on {/}my computer{/#3}', { userRepo:  userRepo2 })).toEqual(true);
		});

	});

});