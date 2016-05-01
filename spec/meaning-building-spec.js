var _ = require('underscore');
var meaningful = require('../meaningful');

describe('Meaningful.js', function() {

	afterEach(function() {
		meaningful.reset();
	});

	it('builds a simple identifier', function() {
		var string = 'planet';
		var result = meaningful.build(string);
		expect(result).toEqual({});
	});

	it('builds several identifiers', function() {
		var string = 'planet is celestial body';
		var result = meaningful.build(string);
		expect(result).toEqual({});
	});

	it('builds a simple identifier with a reference', function() {
		var string = 'planet[#1]';
		var result = meaningful.build(string);
		expect(result).toEqual({
			//'planet': {}
		});
	});

	it('builds an identifier with a relation after it', function() {
		var string = 'planet [has property]';
		var result = meaningful.build(string);
		expect(result).toEqual({
			planet: {
				$props: []
			}
		});
	});

	it('builds an identifier with a relation before it', function() {
		var string = '[is instance of] planet';
		var result = meaningful.build(string);
		expect(result).toEqual({
			planet: {
				$instances: [ '' ]
			},
			'': {
				$types: [ 'planet' ]
			}
		});
	});
	
	it('builds 2 identifiers linked with a relation', function() {
		var string1 = '[/]The Sun[/#1 has property #2] has [/]color[/#2]';
		var string2 = 'The Sun[#1 has property #2] has [/]color[/#2]';
		var expected = {
			'The Sun': {
				$props: [ 'color' ]
			}
		};
		expect(meaningful.build(string1)).toEqual(expected);
		expect(meaningful.build(string2)).toEqual(expected);
	});

	it('builds differenly when order is different', function() {
		var result1 = meaningful.build('The Sun [has property] color [has value] yellow', { repo: {} });
		var result2 = meaningful.build('color [is property of] The Sun [has value] yellow', { repo: {} });
		expect(result1).toEqual({
			'The Sun': {
				$props: [{
					'color': {
						$values: [ 'yellow' ]
					}
				}]
			}
		});
		expect(result2).toEqual({
			'The Sun': {
				$props: [ 'color' ],
				$values: [ 'yellow' ]
			}
		});
	});

	it('builds and ignores wrong relation', function() {
		var result1 = meaningful.build('The Sun [has property] color [has value] yellow [haz]', { repo: {} });
		expect(result1).toEqual({
			'The Sun': {
				$props: [{
					'color': {
						$values: [ 'yellow' ]
					}
				}]
			}
		});
	});

	it('builds with relation without reference in the end', function() {
		var result1 = meaningful.build('The Sun [has property] color [has value] yellow [has]', { repo: {} });
		expect(result1).toEqual({
			'The Sun': {
				$props: [{
					'color': {
						$values: [{
							'yellow': {
								$has: []
							}
						}]
					}
				}]
			}
		});
	});

	it('builds with duplicate relations', function() {
		var result1 = meaningful.build('The Sun [has] [has #1] color[#1] [has value] yellow', { repo: {} });
		var result2 = meaningful.build('The Sun [has #1] [has] color[#1] [has value] yellow', { repo: {} });
		expect(result1).toEqual({
			'The Sun': {
				$has: [{
					'color': {
						$values: [ 'yellow' ]
					}
				}]
			}
		});
		expect(result2).toEqual(result1);
	});

	it('builds with duplicate strings', function() {
		var result1 = meaningful.build('The Sun [has] color [#1]The Sun[/#1] [is] yellow', { repo: {} });
		expect(result1).toEqual({ // the second value is overwritten
			'The Sun': {
				$is: [ 'yellow' ],
				$has: [ 'color' ]
			},
			'yellow': {
				$is: [ 'The Sun' ]
			}
		});
	});

	it('builds with duplicate references', function() {
		var result1 = meaningful.build('[/]The Sun[/#1] [has] [/]color[/#1]', { repo: {} });
		var result2 = meaningful.build('[/]The Sun[/#1] [has #1] [/]color[/#1]', { repo: {} });
		var result3 = meaningful.build('The Sun [has #1] [/]color[/#1] [/]yellow[/#1]', { repo: {} });
		expect(result1).toEqual({
			'The Sun': {
				$has: [	'color' ]
			}
		});
		expect(result2).toEqual({}); // empty because it is incorrect situation
		expect(result3).toEqual(result1);
	});

	it('builds 3 identifiers linked with 2 relations', function() {
		var string = '[/]The Sun[/#1 has property #2] has [/]yellow[/#3] [/]color[/#2 has value #3]';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'The Sun': {
				$props: [{ 
					'color': {
						$values: [ 'yellow' ]
					}
				}]
			}
		});
	});

	it('builds identifiers linked with several relations in direct and reverse order', function() {
		var string1 = 'The Sun [has] atmosphere [has part] heliosphere [has property] color [has value] yellow';
		var string2 = 'yellow [is value of] color [is property of] heliosphere [is part of] atmosphere [of] The Sun';
		var result1 = meaningful.build(string1);
		var result2 = meaningful.build(string2, { repo: {} });
		expect(result1).toEqual(result2);
		expect(result1).toEqual({
			'The Sun': {
				$has: [{ 
					'atmosphere': {
						$parts: [{
							'heliosphere': {
								$props: [{
									'color': {
										$values: [ 'yellow' ]
									}
								}]
							}
						}]
					}
				}]
			}
		});
	});

	it('builds complex hierarchies of identifiers', function() {
		var strings = [
			'Universe [has] Galaxy [has] Solar System [has] Earth [has part] atmosphere [has] chemistry [has] oxygen',
			'Universe [has] Galaxy [has] Solar System [has] Earth [has part] atmosphere [has] chemistry [has] nitrogen',
			'Universe [has] Galaxy [has] Solar System [has] Earth [has part] atmosphere [has part] stratosphere',
			'Universe [has] Galaxy [has] Solar System [has] Earth [has part] atmosphere [has part] troposphere',
			'Universe [has] Galaxy [has] Solar System [has] The Sun [has property] color [has value] yellow',
			'Universe [has] Galaxy [has] Solar System [has] The Sun [has part] atmosphere [has part] heliosphere [has property] color [has value] yellow',
			'Universe [has] Galaxy [has] Solar System [has] The Sun [has part] atmosphere [has part] chromosphere',
			'Universe [has] Galaxy [has] Solar System [has] The Sun [has part] atmosphere [has part] corona [has property] color [has value] yellow'
		];
		var result = meaningful.build(strings);
		expect(result).toEqual({
			'Universe': {
				$has: [{
				'Galaxy': {
					$has: [{
						'Solar System': {
							$has: [{
								'Earth': {
									$parts: [{
										'atmosphere': {
											$has: [{
												'chemistry': {
													$has: [
														'oxygen',
														'nitrogen'
													]
												}
											}],
											$parts: [
												'stratosphere',
												'troposphere'
											]
										}
									}]
								}
							}, {
								'The Sun': {
									$props: [{
										'color': {
											$values: [ 'yellow'	]
										}
									}],
									$parts: [{
										'atmosphere': {
											$parts: [{
												'heliosphere': {
													$props: [{
														'color': {
															$values: [	'yellow' ]
														}
													}]
												}
											},
												'chromosphere',	{
												'corona': {
													$props: [{
														'color': {
															$values: [ 'yellow' ]
														}
													}]
												}
											}]
										}
									}]
								}
							}]
						}
					}]
				}
			}]
			}
		});
	});

	it('adds the second build result to repository', function() {
		var string1 = 'The Sun [has] atmosphere [has part] heliosphere [has property] color [has value] yellow';
		var string2 = 'The Sun [has property] color [has value] yellow';
		var result1 = meaningful.build(string1);
		var result2 = meaningful.build(string2);
		expect(result1).toEqual({
			'The Sun': {
				$has: [{ 
					'atmosphere': {
						$parts: [{
							'heliosphere': {
								$props: [{
									'color': {
										$values: [ 'yellow' ]
									}
								}]
							}
						}]
					}
				}],
				$props: [{ 
					'color': {
						$values: [ 'yellow' ] 
					}
				}]
			}
		});
	});

	it('does not add the second build result to repository if the second call uses own repository', function() {
		var string1 = 'The Sun [has] atmosphere [has part] heliosphere [has property] color [has value] yellow';
		var string2 = 'The Sun [has property] color [has value] yellow';
		var result1 = meaningful.build(string1);
		var result2 = meaningful.build(string2, { repo: {} });
		expect(result1).toEqual({
			'The Sun': {
				$has: [{ 
					'atmosphere': {
						$parts: [{
							'heliosphere': {
								$props: [{
									'color': {
										$values: [ 'yellow' ]
									}
								}]
							}
						}]
					}
				}]
			}
		});
	});

	it('does not add the second build result to repository if the second call adds similar meaning', function() {
		var string1 = 'The Sun [has] atmosphere [has part] heliosphere [has property] color [has value] yellow';
		var string2 = 'The Sun [has] atmosphere [has part] heliosphere';
		var result1 = meaningful.build(string1);
		var result2 = meaningful.build(string2);
		expect(result1).toEqual({
			'The Sun': {
				$has: [{ 
					'atmosphere': {
						$parts: [{
							'heliosphere': {
								$props: [{
									'color': {
										$values: [ 'yellow' ]
									}
								}]
							}
						}]
					}
				}]
			}
		});
	});

	it('builds person and space-time relations', function() {
		var string = 'humans[@person] [does] inhabit [has property #1 #2] [/]Earth[/#1 @space] for [/]thousand years[/#2 @time period]';
		var result = meaningful.build(string);
		expect(result).toEqual({
		    'humans': {
		    	'@person': '',
		    	$does: [{
		    		'inhabit': {
		    			//$props: [ 'Earth', 'thousand years' ]
		    			$props: [{ 
		    				'Earth' : {
		    					'@space': ''
		    				}
		    			}, {
		    				 'thousand years': {
						    	'@time': 'period'
		    				}
		    			}]
		    		}
		    	}]
		    },
		    /*'Earth': {
		    	'@space': ''
		    },
		    'thousand years': {
		    	'@time': 'period'
		    }*/
		});
	});

	it('builds structural and action relations', function() {
		var result1 = meaningful.build('Solar System [has] Earth [does] orbit', { repo: {} });
		var result2 = meaningful.build('orbit [done by] Earth [of] Solar System', { repo: {} });
		expect(result1).toEqual({
			'Solar System': {
				$has: [{
					'Earth': {
						$does: [ 'orbit' ]
					}
				}]
			}
		});
		expect(result1).toEqual(result2);
	});

	it('builds structural and cause-effect relations', function() {
		var result1 = meaningful.build('Solar System [has] Earth [causes] lunar eclipse', { repo: {} });
		var result2 = meaningful.build('lunar eclipse [caused by] Earth [of] Solar System', { repo: {} });
		expect(result1).toEqual({
			'Solar System': {
				$has: [{
					'Earth': {
						$causes: [ 'lunar eclipse' ]
					}
				}]
			}
		});
		expect(result1).toEqual(result2);
	});

	it('builds structural relations and condition', function() {
		var result1 = meaningful.build('Solar System [has] Earth [has condition] atmosphere', { repo: {} });
		var result2 = meaningful.build('atmosphere [is condition of] Earth [of] Solar System', { repo: {} });
		expect(result1).toEqual({
			'Solar System': {
				$has: [{
					'Earth': {
						$conditions: [ 'atmosphere' ]
					}
				}]
			}
		});
		expect(result1).toEqual(result2);
	});

	it('builds all meaning', function() {
		var meaning = [
			'celestial body [is type of] planet [has property] diameter',
			'planet [is type of] Mercury [has property] diameter [has value] 4879',
			'planet [is type of] Venus [has property] diameter [has value] 12104',
			'planet [is type of] Earth [has property] diameter [has value] 12756',
			'planet [is type of] Mars [has property] diameter [has value] 6792',
			'planet [is type of] Jupiter [has property] diameter [has value] 142984',
			'planet [is type of] Saturn [has property] diameter [has value] 120536',
			'planet [is type of] Uranus [has property] diameter [has value] 51118',
			'planet [is type of] Neptune [has property] diameter [has value] 49528'
		];
		var result = meaningful.build(meaning);
		expect(result).toEqual({
			'celestial body': {
				$instances: [	'planet' ]
			},
			'planet': {
				$props: [	'diameter' ],
				$types: [ 'celestial body' ],
				$instances: [
					'Mercury',
					'Venus',
					'Earth',
					'Mars',
					'Jupiter',
					'Saturn',
					'Uranus',
					'Neptune'
				]
			},
			'Mercury': {
				$props: [{ 'diameter': { $values: [ '4879' ] } }],
				$types: [ 'planet' ]
			},
			'Venus': {
				$props: [{ 'diameter': { $values: [ '12104' ] }	}],
				$types: [	'planet' ]
			},
			'Earth': {
				$props: [{ 'diameter': { $values: [ '12756' ] }	}],
				$types: [	'planet' ]
			},
			'Mars': {
				$props: [{ 'diameter': { $values: [ '6792' ] } }],
				$types: [ 'planet' ]
			},
			'Jupiter': {
				$props: [{ 'diameter': { $values: [ '142984' ] } }],
				$types: [ 'planet' ]
			},
			'Saturn': {
				$props: [{ 'diameter': { $values: [ '120536' ] } }],
				$types: [ 'planet' ]
			},
			'Uranus': {
				$props: [{ 'diameter': { $values: [ '51118' ] } }],
				$types: [ 'planet' ]
			},
			'Neptune': {
				$props: [{ 'diameter': { $values: [ '49528' ] } }],
				$types: [ 'planet' ]
			}
		});
	});

	it('builds a what query', function() {
		var string1 = 'what[_] [is] star';
		var string2 = 'what[_] star';
		var string3 = 'what[_ @thing] star';
		var string4 = 'what[_ @thing] [is] star';
		var result1 = meaningful.build(string1, { repo: {} });
		var result2 = meaningful.build(string2, { repo: {} });
		var result3 = meaningful.build(string3, { repo: {} });
		var result4 = meaningful.build(string4, { repo: {} });
		expect(result1).toEqual({
			'[_ @thing]': {
				$is: [ 'star' ]
			},
			'star': {
				$is: [ '[_ @thing]' ]
			}
		});
		expect(result2).toEqual(result1);
		expect(result3).toEqual(result1);
	});

	it('builds a who query', function() {
		var string = 'who[_ @person] [does] inhabit [has property] Earth';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'[_ @person]': {
				$does: [{
					'inhabit': {
						$props: [ 'Earth' ]
					}
				}]
			}
		});
	});

	it('builds a what does query', function() {
		var string = 'what[_ @action] do [done by #1 has #2] [/]humans[/#1] do on [/]Earth[/#2]';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'humans': {
		    	$does: [{
		    		'[_ @action]': {
		    			$has: [ 'Earth' ]
		    		}
		    	}] 
		    }
		    /*'[_ @action]': {
		    	$has: [ 'Earth' ]
		    },
		    'humans': {
		    	$does: [ '[_ @action]' ] 
		    }*/
		});
	});

	it('builds a where query', function() {
		var string1 = '[#1]where[/#1 _ @space] humans [does] live [has property #1]';
		var string2 = 'where[_ @space] humans [does] live';
		var result1 = meaningful.build(string1, { repo: {} });
		var result2 = meaningful.build(string2, { repo: {} });
		expect(result1).toEqual({
			'humans': {
				$does: [{
					'live': {
						$props: [ '[_ @space]' ]
					}
				}]
			}
		});
		expect(result1).toEqual(result2);
	});

	it('builds a when query', function() {
		var string1 = '[#1]when[/#1 _ @time] Uranus [is done] discovered [has property #1]';
		var string2 = 'when[_ @time] Uranus [is done] discovered';
		var result1 = meaningful.build(string1, { repo: {} });
		var result2 = meaningful.build(string2, { repo: {} });
		expect(result1).toEqual({
			'Uranus': {
				$is_done: [{
					'discovered': {
						 $props: [ '[_ @time]' ]
					}
				}]
			}
		});
		expect(result1).toEqual(result2);
	});
  
	it('builds a how long query', function() {
		var string = 'how long[_ @time period] humans [does] inhabit [has] Earth';
		var result = meaningful.build(string);
		expect(result).toEqual({
		    'humans': {
		    	$does: [{
		    		'inhabit': {
		    			$has: [ 'Earth' ],
		    			$props: [ '[_ @time period]' ]
		    		}
		    	}]
		    }
		});
	});

	it('builds a how query', function() {
		var string = 'how[_ @cause] Neptune [is done] discovered';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'[_ @cause]': {
				$causes: [{
					'Neptune': {
						$is_done: [ 'discovered' ]
					}
				}]
			}
		});
	});

	it('builds a why query', function() {
		var string = 'why[_ @effect] Neptune [is done] discovered';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'[_ @effect]': {
				$caused_by: [{
					'Neptune': {
						$is_done: [ 'discovered' ]
					}
				}]
			}
		});
	});

	/*it('builds a which query', function() {
		var string = 'which[_ ~which] planet [is done] discovered [has property #2] in [#2]1781[/#2 @time]';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'1781': { '@time': '' },
			'[_ ~which]': {
				$is: [ 'planet' ]
			},
			'discovered': {
				$does_what: [	'planet' ],
				$props: [ '1781' ]
			},
			'planet': {
				$is_done: [ 'discovered' ],
				$is: [ '[_ ~which]' ]
			}
		});
	});*/

	it('builds a can query', function() {
		var string = 'can[_ @able] Neptune [is done] discovered';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'[_ @able]': {
				'Neptune': {
					$is_done: [ 'discovered' ]
				}
			}
		});
	});

	it('builds an abstraction', function() {
		var string = 'Mars [^file:///mars.txt ^https://en.wikipedia.org/wiki/Mars]';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'Mars': {
				$abstracts: [ 'file:///mars.txt', 'https://en.wikipedia.org/wiki/Mars' ]
			}
		});
	});

	it('builds a description', function() {
		var text = 'Mars is the fourth planet from the Sun and the second smallest planet in the Solar System after Mercury';
		var string = text + '[Mars^]';
		var result = meaningful.build(string);
		expect(result).toEqual({
			/*
			'Mars': {
				$refers: [ 'Mars is the fourth planet from t~1' ]
			}*/
			'Mars is the fourth planet from t~1': {
				$specifies: [ 'Mars' ]
			}
		});
	});

	it('builds a condition', function() {
		var string = 'computer [has] processor [has property "frequency"] [has condition] 1 GHz';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'computer': {
				$has: [{
					'processor': {
						$props: [{
							'frequency': {
								$conditions: [ '1 GHz' ]
							}
						}]
					}
				}]
			}
		});
	});

	it('builds an implicit property', function() {
		//var string = 'computer [has] processor [has property frequency] [has value] 1 GHz';
		var string = 'computer [has "processor" #1 #2] hard disk [#1] RAM [#2]';
		var result = meaningful.build(string);
		expect(result).toEqual({
			'computer': {
				$has: [
					'processor',
					'hard disk',
					'RAM'
				]
			}
		});
		expect(result).toEqual(meaningful.build('computer [has #1 "processor" #2] hard disk [#1] RAM [#2]'));
		expect(result).toEqual(meaningful.build('computer [has #1 #2 "processor"] hard disk [#1] RAM [#2]'));
		expect(result).toEqual(meaningful.build('computer [has "processor" "hard disk" RAM] hard disk [#1] RAM [#2]'));
	});

	it('builds an implicit property with a value which uses an extension', function() {
		var string1 = 'computer [has #1] 1 [#2] [@math units of] GHz[#3] or faster [/]processor[/#1] [has property "frequency"] [has value #2]';
		var string2 = 'computer [has] processor [has property frequency] [has value] 1 [#5] [@math units of] GHz[#3]';
		var result1 = meaningful.build(string1);
		var result2 = meaningful.build(string2);
		expect(result1).toEqual({
			'computer': {
				$has: [{
					'processor': {
						$props: [{
							'frequency': {
								$values: [{
									'1': {
										'@math $units': 'GHz'
									}
								}]
							}
						}]
					}
				}]
			}
		});
		expect(result1).toEqual(result2);
	});

	it('builds an implicit property with a condition which uses an extension', function() {
		var string1 = 'computer [has #1] 1 [#2] [@math greater than] [@math units of] GHz[#3] or faster [/]processor[/#1] [has property frequency] [has condition #2]';
		var string2 = 'computer [has] processor [has property frequency] [has condition] 1 [#5] [@math greater than] [@math units of] GHz[#3]';
		var result1 = meaningful.build(string1);
		var result2 = meaningful.build(string2);
		expect(result1).toEqual({
			'computer': {
				$has: [{
					'processor': {
						$props: [{
							'frequency': {
								$conditions: [{
									'1': {
										'@math $gt': '',
										'@math $units': 'GHz'
									}
								}]
							}
						}]
					}
				}]
			}
		});
		expect(result1).toEqual(result2);
	});

	it('builds a simple math problem', function() {
		var string = 'Mary[#m] [has] 5[#1] [@math units of #2] apples[#2], and [/]Tom[/#3] [does] gave[has property #4 #5] [is the same @math add] her[#4 is the same #m] 7[#5] [@math units of] apples';
		var result = meaningful.build(string);
		expect(result).toEqual({
			"Mary": {
				$has: [{
					"5": { "@math $units": "apples" }
				}],
				$same: [ "her" ]
			},
			"Tom": {
				$does: [{
					"gave": {
						$props: [{
							"her": {
								$same: [ "Mary" ]
							}
						}, {
							"7": { "@math $units": "apples"	}
						}],
						$same: [ "@math add" ]
					}
				}]
			},
			"@math add": {
				$same: [ "gave" ]
			}
		});

	});

	it('builds a complex between [has] relations', function() {
		var result = meaningful.build('A [has]    [/] C [has] D [/#2]    [has] E');
		expect(result).toEqual({
			'A': {
				$has: [ '##1[+]' ]
			},
			'##1[+]': {
				$has: [ 'E' ],
				$include: {
					'C': {
						$has: [ 'D' ]
					}
				}
			}
		});
	});

	it('builds a complex between [of] relations', function() {
		var result = meaningful.build('A [of]    [/] C [has] D [/#2]    [of] E');
		expect(result).toEqual({
			'E': {
				$has: [ '##1[+]' ]
			},
			'##1[+]': {
				$has: [ 'A' ],
				$include: {
					'C': {
						$has: [ 'D' ]
					}
				}
			}
		});
	});

	it('builds 2 complexes', function() {
		var result = meaningful.build('[/] A [has] B [/#1]    [/] C [has] D [/#2]');
		expect(result).toEqual({
			'##1[+]': {
				$include: {
					'A': {
						$has: [ 'B' ]
					}
				}
			},
			'##2[+]': {
				$include: {
					'C': {
						$has: [ 'D' ]
					}
				}
	
			}
		});
	});

	it('builds 2 linked complexes', function() {
		var result = meaningful.build('[/] A [has] B [/#1 has]    [/] C [has] D [/#2]');
		expect(result).toEqual({
			'##1[+]': {
				$has: [ '##2[+]' ],
				$include: {
					'A': {
						$has: [ 'B' ]
					}
				}
			},
			'##2[+]': {
				$include: {
					'C': {
						$has: [ 'D' ]
					}
				}
	
			}
		});
	});

	it('builds the second expression which modifies single value of the first', function() {
		meaningful.build('desktop [has] color [and] pattern [and] picture');
		var result = meaningful.build('desktop [has] pattern [has] fill');
		expect(result).toEqual({
			'desktop': {
				$has: [
					'color', {
					'pattern': {
						$has: [ 'fill' ] 
					}},
					'picture' 
				]
			}
		});
	});

});