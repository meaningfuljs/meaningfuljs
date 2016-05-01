var _ = require('underscore');
var meaningful = require('../meaningful');

describe('Meaningful.js', function() {

	var debug = { log: { query: 'debug' } };
	//meaningful.config(debug);

	afterEach(function() {
		meaningful.reset();
	});

	it('queries [is] and [is instance of]', function() {
		meaningful.build([
			'The Sun [is instance of] star',
			'Sirius [is instance of] star',
			'star [is] celestial body'
		]);
		var query1 = 'What[_] [is] star';
		var query2 = 'What is star';
		var query3 = 'What[_] [is instance of] star';
		var query4 = 'The Sun [is instance of] star'
		var expected = [ 'celestial body', 'The Sun', 'Sirius' ];
		expect(meaningful.markup(query2)).toEqual(query1);
		var result1 = meaningful.query(query1);
		var result2 = meaningful.ask(query2);
		var result3 = meaningful.query(query3);
		var result4 = meaningful.query(query4);
		expect(result1).toEqual(expected);
		expect(result1).toEqual(result2);
		expect(result3).toEqual([ 'The Sun', 'Sirius' ]);
		expect(result4).toEqual(true);
	});

	it('returns the same result for equivalent queries', function() {
		meaningful.build([
			'Mercury [has property] diameter [has value] 4879',
			'Venus [has property] diameter [has value] 12104',
			'Earth [has property] diameter [has value] 12756',
			'Mars [has property] diameter [has value] 6792',
			'Jupiter [has property] diameter [has value] 142984',
			'Saturn [has property] diameter [has value] 120536',
			'Uranus [has property] diameter [has value] 51118',
			'Neptune [has property] diameter [has value] 49528'
		]);
		var queries = [/*[ TODO: not supported now because "what is diameter" is ambiguous
			'what[_] [is] diameter [of] Jupiter',
			'what is diameter of Jupiter'
		],*/ [
			'what[_] [is value of] diameter [of] Jupiter',
			'what is value of diameter of Jupiter'
		]];
		var expected = [ '142984' ];
		_.each(queries, function(q) {
			expect(meaningful.markup(q[1])).toEqual(q[0]);
			var result1 = meaningful.query(q[0]);
			var result2 = meaningful.ask(q[1]);
			expect(result1).toEqual(expected);
			expect(result1).toEqual(result2);
		});
		expect(meaningful.query('what[_] [is] diameter [of] Vesta')).toEqual([]);
	});

	it('queries meaning not from the root', function() {
		meaningful.build('Universe [has] Galaxy [has] Solar System [has] The Sun [has] atmosphere [has] corona [has] color [has] yellow');
		var query1 = 'The Sun [has] atmosphere [has] corona [has] color';
		var query2 = 'What[_] [of] color [of] corona [of] atmosphere [of] The Sun';
		expect(meaningful.query(query1)).toEqual(true);
		expect(meaningful.query(query2)).toEqual(['yellow']);
	});

	it('queries who', function() {
		meaningful.build([
			'humans[@person] [does] live [has property #1 #2] on [#1/]Earth[/#1 @space] for [#2/]thousand years[/#2 @time period]'
		]);
		var query1 = 'who[_ @person] [does] live [has property #1] on [#1/]Earth[/#1]';
		var query2 = 'who live[v] on Earth[s]';
		var expected = [ 'humans' ];
		expect(meaningful.markup(query2)).toEqual(query1);
		var result1 = meaningful.query(query1);
		var result2 = meaningful.ask(query2);
		expect(result1).toEqual(expected);
		expect(result1).toEqual(result2);
	});

	it('queries what does', function() {
		meaningful.build([
			'humans[@person] [does] live [has property #1 #2] on [/]Earth[/#1 @space] for [/]thousand years[/#2 @time period]'
		]);
		var query11 = 'what do[_ @action] [has property #1 done by #2] [#2/]humans[/#2] do on [#1/]Earth[/#1]';
		var query12 = 'what[_ @action] do [done by #1 has property #2] [#1/]humans[/#1] do on [#2/]Earth[/#2]';
		var query2 = 'what do humans[n] do on Earth[s]';
		var expected = [[ 'humans', '[does]', 'live' ]]; // after one of changes this question started to return full answer
		//var expected = [ 'live' ];
		//var expected = [{"live":{"$props":["Earth","thousand years"]}}]
		expect(meaningful.markup(query2)).toEqual(query11);
		var result11 = meaningful.query(query11);
		var result12 = meaningful.query(query12);
		var result2 = meaningful.ask(query2);
		expect(result11).toEqual(expected);
		expect(result11).toEqual(result12);
		expect(result11).toEqual(result2);
	});

	it('queries where', function() {
		meaningful.build([
			'humans[@person] [does] live [has property #1 #2] on [/]Earth[/#1 @space] for [/]thousand years[/#2 @time period]'
		]);
		var query1 = 'where[_ @space] humans [does] live';
		var query2 = 'where humans[n] live[v]';
		var expected = [ 'Earth' ];
		expect(meaningful.markup(query2)).toEqual(query1);
		var result1 = meaningful.query(query1);
		var result2 = meaningful.ask(query2);
		expect(result1).toEqual(expected);
		expect(result1).toEqual(result2);
	});

	it('queries when', function() {
		meaningful.build([
			'Uranus [is done] discovered [has property #2] in [/]1781[/#2 @time]'
		]);
		var query1 = 'when[_ @time] Uranus [is done] discovered';
		var query2 = 'when Uranus[n] discovered[vp]';
		var expected = [ '1781' ];
		expect(meaningful.markup(query2)).toEqual(query1);
		var result1 = meaningful.query(query1);
		var result2 = meaningful.ask(query2);
		expect(result1).toEqual(expected);
		expect(result1).toEqual(result2);
	});

	it('queries how long', function() {
		meaningful.build([
			'humans[@person] [does] live [has property #1 #2] on [#1/]Earth[/#1 @space] for [#2/]thousand years[/#2 @time period]'
		]);
		var query1 = 'how long[_ @time period] humans [does] live [has property #1] on [#1/]Earth[/#1]';
		var query2 = 'how long humans[n] live[v] on Earth[s]';
		var expected = [ 'thousand years' ];
		expect(meaningful.markup(query2)).toEqual(query1);
		var result1 = meaningful.query(query1);
		var result2 = meaningful.ask(query2);
		expect(result1).toEqual(expected);
		expect(result1).toEqual(result2);
	});

	it('queries how', function() {
		var text = [
			'Download the bootable image from our site',
			'Write it to a USB drive or an optical disk',
			'Boot your computer with it',
			'Follow instructions on the screen'
		];
		_.each(text, function(t) {
			meaningful.build('install [does what] OS_like_OS [caused by] ' + t);
		});
		var result = meaningful.query('How[_ @cause] to [#1]install[/#1 does what] OS_like_OS');
		expect(result).toEqual(text);
	});

	it('queries why', function() {
		var text = [
			'Download the bootable image from our site',
			'Write it to a USB drive or an optical disk',
			'Boot your computer with it',
			'Follow instructions on the screen'
		];
		_.each(text, function(t) {
			meaningful.build('install [does what] OS_like_OS [caused by] ' + t);
		});
		var result = meaningful.query('Why[_ @effect] Download the bootable image from our site');
		expect(result).toEqual([{
			"OS_like_OS":{
				$is_done: [ "install" ]
			}
		}]);
	});

	it('queries can', function() {
		meaningful.build([
			'OS_like_OS [is done] run [has property] computer [has #1] 1 [#2] [@math greater than] [@math units of] GHz[#3] or faster [/]processor[/#1] [has property "frequency"] [has condition #2]',
			'OS_like_OS [is done] run [has property] computer [has #1] 4 [#2] [@math greater than] [@math units of] GB [#1/] RAM [/#1] [has property "volume"] [has condition #2]',
			'OS_like_OS [is done] run [has property] computer [has #1] 200 [#2] [@math greater than] [@math units of] MB [/]hard disk[/#1] [has property] space [has condition #2]'
		]);
		var userRepo = [
			'my computer [is] computer',
			_.template('my computer [has #1] <%- freq %> [#2] [@math units of] GHz [/]processor[/#1] [has property "frequency"] [has value #2]'),
			_.template('my computer [has #1] <%- ram %> [#2] [@math units of] GB [/]RAM[/#1] [has property "volume"] [has value #2]'),
			_.template('my computer [has #1] <%- hdd %> [#2] [@math units of] GB [/]hard disk[/#1] [has property "space"] [has value #2]')
		];
		var userRepo1 = meaningful.build([ userRepo[0], userRepo[1]({ freq: 2 }), userRepo[2]({ ram: 2 }), userRepo[3]({ hdd: 200 }) ], { repo: {} });
		var userRepo2 = meaningful.build([ userRepo[0], userRepo[1]({ freq: 2 }), userRepo[2]({ ram: 8 }), userRepo[3]({ hdd: 200 }) ], { repo: {} });
		expect(meaningful.query('Can[_ @able] I [/]run[/#1 does what #2 has property #3] [/]OS_like_OS[/#2] on [/]my computer[/#3]', { userRepo:  userRepo1 })).toEqual(false);
		expect(meaningful.query('Can[_ @able] I [/]run[/#1 does what #2 has property #3] [/]OS_like_OS[/#2] on [/]my computer[/#3]', { userRepo:  userRepo2 })).toEqual(true);
	});

	it('queries path', function() {
		meaningful.build([
			'OS_like_OS desktop [is the same] [/] OS_like_OS [has] desktop [/#1]',
			'OS_like_OS desktop [is property of] mouse right click [causes] context menu',
			'context menu [has] Properties item [causes] Desktop properties dialog',
			'Desktop color picker [is the same] [/] Desktop properties dialog [has] Appearance tab [has] color input [causes] color picker [/#2]',
			'Desktop color [is the same] [/] OS_like_OS desktop [has property] color [/#3]',
			'Desktop color picker [causes] Desktop color',
			'/etc/ui.cfg [has part] desktop section [has property] color attribute [causes] Desktop color'
		]);
		var result = meaningful.query('how [_ @cause] Desktop color');
		expect(result).toEqual([
			[ 
				'mouse right click', '[causes]',
				'context menu', '[has]',
				'Properties item', '[causes]',
				'Desktop properties dialog', '[has]',
				'Appearance tab', '[has]',
				'color input', '[causes]', 
				'color picker'
			],
			[
				'/etc/ui.cfg', '[has part]',
				'desktop section', '[has property]',
				'color attribute'
			]
		]);
	});

	it('queries path with alternatives and condition', function() {
		meaningful.build([
			'OS_like_OS desktop [is the same] [/] OS_like_OS [has] desktop [/#1]',
			'OS_like_OS desktop [is property of] mouse right click [causes] context menu',
			'context menu [has] Properties item [causes] Desktop properties dialog',
			'Properties key press [causes] context menu',
			'Desktop properties dialog Appearance tab [is the same] [/] Desktop properties dialog [has] Appearance tab [/#1]',
			'Desktop color picker [is the same] [/] Desktop properties dialog Appearance tab [has] color input [causes] color picker [/#2]',
			'Desktop color [is the same] [/] OS_like_OS desktop [has property] color [/#3]',
			'Desktop color picker [causes] Desktop color',
			'/etc/ui.cfg [has part] desktop section [has property] color attribute [causes] Desktop color',
			'Desktop properties dialog Appearance tab [has condition] [/] /etc/ui.cfg [has part] desktop section [has property] color-enabled attribute [/#1]'
		]);
		var result = meaningful.query('how [_ @cause] Desktop color');
		expect(result).toEqual([
			[
				[ 'mouse right click', '[causes]', 'context menu' ],
				[ 'Properties key press', '[causes]', 'context menu'],
				'context menu', '[has]', 
				'Properties item', '[causes]', 
				'Desktop properties dialog', '[has]', 
				'Appearance tab',
					['[has condition]', '/etc/ui.cfg', '[has part]', 'desktop section', '[has property]', 'color-enabled attribute' ],
				'[has]', 
				'color input', '[causes]', 
				'color picker'
			],
			[ '/etc/ui.cfg', '[has part]', 'desktop section', '[has property]', 'color attribute' ]
		]);
		expect(meaningful.query('what[_] Desktop color picker')).toEqual([{
			'Desktop properties dialog Appear~1': {
				$has: [{
					'color input': {
						$causes: [ 'color picker' ]
					}
				}]
			}
		}]);
	});

	it('queries complex path', function() {
		meaningful.build([
			'OS_like_OS desktop [is the same] [/] OS_like_OS [has] desktop [/#1]',
			'/etc/ui.cfg [has part] desktop section [has property] color attribute [causes] Desktop color',
			'/etc/ui.cfg [has part] desktop section [has property] pattern attribute [causes] Desktop pattern',
			'Desktop color [is the same] [/] OS_like_OS desktop [has property] color [/#3]',
			'Desktop pattern [is the same] [/] OS_like_OS desktop [has property] pattern [/#4]',
			'Desktop appearance [is the same] [/] Desktop color [and] Desktop pattern [and] Desktop picture [/#5]'
		]);
		var result = meaningful.query('how [_ @cause] Desktop appearance');
		expect(result).toEqual([
			[
				'/etc/ui.cfg', '[has part]',
				'desktop section', '[has property]',
				'color attribute'
			],
			[
				'/etc/ui.cfg', '[has part]',
				'desktop section', '[has property]',
				'pattern attribute'
			]
		]);
		expect(meaningful.query('what[_] Desktop appearance')).toEqual([ 'Desktop color', 'Desktop pattern', 'Desktop picture' ]);
	});

	it('queries similar meaning', function() {
		meaningful.build([
		   	'fly [is similar] [/] move [has property] air [@space] [/#1]',
			'falcon [is instance of] bird',
			'bird [does] fly'
		]);
		expect(meaningful.query('can[_ @able] falcon [does] fly')).toEqual(true);
		expect(meaningful.query('can[_ @able] bird [does] move')).toEqual(true);
	});

});