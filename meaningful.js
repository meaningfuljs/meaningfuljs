/*
 *     Meaningful.js 0.0.1
 *     http://_NOT_meaningfuljs.org
 *     (c) 2016 Yuriy Guskov
 *     Meaningful.js may be freely distributed under the MIT license.
 *
 *     The library code may appear to be simplified but it works. 
 *     It has only to prove the conception. Further optimizations may apply.
 *     Moreover some requirements are still to be identified
 *     therefore refactoring should be applied only after this.
 *
 *     For example, parsing is done with simple regex and string splitting.
 *     Too simple but it works. Drawback is "adjusting" is required after parsing.
 *     Therefore refactoring will resolve this later.
 *
 *     Please also note sometimes code has ad-hoc solutions (to be generalized).
 */

(function() {
	'use strict';
	
	var isUI = typeof require === 'undefined'; // otherwise Node.js
	var _ =  isUI ? window._ : require('underscore');

	var exports = {
		build: build,
		ask: ask,
		query: query,
		execute: execute,
		getRepo: getRepo,
		reset: reset,
		config: config
	};
	
	if (!isUI) {
		module.exports = _.clone(exports);
		module.exports.markup = markup;
		module.exports.uiBuild = uiBuild;
	} else {
		exports.uiInit = uiInit;
		window.meaningful = exports;
	}
	
/*********************
 * Constants
 *********************/

	var SIGN_MU_BEGIN	= '[';
	var SIGN_MU_END		= ']';
	var SIGN_CLOSE		= '/';
	var SIGN_REF		= '#';
	var SIGN_INT_REF	= '##'; // internal ref
	var SIGN_UNKNOWN	= '_';
	var SIGN_REL		= '$'; // for model
	var SIGN_AT			= '@';
	var SIGN_QUANT		= '~';
	var SIGN_EREF       = '^'; // (potentially) external ref
	var SIGN_QUOTE		= '"';
	var SIGN_SQUOTE		= '\'';
	var SIGN_COMPLEX    = SIGN_MU_BEGIN + '+' + SIGN_MU_END;

	var SIGN_DUMMY_REF	= SIGN_INT_REF + '0';
	
	var REL_UNDEFINED   = -2;
	var REL_UNKNOWN     = -1;
	var REL_DEFAULT     =  0;
	var REL_INCLUDE     =  1; // include relation for isolate complexes
	
	var REL_IS_SIMILAR  = 101;
	var REL_IS_SAME     = 102;
	var REL_ABSTRACTS   = 103;
	var REL_SPECIFIES   = 104;

	var REL_IS          = 105; // undefined is
	var REL_OF          = 106; // undefined of
	var REL_HAS         = 107; // undefined has
	var REL_IS_PART     = 108;
	var REL_HAS_PART    = 109;
	var REL_IS_ID       = 110;
	var REL_HAS_ID      = 111;	
	var REL_IS_PROP     = 112;
	var REL_HAS_PROP    = 113;
	var REL_IS_VALUE    = 114;
	var REL_HAS_VALUE  	= 115;
	var REL_IS_INSTANCE	= 116;
	var REL_IS_TYPE    	= 117;
	var REL_OWNS		= 118; // has but not part or property (as color), ownning means something external
	var REL_OWNED_BY	= 119;
	
	// humans [does] live -> lived [done by] humans
	var REL_DOES		= 201;
	var REL_DONE_BY		= 202;
	// Uranus [is done] discovered -> ... [does] discover [does what] Uranus
	var REL_IS_DONE		= 203;
	var REL_DOES_WHAT	= 204;
	
	var REL_IS_CONDIT	= 205;
	var REL_HAS_CONDIT	= 206;

	var REL_CAUSES		= 207;
	var REL_CAUSED_BY	= 208;

	var REL_SPACE		= 301;
	var REL_TIME		= 302;
	var REL_PERSON		= 303;
	var REL_THING		= 304;
	var REL_ACTION		= 305;
	var REL_CAUSE		= 306;
	var REL_EFFECT		= 307;
	var REL_PURPOSE		= 308;
	var REL_MANNER		= 309;

	var REL_CONDITION   = 310;
	var REL_ABLE        = 311;

	var REL_TRUE		= 401;
	var REL_FALSE		= 402;
	var REL_NOT			= 403;
	var REL_AND			= 404;
	var REL_OR			= 405;
	var REL_ALL			= 406;
	var REL_SOME		= 407;
	var REL_ANY			= 408;
	var REL_WHICH		= 409;

	var REL_EXT			= 1000;
	var REL_MATH        = 1001; // extensions

/*********************
 * Relation constants
 *********************/

	// several maps because at first there was only one map with [...] strings as keys
    // bstring is "bare string"
    // can be refactored
	var REL_ATTRS = {};
	
	REL_ATTRS[REL_UNDEFINED  ] = { bstring: '' };
	REL_ATTRS[REL_UNKNOWN    ] = { bstring: '_', rev: REL_UNKNOWN, model: '_' };
	REL_ATTRS[REL_DEFAULT    ] = { bstring: 'rel', rev: REL_DEFAULT, model: '$rel' };
	REL_ATTRS[REL_INCLUDE    ] = { bstring: 'include', rev: REL_INCLUDE, model: '$include' };
	
	REL_ATTRS[REL_IS_SIMILAR ] = { bstring: 'is similar', rev: REL_IS_SIMILAR, model: '$similar' };
	REL_ATTRS[REL_IS_SAME    ] = { bstring: 'is the same', rev: REL_IS_SAME, model: '$same' };
	REL_ATTRS[REL_ABSTRACTS  ] = { bstring: 'abstracts', rev: REL_SPECIFIES, model: '$abstracts' };
	REL_ATTRS[REL_SPECIFIES  ] = { bstring: 'specifies', rev: REL_ABSTRACTS, model: '$specifies' };
	
	REL_ATTRS[REL_IS         ] = { bstring: 'is', rev: REL_IS, model: '$is' };
	REL_ATTRS[REL_OF         ] = { bstring: 'of', rev: REL_HAS, model: '$of' };
	REL_ATTRS[REL_HAS        ] = { bstring: 'has', rev: REL_OF, model: '$has' };
	REL_ATTRS[REL_IS_PART    ] = { bstring: 'is part of', rev: REL_HAS_PART, model: '$part_of' };
	REL_ATTRS[REL_HAS_PART   ] = { bstring: 'has part', rev: REL_IS_PART, model: '$parts' };
	REL_ATTRS[REL_IS_ID      ] = { bstring: 'is id of', rev: REL_HAS_ID, model: '$id_of' };
	REL_ATTRS[REL_HAS_ID     ] = { bstring: 'has id', rev: REL_IS_ID, model: '$ids' };
	REL_ATTRS[REL_IS_PROP    ] = { bstring: 'is property of', rev: REL_HAS_PROP, model: '$prop_of' };
	REL_ATTRS[REL_HAS_PROP   ] = { bstring: 'has property', rev: REL_IS_PROP, model: '$props' };
	REL_ATTRS[REL_IS_VALUE   ] = { bstring: 'is value of', rev: REL_HAS_VALUE, model: '$value_of' };
	REL_ATTRS[REL_HAS_VALUE  ] = { bstring: 'has value', rev: REL_IS_VALUE, model: '$values' };
	REL_ATTRS[REL_IS_INSTANCE] = { bstring: 'is instance of', rev: REL_IS_TYPE, model: '$types' };
	REL_ATTRS[REL_IS_TYPE    ] = { bstring: 'is type of', rev: REL_IS_INSTANCE, model: '$instances' };
	
	REL_ATTRS[REL_DOES       ] = { bstring: 'does', rev: REL_DONE_BY, model: '$does' };
	REL_ATTRS[REL_DONE_BY    ] = { bstring: 'done by', rev: REL_DOES, model: '$done_by' }; // done by subject
	REL_ATTRS[REL_IS_DONE    ] = { bstring: 'is done', rev: REL_DOES_WHAT, model: '$is_done' }; // passive voice
	REL_ATTRS[REL_DOES_WHAT  ] = { bstring: 'does what', rev: REL_IS_DONE, model: '$does_what' }; // does what

	REL_ATTRS[REL_IS_CONDIT  ] = { bstring: 'is condition of', rev: REL_HAS_CONDIT, model: '$condition_of' };
	REL_ATTRS[REL_HAS_CONDIT ] = { bstring: 'has condition', rev: REL_IS_CONDIT, model: '$conditions' };

	REL_ATTRS[REL_CAUSES     ] = { bstring: 'causes', rev: REL_CAUSED_BY, model: '$causes' };
	REL_ATTRS[REL_CAUSED_BY  ] = { bstring: 'caused by', rev: REL_CAUSES, model: '$caused_by' };

	REL_ATTRS[REL_SPACE      ] = { bstring: '@space', rev: REL_SPACE, model: '@space' };
	REL_ATTRS[REL_TIME       ] = { bstring: '@time', rev: REL_TIME, model: '@time' };
	REL_ATTRS[REL_PERSON     ] = { bstring: '@person', rev: REL_PERSON, model: '@person' };
	REL_ATTRS[REL_THING      ] = { bstring: '@thing', rev: REL_THING, model: '@thing' };
	REL_ATTRS[REL_ACTION     ] = { bstring: '@action', rev: REL_ACTION, model: '@aciton' };
	REL_ATTRS[REL_CAUSE      ] = { bstring: '@cause', rev: REL_EFFECT, model: '@cause' };
	REL_ATTRS[REL_EFFECT     ] = { bstring: '@effect', rev: REL_CAUSE, model: '@effect' };
	REL_ATTRS[REL_PURPOSE    ] = { bstring: '@purpose', rev: REL_PURPOSE, model: '@purpose' };
	REL_ATTRS[REL_MANNER     ] = { bstring: '@manner', rev: REL_MANNER, model: '@manner' };

	REL_ATTRS[REL_CONDITION  ] = { bstring: '@condition', rev: REL_CONDITION, model: '@condition' };
	REL_ATTRS[REL_ABLE       ] = { bstring: '@able', rev: REL_ABLE, model: '@able' };

	REL_ATTRS[REL_TRUE       ] = { bstring: 'true', rev: REL_FALSE, model: '@true' };
	REL_ATTRS[REL_FALSE      ] = { bstring: 'false', rev: REL_TRUE, model: '@false' };
	REL_ATTRS[REL_NOT        ] = { bstring: 'not', rev: REL_NOT, model: '$not' };
	REL_ATTRS[REL_AND        ] = { bstring: 'and', rev: REL_AND, model: '$and' };
	REL_ATTRS[REL_OR         ] = { bstring: 'or', rev: REL_OR, model: '$or' };
	REL_ATTRS[REL_ALL        ] = { bstring: 'all', rev: REL_ALL, model: '@all' };
	REL_ATTRS[REL_SOME       ] = { bstring: 'some', rev: REL_SOME, model: '@some' };
	REL_ATTRS[REL_ANY        ] = { bstring: 'any', rev: REL_ANY, model: '@any' };
	REL_ATTRS[REL_WHICH      ] = { bstring: 'which', rev: REL_WHICH, model: '@which' };

	REL_ATTRS[REL_MATH       ] = { bstring: '@math', rev: REL_MATH, model: '@math' };

	var REL_STRING_INDEX = {};

	_.each(_.keys(REL_ATTRS), function(key) {
		var key2 = key === REL_UNDEFINED ? '' : mu(REL_ATTRS[key].bstring);
		REL_ATTRS[key].string = key2;
		REL_STRING_INDEX[key2] = { rel: parseInt(key), rev: REL_ATTRS[key].rev, model: REL_ATTRS[key].model, type: REL_ATTRS[key].type };
	});

	var MODEL_INDEX = {}; // used in code: $target $index
	_.each(_.keys(REL_STRING_INDEX), function(key) {
		if (REL_STRING_INDEX[key].model)
			MODEL_INDEX[REL_STRING_INDEX[key].model] = REL_STRING_INDEX[key].rel;
	});
	
	var MATCHING_REL_INDEX = {};
	MATCHING_REL_INDEX[REL_IS] = [ REL_IS, REL_IS_SIMILAR, REL_IS_SAME, REL_IS_INSTANCE, REL_IS_TYPE, REL_HAS_VALUE ];
	MATCHING_REL_INDEX[REL_OF] = [ REL_OF, REL_IS_PART, REL_IS_ID, REL_IS_PROP ];
	MATCHING_REL_INDEX[REL_HAS] = [ REL_HAS, REL_HAS_PART, REL_HAS_ID, REL_HAS_PROP ];

	var BOTTOM_UP_RELS = [ REL_OF, REL_IS_PART, REL_IS_ID, REL_IS_PROP, REL_IS_VALUE, REL_DONE_BY, REL_DOES_WHAT, REL_IS_CONDIT, REL_CAUSED_BY ];
	var TOP_DOWN_RELS = [ REL_HAS, REL_HAS_PART, REL_HAS_ID, REL_HAS_PROP, REL_HAS_VALUE, REL_DOES, REL_IS_DONE, REL_HAS_CONDIT, REL_CAUSES ];

	function filterRelsByBstr(bstr) {
		return _.filter(REL_ATTRS, function(rel) {
			return bstr && rel.bstring.length > 0 ? bstr.toLowerCase().indexOf(rel.bstring) === 0 : false;
		});
	}

	function findRelByBstr(bstr) {
		return _.reduce(filterRelsByBstr(bstr), function(result, rec) {
			if (!result || rec.bstring.length > result.bstring.length)
				return rec;
			else
				return result;
		}, null);
	}

	function bstr2Rel(bstr) {
		return REL_STRING_INDEX[mu(bstr)] ? REL_STRING_INDEX[mu(bstr)].rel : undefined;
	}

	function relStr2RevRelStr(str) {
		return REL_ATTRS[REL_STRING_INDEX[str].rev];
	}

	function relStr2RevRelStr(str) {
		return REL_ATTRS[REL_STRING_INDEX[str].rev].string;
	}

	function rel2Mstr(rel) {
		return REL_ATTRS[rel] ? REL_ATTRS[rel].model : undefined;
	}

	function mstr2Str(mstr) {
		return typeof MODEL_INDEX[mstr] !== undefined && REL_ATTRS[MODEL_INDEX[mstr]] ? REL_ATTRS[MODEL_INDEX[mstr]].string : undefined;
	}

	function mstr2RevRelMstr(mstr) {
		return typeof MODEL_INDEX[mstr] !== undefined && REL_ATTRS[MODEL_INDEX[mstr]] && REL_ATTRS[REL_ATTRS[MODEL_INDEX[mstr]].rev] ? 
			REL_ATTRS[REL_ATTRS[MODEL_INDEX[mstr]].rev].model : undefined;
	}

	function mstrMatchesRel(mstr, rel) {
		var matchingRels = rel === REL_HAS ? TOP_DOWN_RELS : (rel === REL_OF ? BOTTOM_UP_RELS : undefined);
		return matchingRels ? _.contains(matchingRels, MODEL_INDEX[mstr]) : false;
		//return MATCHING_REL_INDEX[rel] ? _.contains(MATCHING_REL_INDEX[rel], MODEL_INDEX[mstr]) : false;
	}

	function mstrMatchesRel2(mstr, rel) {
		var matchingRels = rel === REL_HAS ? TOP_DOWN_RELS : (rel === REL_OF ? BOTTOM_UP_RELS : undefined);
		return MATCHING_REL_INDEX[rel] ? _.contains(MATCHING_REL_INDEX[rel], MODEL_INDEX[mstr]) : false;
	}

	function mstr2MatchingRels(mstr) {
		return MATCHING_REL_INDEX[MODEL_INDEX[mstr]] || MODEL_INDEX[mstr] ? _.map(MATCHING_REL_INDEX[MODEL_INDEX[mstr]] || [ MODEL_INDEX[mstr] ], function(mrel) { 
			return REL_ATTRS[mrel] ? REL_ATTRS[mrel].model : undefined;
		}) : undefined;
	}

	var REL_2ND_PASS_MARKUP = {};

    _.each(_.keys(REL_ATTRS), function(key) {
		var s1 = REL_ATTRS[key].bstring;
		var s2 = mu(REL_ATTRS[key].bstring);
		var replaced = false;
		if (s1.indexOf('is') === 0 && s1.length > 2) {
			 s1 = SIGN_MU_BEGIN + 'is' + SIGN_MU_END + s1.substring(2);
			 replaced = true;
		}
		if (s1.indexOf('has') === 0 && s1.length > 2) {
			 s1 = SIGN_MU_BEGIN + 'has' + SIGN_MU_END + s1.substring(3);
			 replaced = true;
		}
		if (replaced && s1.indexOf('of') === s1.length - 2)
			s1 = s1.substring(0, s1.length - 2) + SIGN_MU_BEGIN + 'of' + SIGN_MU_END;
		if (replaced)
			REL_2ND_PASS_MARKUP[s1] = s2;
	});

	// used for markup
	var qwords = [ 'what', 'who', 'where', 'when', 'how', 'why', 'which', 'can' ];
	var qmods = [ REL_THING, REL_PERSON, REL_SPACE, REL_TIME, REL_MANNER, REL_CAUSE, REL_WHICH, REL_ABLE ];
	var qwords2 = [ 'what do', 'how long' ]; // 2nd qwords
    var qmods2 = [ { rel: REL_ACTION }, { rel: REL_TIME, mod: 'period' } ];

    var LANG_MODS = {};

    LANG_MODS[REL_THING  ] = mu('n'); // noun
    LANG_MODS[REL_DOES   ] = mu('v'); // verb
    LANG_MODS[REL_IS_DONE] = mu('vp'); // passive verb
    LANG_MODS[REL_SPACE  ] = mu('s'); // space
    LANG_MODS[REL_TIME   ] = mu('t'); // time

    // re
    var simpleMeaningRe = /(\[.*?\])/;
	var refRe = /(\/?#\S*)\s*/;
	//var refRe = /(\/?#[\d\w]+\/?)|("[\d\w\s]*")/;
    var simpleWordRe =/\s/;

/*********************
 * General
 *********************/

	function kv(k, v) {
		var result = {};
		result[k] = v;
		return result;
	}

	function keyv(kv) {
		return _.first(_.keys(kv));
	}

	function kvalue(kv) {
		return _.first(_.values(kv));
	}

	function isRef(v) {
		return v && v.charAt(0) === SIGN_REF && v.charAt(v.length - 1) !== SIGN_CLOSE;
	}

	function isQuote(v) {
		return v && (
			(v.charAt(0) === SIGN_QUOTE && v.charAt(v.length - 1) === SIGN_QUOTE) ||
			(v.charAt(0) === SIGN_SQUOTE && v.charAt(v.length - 1) === SIGN_SQUOTE));
	}

	function isOpeningRef(v) {
		return v && v.length > 1 && v.charAt(v.length - 1) === SIGN_CLOSE;
	}

	function isClosingRef(v) {
		return v && v.length > 1 && v.charAt(0) === SIGN_CLOSE && v.charAt(1) === SIGN_REF;
	}

	function isClosingSign(v) {
		return v && v.length === 1 && v.charAt(0) === SIGN_CLOSE;
	}

	function getRef(v) {
		return isRef(v) ? v.substring(1) : (isClosingRef ? v.substring(2) : undefined);
	}

	function getQuotedString(v) {
		return isQuote(v) ? v.substring(1, v.length - 1) : v;
	}

	function wrapRef(v, ref) {
		return SIGN_MU_BEGIN + SIGN_REF + ref + SIGN_CLOSE + SIGN_MU_END + v + SIGN_MU_BEGIN + SIGN_CLOSE + SIGN_REF + ref + SIGN_MU_END;
	}

	function mu(v) {
		return SIGN_MU_BEGIN + v + SIGN_MU_END;
	}

	function unmu(v) {
		if (v && v.length > 1 && v.charAt(0) === SIGN_MU_BEGIN && v.charAt(v.length - 1) === SIGN_MU_END)
			return v.substring(1, v.length - 1);
		else
			return v;
	}

	function isMarkup(v) {
		return v && v.charAt(0) === SIGN_MU_BEGIN && v.charAt(v.length - 1) === SIGN_MU_END;
	}

	function isClosingMarkup(v) {
		return v && v.length > 1 && v.charAt(0) === SIGN_MU_BEGIN && v.charAt(1) === SIGN_CLOSE && v.charAt(v.length - 1) === SIGN_MU_END;
	}

	function hasRelKey(obj, rel) {
		return _.reduce(_.keys(obj), function(result, k) {
			return result || k.indexOf(rel) !== -1;
		}, false);
	}

	function getRelKValue(obj, rel) {
		return _.reduce(_.keys(obj), function(result, k) {
			if (k.indexOf(rel) !== -1)
				return obj[k];
			else
				return result;
		}, undefined);
	}

	function isAtRel(rel) {
		return rel && rel.length > 1 && rel.charAt(1) === SIGN_AT;
	}

	function isAtStr(rel) {
		return rel && rel.length > 0 && rel.charAt(0) === SIGN_AT;
	}

	function getAtRel(rel) {
		if (isAtRel(rel))
			return REL_STRING_INDEX[mu(unmu(rel).split(' ')[0])].rel;
	}

	function getAtStr(rel) {
		if (isAtStr(rel))
			return REL_STRING_INDEX[mu(rel.split(' ')[0])].rel;
	}

	function isExt(rel) {
		return getAtRel(rel) >= REL_EXT;
	}

	function isExtStr(rel) {
		return getAtStr(rel) >= REL_EXT;
	}

	function getExt(rel) {
		if (isAtRel(rel))
			return unmu(rel).split(' ');
	}

	function isUnknown(rel) {
		return rel && rel.length > 1 && rel.charAt(1) === SIGN_UNKNOWN;
	}

	function isUnknownStr(rel) {
		return rel && rel.length > 0 && rel.charAt(0) === SIGN_UNKNOWN;
	}

	function isQuantUnknown(rel) {
		if (rel && rel.length > 1) {
			var arr = _arr(rel);
			return arr.length > 1 && arr[1].length > 0 && arr[1].charAt(0) === SIGN_QUANT;
		}
	}

	function isQuant(rel) {
		return rel && rel.length > 1 && rel.charAt(1) === SIGN_QUANT;
	}

	function isERef(rel) {
		return rel && rel.length > 2 && rel.charAt(0) === SIGN_MU_BEGIN && rel.charAt(1) === SIGN_EREF && rel.charAt(rel.length - 1) === SIGN_MU_END;
	}

	function isERefBy(rel) {
		return rel && rel.length > 2 && rel.charAt(0) === SIGN_MU_BEGIN && rel.charAt(rel.length - 2) === SIGN_EREF && rel.charAt(rel.length - 1) === SIGN_MU_END;
	}

	function isERefStr(rel) {
		return rel && rel.length > 1 && rel.charAt(0) === SIGN_EREF;
	}

	function isERefByStr(rel) {
		return rel && rel.length > 1 && rel.charAt(rel.length - 1) === SIGN_EREF;
	}

	function isComplex(s) {
		return s && s.indexOf(SIGN_COMPLEX) !== -1;
	}

	function _arr(key2) {
		return key2 ? key2.substring(1, key2.length -1).split(' ') : [];
	};

	function _mod(key2) {
		var qarr = _arr(key2);
		return qarr.length > 1 ? qarr[1] : REL_ATTRS[REL_THING].bstring;
	}

	function _ismod(mod, rel) {
		return _mod(mod) === REL_ATTRS[rel].bstring;
	}

	function _is(mod, rel) {
		return mod === REL_ATTRS[rel].bstring;
	}

	function pushUnique(arr, el) {
		if (_.isArray(arr) && !_.contains(arr, el))
			arr.push(el);
	}

	function concatUnique(arr1, arr2) {
		_.each(arr2, function(el) {
			if (!_.contains(arr1, el))
				arr1.push(el);
		});
	   	return arr1;
	}

	function isCauseEffectMod(rkey) {
		return _ismod(rkey, REL_CAUSE) || _ismod(rkey, REL_EFFECT);
	}                                                                                                                                           

	function isCauseEffectAbleMod(rkey) {
		return _ismod(rkey, REL_CAUSE) || _ismod(rkey, REL_EFFECT) || _ismod(rkey, REL_ABLE);
	}                                                                                                                                           

	function findRelRefs(rels, rel) {
		// filter relations by "rel", then reduce [ {has:1}, {has:2} ] to { {1:null}, {2:null} } and extract only keys
		return _.keys(_.reduce(_.filter(rels, function(kv) {  return _.has(kv, rel); }), function(result, el) { result[kvalue(el)] = null; 	return result; 	}, {}));
	}

	function findRelations(rels, relsToFind) {
		return _.reduce(relsToFind, function(result, rel) {
			if (result.length === 0) {
				var v = findRelRefs(rels, REL_ATTRS[rel].string);
				console.log('->', v);
				if (v.length > 0)
					return [rel, v];
			}
			return result;
		}, []);
	}

/*********************
 * Text cache part
 * 
 * Cache for long strings
 *********************/

var textCache = (function() {

	var self = {};

	var textCache = {}; // required to not keep long strings in model for long

	function ckey(s, n) {
		return s.substring(0, 32) + '~' + n;
	}

	self.cache = function(s) {
		if (s && s.length > 32) {
			var n = 1;
			var key;
			while (true) {
				key = ckey(s, n);
				if (textCache[key] === s)
					break;
				else if (textCache[key])
					n++;
				else {
					textCache[key] = s;
					break;
				}
			}
			return key;
		} else
			return s;
	};

	self.fill = function(model) {
		_.each(_.keys(model), function(k) {
			if (_.isString(model[k]) && textCache[model[k]])
				model[k] = textCache[model[k]];
			self.fill(model[k]);
		});
	};

	self.reset = function() {
		textCache = {};
	};

	return self;

})();

/*********************
 * Index part
 *
 * Array of arrays of [src, rel, dest, parents]
 *   where parents are indexes of rows in the index. 
 *********************/

function Index() {

	var self = {};

	var index = [];

	function buildIndex(repo2, index2) {
		var result = [];
		_.each(_.keys(repo2), function(k1) { // somebody
			_.each(_.keys(repo2[k1]), function(k2) { // $does
				if (!_.isString(repo2[k1][k2])) {
					_.each(repo2[k1][k2], function(el) { // something
						var isString = _.isString(el);
						var k3 = isString ? el : keyv(el);
						//var idx = findIndexInIndex(k1, k2, k3, index2);
						//if (idx === -1)
							result.push([k1, k2, k3, []]);
						if (!isString) {
							var result2 = buildIndex(el, index2);
							_.each(result2, function(r2) {
								r2[3].push(result.length - 1);
							});
							result = result.concat(result2);
						}
					});
				} else
					result.push([k1, k2, repo2[k1][k2], []]);
					//console.log(k1, k2, '->', repo2[k1][k2]);
			});
		});
		return result;
	}

	function mergeIndexes(index1, index2) {
		_.each(index2, function(row) {
			var idx1 = findRow(row, index1);
			var refs1 = idx1 === -1 ? undefined : index1[idx1][3];
			if (idx1 === -1) {
				index1.push(row);
				idx1 = index1.length - 1;
			}
			if (refs1 && refs1.length > 0) {
				var refs2 = row[3].slice(0);
				// not map because we need to add indexes to already existing rows
				_.each(refs2, function(ref) { 
					pushUnique(refs1, findRow(index2[ref], index1));
				});
			}
		});
	}

	self.add = function(repo2) {
		//index2.splice.apply(index2, [index2.length, 0].concat(buildIndex(repo2, index)));
		mergeIndexes(index, buildIndex(repo2, index));
	}

	self.addRow = function(k1, k2, k3) {
		//console.log('addrow\t', k1, '\t\t', k2, '\t\t', k3);
		index.push([k1 || null, k2 || null, k3 || null]);
	}

	self.get = function(idx) {
		return index[idx];
	}

	function cmp(rel1, rel2) {
		return _.isArray(rel2) ? _.contains(rel2, rel1) : rel1 === rel2;
	}

	self.filter = function(k0, k1, k2) {
		return _.filter(index, function(el) {
			return (k0 ? cmp(el[0], k0) : true) && (k1 ? cmp(el[1], k1) : (k1 === null ? el[1] === null : true)) && (k2 ? cmp(el[2], k2) : true);
		});
	};

	function findIndex(k0, k1, k2, index2) {
		if (!index2)
			index2 = index;
		return _.findIndex(index2, function(el) {
			return (k0 ? el[0] === k0 : true) && (k1 ? el[1] === k1 : true) && (k2 ? el[2] === k2 : true);
		});
	}

	function findRow(row, index2) {
		return findIndex(row[0], row[1], row[2], index2);
	}

	self.has = function(k) {
		return _.findIndex(index, function(el) {
			return k ? (el[0] === k || el[2] === k) : false;
		}) !== -1;
	};

	self.reset = function() {
		index = [];
	};

	return self;

}

var index = new Index();

/*********************
 * Build/parse part
 *********************/

var repo = {};
var currComplexIdx = 0;

function build(str, opts) {

	opts = opts || {};
	opts.log = opts.log || (glob ? glob.log : {}) || {};
	var repo2 = opts.repo ? opts.repo : repo;
	var reg = {}; // registry
	var index2 = opts.index ? opts.index: index; //new Index();
	var currStr, currIdx = 0;
	var refStack = [];
	debug(opts.log.build, 'build:', str);
	if (_.isArray(str))
		_.each(str, function(s) {
			buildOne(s);
		});
	else
		buildOne(str);
	debug(opts.log.build, 'build ->', JSON.stringify(repo2, null, '\t'));
	return repo2;

	function buildOne(s, doNotLog) {
		reg = {};
		currStr = undefined;
		currIdx = 0;
		parseExpression(s.split(simpleMeaningRe));
		postParse();
		mergeInto(repo2, reg);
	}

	function parseExpression(arr) {
		_.each(arr, function(el) {
			var v = el.trim();
			if (v.length > 0) {
				if (isMarkup(v))               
					parseRels(v)
				else
					parseString(v);
				//debug(opts.log.parse, 'parse --->', JSON.stringify(reg), 'refStack:', refStack, '\n\n');
			}
		});
		if (refStack.length > 0) {
			console.warn('reference stack is not empty:', refStack, 'for', JSON.stringify(arr), '\n', JSON.stringify(reg));
		}
	}

	function parseRels(v) {
		//var arr = unmu(v).split(refRe);
		var arr = _.filter(_.map(unmu(v).split(refRe), function(s) { return s ? s.trim() : s; }), function(el) { return el && el.length > 0; });
		debug(opts.log.parse, '\tparseRels: ', v, 'currStr:', currStr, 'refStack:', refStack);
		var idx = 0;
		var varr = [];
		_.each(arr, function(el) {
			//el = el.trim();
			if (el.length > 0) {
				v = parseRel(el, idx++, arr.length);
				if (v)
					varr.push.apply(varr, v);
			}
		});
		if (varr.length > 0) {
			if (!reg[tmpref(currIdx)]) { // if does not exist then a string starts with a relation
				currIdx--;
				parseString('');
			}
			_.each(breakRels(varr), function(v) {
				reg[tmpref(currIdx)].relstr.push(v);
			});
		}
	}

	function parseRel(v, idx, len) {
		var ref = tmpref(currIdx);
		debug(opts.log.parse, '\t\tparseRel:   ', v, 'currStr:', currStr, 'ref:', ref);
		if (idx === 0) {
			var isReff = isRef(v), isORef = isOpeningRef(v), isCRef = isClosingRef(v), isCSign = isClosingSign(v);
			if (isReff || isORef || isCRef || isCSign) {
				if (isCRef) // closing /#1
					v = v.substring(1);
				else if (isORef) // opening ref
					v = v.substring(0, v.length - 1);
				if (isReff) {
					if (reg[ref])
						reg[ref].$ref = v;
				} else if (isCRef) {
					var diff = 0;
					var prevRef = refStack.pop();
					if (prevRef) {
						diff = currIdx - prevRef[1];
						if (prevRef[0] !== SIGN_CLOSE && prevRef[0] !== v)
							console.warn('opening', v, 'does not match closing', prevRef[0]);
					}
					if (reg[ref] && diff < 2)
						reg[ref].$ref = v;
					if (diff > 1) {
						var target = parseString();
						var refs = _.map(_.range(currIdx - diff, currIdx), function(n) { return tmpref(n) });
						target.string = tmpcmplxref(++currComplexIdx); // refs.join(SIGN_COMPLEX);
						target.$ref = v;
						//target.^relstr = [ [ REL_ATTRS[REL_INCLUDE].model ].concat(refs) ];
						target.$include = refs;
					}
				} else if (isORef || isCSign)
					refStack.push([v, currIdx]);
				return;
			}
		}
		var varr = [v];
		if (isERefStr(v)) {
			varr = [ REL_ATTRS[REL_ABSTRACTS].model ].concat(_.map(v.split(' '), function(r) { return r.substring(1); }));
		} else if (isERefByStr(v)) {
			varr = [ REL_ATTRS[REL_SPECIFIES].model ].concat(_.map(v.split(' '), function(r) { return r.substring(0, r.length - 1); }));
		} else if (isQuote(v)) {
			varr = [getQuotedString(v)];
		} else if (!isRef(v)) {
			var rel = findRelByBstr(v);
			if (rel !== null) { // h
				var mod = v.length > rel.bstring.length ? v.substring(rel.bstring.length).trim() : undefined;
				var rels = rel.model
				if (mod) { // mod is defined if [has prop prop1] or [@math units of]
					if (isUnknown(rel.string) || isAtRel(rel.string))
						varr = [rels, mod];
					else {
						reg[tmpref(currIdx)].relstr.push([ rels ]);
						mod = getQuotedString(mod);
						if (idx < len - 1) { // if not the last: [has "prop" #1 #2]
							//console.log('@mod', rel.string, '->', mod, idx, len);
							varr = [ rels, mod ];
						} else {
							parseString(mod);
							varr = [];
						}
					}
			   	} else
			   		varr = [rels];
			} else // if unknown relation
				varr = [];
		}
		return varr;
	}

	function parseString(v) {
		debug(opts.log.parse, '\tparseString:', v, tmpref(currIdx + 1));
		currStr = v;
		currIdx++;
		var result = { idx: currIdx, string: textCache.cache(v), relstr: [] };
		reg[tmpref(currIdx)] = result;
		return result;
	}

	//function preParse() {}

	function postParse() {
		var unknown = getUnknown(reg);
		debug(opts.log.parse, 'post parse', JSON.stringify(reg, null, '\t'));
		var complexes = isolateComplexes();
		debug(opts.log.parse, 'after isolating complexes', JSON.stringify(complexes, null, '\t'));
		_.each(complexes, convertRelations);
		debug(opts.log.parse, 'after converting relations', JSON.stringify(complexes, null, '\t'));
		_.each(complexes, cleanup);
		_.each(complexes, buildLists);
		debug(opts.log.parse, 'after cleanup', JSON.stringify(complexes, null, '\t'));
		_.each(complexes, buildSymmetry);
		debug(opts.log.parse, 'after adding duplicate relations', JSON.stringify(complexes, null, '\t'));
		_.each(complexes, buildTopDownHierarchy);
		debug(opts.log.parse, 'after building top down hierarchy', JSON.stringify(complexes, null, '\t'));
		_.each(complexes, buildBottomUpHierarchy);
		debug(opts.log.parse, 'after building bottom up hierarchy', JSON.stringify(complexes, null, '\t'));
		_.each(complexes, function(reg2) { adjustUnknown(reg2, unknown); });
		mergeComplexes(complexes);
	}

	function isolateComplexes() {
		var result = [];
		_.each(_.keys(reg), function(k) {
			if (isComplex(reg[k].string)) {
				var includes = reg[k][REL_ATTRS[REL_INCLUDE].model];
				var complex = {};
				var first = -1;
				_.each(includes, function(inc) {
					if (reg[inc]) {
						complex[inc] = reg[inc];
						reg[inc].used = true;
					}
					if (first === -1 || reg[inc].idx < first)
						first = reg[inc].idx;
					//else // check if included?
				});
				if (first !== -1) {
					reg[k].last = reg[k].idx;
					reg[k].idx = first;
				}
				result.push(complex);
			}
		});
		var reg2 = {};
		_.each(_.keys(reg), function(k) {
			if (reg[k].used)
				delete reg[k].used;
			else
				reg2[k] = _.clone(reg[k]);
		});
		return [ reg2 ].concat(result);
	}

	function convertRelations(reg2) {
		_.each(_.keys(reg2), function(k) {
			var rels = {}; // convert relstr -> model rel
			_.each(reg2[k].relstr, function(varr) {
				if (varr && varr.length > 0) {
					var v = '', ref, ext;
					if (isUnknownStr(varr[0])) {
						if (varr.length === 1)
							varr.push(REL_ATTRS[REL_THING].model);
						reg2[k].string = mu(varr.join(' '));
						if (_.keys(reg2).length > 1 && reg2[k].relstr.length === 1) {
							if (varr[1] === REL_ATTRS[REL_THING].model)
								varr = [ REL_ATTRS[REL_IS].model ];
						}
						// if there are only 2 keys and they are not linked
						// then they will be cleaned up later, so, we need to link them before cleanup
						if (_.keys(reg2).length === 2 && reg2[k].relstr.length === 1) {
							if (varr[1] === REL_ATTRS[REL_CAUSE].model)
								varr = [ REL_ATTRS[REL_CAUSES].model ];
							else if (varr[1] === REL_ATTRS[REL_EFFECT].model)
								varr = [ REL_ATTRS[REL_CAUSED_BY].model ];
						}
					} else if (isExtStr(varr[0])) {
						ext = varr[0];
						varr.splice(0, 1); // removing extension name like @math
					}
					if (isAtStr(varr[0]) && !isExt(varr[0])) {
						// if @time period --> '@time': 'period'
						// if @time after #1 --> '@time after': #1
						var notrefs = _.filter(varr, function(val) { return !isRef(val); });
						var refs = _.filter(varr, function(val) { return isRef(val); });
						if (refs.length === 0) {
							if (varr[0] === REL_ATTRS[REL_ABLE].model) {
								ref = _.find(_.keys(reg2), function(k2) { return reg2[k].idx + 1 === reg2[k2].idx || reg2[k].last + 1 === reg2[k2].idx; });
								if (ref)
									v = [ reg2[ref].string ];
							} else
								v = varr.length > 1 ? varr.slice(1).join(' ') : '';
						} else {
							varr[0] = notrefs.join(' ');
							v = _.map(refs, function(r) {
								var f = findRef(reg, r);
								return f ? f.string : r; 
							});
						}
					} else if (varr.length > 1) { // [relation #1 #2]
				    	ref = v;
						v = _.reduce(varr.slice(1), function(varr, v) {
							if (isRef(v)) { // convert references to corresponding strings
								var f = reg[v] || findRef(reg, v);
								if (f)
									return varr.concat(f.string);
							} else // or put unchangeable
								return varr.concat(v);
						}, []);
					} else { // [relation]
						ref = _.find(_.keys(reg2), function(k2) { return reg2[k].idx + 1 === reg2[k2].idx || reg2[k].last + 1 === reg2[k2].idx; });
						if (ref) {
							v = [ reg2[ref].string ];
						}
					}
					if (ext) {
						var extrel = [ ext, math.buildRel(varr[0]) ].join(' ');
						if (ext === REL_ATTRS[REL_MATH].model)
							v = math.buildVal(varr[0], v);
						varr = [ extrel ];
					}
					if (!isUnknownStr(varr[0])) {
						if (reg2[k].string && reg2[k].string.length === 0) // then the relation was the first before any other string
							reg2[ref].rel = kv(mstr2RevRelMstr(varr[0]), '');
						else {
							if (v && isUnknownStr(v[0])) {
								var unknwn = getUnknown();
								if (unknwn)
									v = [ mu(unknwn.join(' ')) ];
							}
							rels[varr[0]] = v;
						}
					}
				}
			});
			if (_.keys(rels).length > 0)
				reg2[k].rel = rels;
		});
	}

	function findRef(reg2, v) {
		return _.find(reg2, function(regv) { return regv.$ref === v || regv.ref0 === v; })
	}

	function cleanup(reg2) {
		_.each(_.keys(reg2), function(k) { // replace all ## and # with strings
			var idToAdd = reg2[k].string;
			var refToAdd;
			//index2.addRow(reg[k].string);
			_.each(_.keys(reg2[k].rel), function(rk) {
				if (_.isString(reg2[k].rel[rk]))
					index2.addRow(reg2[k].string, rk, reg2[k].rel[rk]);
				else
					_.each(reg2[k].rel[rk], function(rv) {
						index2.addRow(reg2[k].string, rk, rv);
					});
			});
			delete reg2[k].relstr;
			delete reg2[k].idx;
			if (reg2[k].string && reg2[k].string.length === 0)
				delete reg2[k];
			else { // if ref is present replace ##n with #m
				//	var ref = reg[k].ref || reg[k].ref0;
				//delete reg[k].$ref;
				delete reg2[k].ref0;
				var ref = reg2[k].string; 
				if (_.keys(reg2[k].rel).length > 0 || reg2[k][REL_ATTRS[REL_INCLUDE].model]) {
					reg2[ref] = extendProps(reg2[k].rel, reg2[ref]);//_.clone(reg[k]);
					if (!reg2[ref])
						reg2[ref] = {}; // if only $include
					//reg[ref].$ref = k;
					//reg[ref].$include = reg[k].$include;
					refToAdd = reg2[ref];
				}
				delete reg2[k].string;
				delete reg2[k];
			}
			//console.log('@@@@@@@@@@@@@');
			index2.addRow(idToAdd, undefined, refToAdd);
		});
	}

	function extendProps(obj1, obj2) { // replacement for _.extend because it overwrites props
		var result = {};
		_.each(_.keys(obj1), function(k) { result[k] = obj1[k];	});
		_.each(_.keys(obj2), function(k) { result[k] = result[k] ? concatUnique(result[k], obj2[k]) : obj2[k]; });
		return result;
	}

	function buildLists(reg2) {
		//console.log('>>>>>>>>>>>>>>>>', JSON.stringify(reg2, null, '\t'));
		_.each(_.keys(reg2), function(src) {
			_.each(_.keys(reg2[src]), function(mrel) {
				_.each(reg2[src][mrel], function(dest) {
					buildList(reg2, src, mrel, dest);
				});
			});
		});
	}

	function buildList(reg2, src, mrel, dest) {
		if (mrel !== REL_ATTRS[REL_AND].model && reg2[dest]) {
			var andarr = reg2[dest][REL_ATTRS[REL_AND].model];
			//console.log('>>>', src, mrel, dest, JSON.stringify(reg2[dest]), '>>>', andarr);
			var mrel2 = _.reduce(_.keys(reg2[dest]), function(r, rel) { if (!r && rel != rel2Mstr(REL_AND)) r = rel; return r; }, undefined);
			if (mrel2)
				mrel = mrel2;
			if (andarr) {
				_.each(andarr, function(andel) {
					//console.log('\tpush', src, mrel, '=', andel);
					if (!reg2[src][mrel])
						reg2[src][mrel] = [];
					pushUnique(reg2[src][mrel], andel);
					buildList(reg2, src, mrel, andel);
				});
				//console.log('\tdel', dest);
				delete reg2[dest];
				/*delete reg2[dest][REL_ATTRS[REL_AND].model];
				if (_.keys(reg2[dest]).length === 0)
					delete reg2[dest];
					*/
			}
		}
	}

	function buildSymmetry(reg2) {
		var toDelete = [];
		_.each(_.keys(reg2), function(src) {
			_.each(_.keys(reg2[src]), function(mrel) {
				if (!isAtStr(mrel) && 
					!mstrMatchesRel(mrel, REL_HAS) && 
					!mstrMatchesRel(mrel, REL_OF) && 
					//mrel !== REL_ATTRS[REL_CAUSES].model &&
					//mrel !== REL_ATTRS[REL_CAUSED_BY].model &&
					mrel !== REL_ATTRS[REL_ABSTRACTS].model &&
					mrel !== REL_ATTRS[REL_SPECIFIES].model &&
					mrel !== REL_ATTRS[REL_INCLUDE].model &&
					mrel !== REL_ATTRS[REL_AND].model &&
					mrel !== REL_ATTRS[REL_OR].model) {
					var dest = reg2[src][mrel];
					var revmrel = mstr2RevRelMstr(mrel);
					if (revmrel && dest) {
						_.each(dest, function(d) {
							if (!reg2[d])
								reg2[d] = {};
							if (!reg2[d][revmrel])
								reg2[d][revmrel] = [];
							pushUnique(reg2[d][revmrel], src);
						});
					}
				}
			});
		});
		_.each(toDelete, function(del) { delete reg2[del]; });
	}

	function buildTopDownHierarchy(reg2) {
		var toDelete = [];
		_.each(_.keys(reg2), function(src) {
			_.each(_.keys(reg2[src]), function(mrel) {
				if (mstrMatchesRel(mrel, REL_HAS))
					reg2[src][mrel] = _.map(reg2[src][mrel], function(dest) {
						if (reg2[dest] && !isComplex(dest)) {
							var v = reg2[dest];
							//if (!isComplex(dest))
							toDelete.push(dest);
							return kv(dest, v);
						} else
							return dest;
					});
			});
		});
		_.each(toDelete, function(del) { delete reg2[del]; });
	}

	function buildBottomUpHierarchy(reg2) {
		var toDelete = [];
		_.each(_.keys(reg2), function(src) {
			_.each(_.keys(reg2[src]), function(mrel) {
				if (mstrMatchesRel(mrel, REL_OF)) {
					_.each(reg2[src][mrel], function(dest) {
						if (!reg2[dest])
							reg2[dest] = {};
						var revmrel = mstr2RevRelMstr(mrel);
						if (!reg2[dest][revmrel])
							reg2[dest][revmrel] = [];
						reg2[dest][revmrel].push(isComplex(src) || _.keys(reg2[src]).length === 1 ? src : kv(src, reg2[src]));
						if (!isComplex(src))
							toDelete.push(src);
					});
					delete reg2[src][mrel];
				}
			});
		});
		_.each(toDelete, function(del) { delete reg2[del]; });
	}

	function adjustUnknown(reg2, unknown) {
		if (!unknown || unknown.length === 0)
			return;

		var hasUnknown = typeof getUnknown2(reg2) !== 'undefined';
		var mod = bstr2Rel(unknown[1].split(' ')[0]);
		var unknValue = mu(unknown.join(' ')); 
		//console.log('>>>', unknown, '->', mod);
		if (mod === REL_THING) {
			//
		} else if (mod === REL_SPACE || mod === REL_TIME || mod === REL_ACTION) {
		    var f = findRel(reg2, undefined, [ REL_DOES, REL_IS_DONE], undefined);
		    if (f && f.length > 0) {
		    	if (mod === REL_ACTION) {
		    		if (_.isString(f[0]))
		    			f[0] = unknValue;
		    		else if (!f[0][unknValue]) {
		    			f[0][unknValue] = kvalue(f[0]);
		    			delete f[0][keyv(f[0])];
		    		}
		    	} else {
			    	if (_.isString(f[0])) {
			    		f.push(kv(f[0], {}));
			    		f.splice(0, 1);
		    		}
		    		kvalue(f[0])[REL_ATTRS[REL_HAS_PROP].model] = [ unknValue ];
		    	}
		    }
		} else if ((mod === REL_CAUSE || mod === REL_EFFECT || mod === REL_ABLE) && !hasUnknown) {
			var ks = _.keys(reg2);
			reg2[unknValue] = {};
			_.each(ks, function(k2) {
				var rel = mod === REL_CAUSE ? REL_CAUSES : (mod === REL_EFFECT ? REL_CAUSED_BY : undefined);
				if (rel) {
					reg2[unknValue][REL_ATTRS[rel].model] = [ kv(k2, reg2[k2]) ];
				} else
					reg2[unknValue] = kv(k2, reg2[k2]);
				delete reg2[k2];
			});
		} else if (mod === REL_MATH && math.mod(unknown[1]) === 'quantity') {
			_.each(_.keys(reg2), function(k) {
				if (!isUnknown(k))
					_.each(_.keys(reg2[k]), function(rel) {
						reg2[k][rel] = _.map(reg2[k][rel], function(dest) {
							if (isUnknownStr(dest)) {
								var k0 = mu(unknown.join(' '));
								if (reg2[k0]) {
									dest = kv(k0, reg2[k0]);
									delete reg2[k0];
								}
							}
							return dest;
						});
					});
			});
		}
	}

	function mergeComplexes(complexes) {
		if( complexes.length > 1) {
			var i = 0;
			_.each(_.keys(complexes[0]), function(k) {
				if (isComplex(k)) {
					complexes[0][k][REL_ATTRS[REL_INCLUDE].model] = complexes[i + 1];
					i++;
				}
			});
		}
		reg = complexes[0];
	}

	function findRel(repo2, src, rel, dest) {
		return _.reduce(_.keys(repo2), function(result, k) {
			return _.reduce(_.keys(repo2[k]), function(result2, r) {
				if (!_.isArray(rel))
					rel = [ rel ]; 
				if (_.reduce(rel, function(result3, r2) { return result3 || (r === REL_ATTRS[r2].model); }, false))
					return repo2[k][r];
				else
					return result2;
			}, result);
		}, undefined);
	}

	function tmpref(idx) {
		return SIGN_REF + SIGN_REF + idx;
	}

	function tmpcmplxref(idx) {
		return tmpref(idx) + SIGN_COMPLEX;
	}

	function breakRels(varr) {
		var rels = [];
		_.each(varr, function(v, i) {
			if (MODEL_INDEX[v] && !isAtStr(v))
				rels.push(i);
		});
		if (rels.length > 1) {
			return _.map(rels, function(r, i) {
				var idx2 = i === rels.length - 1 ? varr.length : rels[i + 1];
				return varr.slice(r, idx2);
			});
		}
		return [ varr ];
	}

	function mergeInto(repo2, reg2) {
		//console.log('\tinto >>>', JSON.stringify(repo2));
		//console.log('\tfrom >>>', JSON.stringify(reg2));
		//replaceNotUniqueComplexes(repo2, reg2);
		_.each(_.keys(reg2), function(k) {
			if (!repo2[k]) {
				repo2[k] = reg2[k];
			} else {
				_.each(_.keys(reg2[k]), function(mrel) {
					if (repo2[k][mrel] === reg2[k][mrel])
						return;
					if (!repo2[k][mrel])
						repo2[k][mrel] = reg2[k][mrel];
					else
						_.each(reg2[k][mrel], function(kv) {
							var toFind = _.isString(kv) ? kv : keyv(kv);
							var f = _.find(repo2[k][mrel], function(kv2) { return toFind === keyv(kv2); });
							//console.log('###', k, mrel, repo2[k][mrel], toFind, '-->', f, kv);
							if (!f) {
								var idx = _.findIndex(repo2[k][mrel], function(kv2) { return toFind === kv2; });
								if (idx === -1)
									pushUnique(repo2[k][mrel], kv);
								else
									repo2[k][mrel][idx] = kv;
							} else
								mergeInto(f, kv);
						});
				});
			}
		});
		//console.log('\t\t>>>', JSON.stringify(repo2));
	}

	/*
	function replaceNotUniqueComplexes(repo2, reg2) {
		var keys2 = _.keys(repo2);
		var toReplace = {};
		_.each(_.keys(reg2), function(k) {
			if (isComplex(k) && _.contains(keys2, k)) {
				var i = 1;
				while (_.contains(keys2, tmpcmplxref(i))) i++;
				toReplace[k] = tmpcmplxref(i);
			}
		});
		_.each(_.keys(toReplace), function(k) {
			reg2[toReplace[k]] = reg2[k];
			delete reg2[k];
			replaceKey(reg2, k, toReplace[k]);
		});
	}
	*/

	function replaceKey(reg2, k1, k2) {
		_.each(_.keys(reg2), function(rk1) {
			_.each(_.keys(reg2[rk1]), function(rk2) {
				if (_.isArray(reg2[rk1][rk2]))
					_.each(reg2[rk1][rk2], function(rk3, i) {
						if (_.isString(rk3)) {
							if (rk3 === k1)
								reg2[rk1][rk2][i] = k2;
						} else
							replaceKey(rk3, k1, k2);
					});
				else
					replaceKey(reg2[rk1][rk2], k1, k2);
				reg2[rk1][rk2]
			});
		});
	}

	function getUnknown(reg2) {
		return _.reduce(_.keys(reg2), function(result, k) {
			return _.reduce(reg2[k].relstr, function(result2, r) {
				if (r && r.length > 0 && isUnknownStr(r[0]))
					return r;
				else
					return result2;
			}, result);
		}, undefined);
	}

	function getUnknown2(repo2) {
		return _.reduce(_.keys(repo2), function(result1, src) {
			return isUnknown(src) ? src :
				_.reduce(_.keys(repo2[src]), function(result2, rel) {
					return _.reduce(repo2[src][rel], function(result3, dest) {
						if (_.isString(dest))
							return isUnknown(dest) ? dest : undefined;
						else
							return getUnknown2(dest);
					}, result2);
				}, result1);
		}, undefined);
	}

}

/*********************
 * Math part
 *********************/

var math = (function() {

	var MATH_RELS = {
		'units of': { model: '$units', type: 'ref' },

		'add': { model: '$add', type: 'op', func: function(p) { return p ? _.reduce(p, function(r, pp) { return r + pp; }, 0) : undefined; } },
		'sub': { model: '$sub', type: 'op', func: function(p) { return p && p.length > 0 ? _.reduce(p.slice(1), function(r, pp) { return r - pp; }, p[0]) : undefined; } },
		'mul': { model: '$mul', type: 'op', func: function(p) { return 0; } },
		'div': { model: '$div', type: 'op', func: function(p) { return 0; } },
		
		'equals to': { model: '$eq', type: 'cmp', func: function(v1, v2) { return v1 === v2; } }, // comparison
		'not equals to': { model: '$ne', type: 'cmp', func: function(v1, v2) { return v1 !== v2; } },
		'less than': { model: '$lt', type: 'cmp', func: function(v1, v2) { return v1 > v2; } },
		'less than or equals to': { model: '$le', type: 'cmp', func: function(v1, v2) { return v1 >= v2; } },
		'greater than': { model: '$gt', type: 'cmp', func: function(v1, v2) { return v1 < v2; } },
		'greater than or equals to': { model: '$ge', type: 'cmp', func: function(v1, v2) { return v1 <= v2; } }
	};
	var MATH_REL_INDEX = {};
	_.each(_.keys(MATH_RELS), function(k) {
		MATH_REL_INDEX[MATH_RELS[k].model] = { string: k, type: MATH_RELS[k].type, func: MATH_RELS[k].func }; 
	});

	function getMathStrByType(str, type) {
		var mod = self.mod(str);
		var f = mod.indexOf('$') === 0 ? MATH_REL_INDEX[mod] : MATH_RELS[mod];
		if (f && f.type === type)
			return mod;
	}

	function getMathRelByType(rels, type) {
		return _.reduce(_.keys(rels), function(result, k) {
			return result || getMathStrByType(k, type);
		}, undefined);
	}

	var self = {};

	self.isMath = function(rel) {
		return rel && rel.indexOf(REL_ATTRS[REL_MATH].bstring) !== -1;
	}

	self.mod = function(str) {
		var rarr = str.split(' ');
		return rarr && rarr.length > 1 && rarr[0] === REL_ATTRS[REL_MATH].model ? rarr[1] : undefined;
	}

	self.isUnitsMod = function(str) {
		return str && MATH_REL_INDEX[str].string === 'units of';
	}

	self.getKVUnits = function(kv) {
		var opts = kvalue(kv);
		var rel = opts ? keyv(opts) : undefined;
		var mod = rel ? math.mod(rel) : undefined;
		return mod && self.isUnitsMod(mod) ? kvalue(opts) : undefined;
	}

	self.buildRel = function(rel) {
		return MATH_RELS[rel].model;
	};

	self.buildVal = function(rel, v) {
		if (MATH_RELS[rel].type === 'ref')
			return _.isArray(v) && v.length === 1 ? v[0] : v;
		else if (MATH_RELS[rel].type === 'op')
			return v;
		else
			return '';
	}

	// order of operation is different as the first value is condition and the second is compared value
	self.cmp = function(v1, op, v2) {
		return MATH_REL_INDEX[op] && MATH_REL_INDEX[op].func ? MATH_REL_INDEX[op].func(v1, v2) : false;
	};

	self.adjustUnits = function(v2, units1, units2) {
		return units1 !== units2 ? self.getConversion(units1, units2) * v2 : v2;
	};

	self.getConversion = function(units1, units2) {
		if (units1 === 'MB' && units2 === 'GB')
			return 1000;
		else if (units2 === 'MB' && units1 === 'GB')
			return 1/1000;
		else
			return 1;
	};

	self.wrapWithUnits = function(v, units) {
		return kv(v, kv([ REL_ATTRS[REL_MATH].model, MATH_RELS['units of'].model ].join(' '), units));
	};

	self.getUnits = function(opts) {
		return getRelKValue(opts, [ REL_ATTRS[REL_MATH].model, MATH_RELS['units of'].model ].join(' '));
	};

	self.getCmpOp = function(opts) {
		return getMathRelByType(opts, 'cmp');
	};

	self.parseInt = function(v) {
		try {
			return parseInt(v);
		} catch(err) {}
	};

    self.compare = function(v1, opts1, v2, opts2) {
		v1 = self.parseInt(v1);
		v2 = self.parseInt(v2);
		return self.cmp(v1, self.getCmpOp(opts1), math.adjustUnits(v2, self.getUnits(opts1), self.getUnits(opts2)));
	};

	self.getOp = function(str) {
		return getMathStrByType(str, 'op');
	};

	self.execute = function(name, body) {
		var op = self.getOp(name);
		if (op && body) {
			var params = [];
			var units = [];
			_.each(body, function(prop) {
				params.push(keyv(prop));
				units.push(self.getUnits(kvalue(prop)));
			});
			//console.log('math.execute:', op, params, units);
			// validate
			if (params.length === units.length) {
				params = _.map(params, function(param) { return self.parseInt(param); });
				var unit0 = units.length > 0 ? units[0] : undefined;
				var sameUnits = _.reduce(units, function(result, u) { return result && u === unit0; }, true);
				if (sameUnits)
					return self.wrapWithUnits(MATH_RELS[op].func(params), unit0);
			}
		}
		return 0;
	}

	return self;

})();

/*********************
 * Text markup part
 *********************/

function markup(text) {

	return markupText(text);

	//console.log(REL_2ND_PASS_MARKUP);

	function findWord(words, word) {
		var idx = _.findIndex(words, function(w) { return keyv(w) === word; });
		if (idx !== -1)
			return words[idx][word];
	}

	function findWordByRel(words, rel) {
		var idx = _.findIndex(words, function(w) { return kvalue(w).rel === rel; });
		if (idx !== -1)
			return words[idx];
	}

	function linkWith(words, rel, v, toAddRel, refidx) {
		var target = findWordByRel(words, rel);
		if (target) {
			var idx1 = v.idx;
			var idx2 = kvalue(target).idx;
			//console.log('\tlinkWith', rel, v, toAddRel);
			if (idx1 === idx2 - 1 && v.changes.length === 0)
				v.changes.push(REL_ATTRS[toAddRel].string);
			else {
				var l = _.last(v.changes); // if there the previous change then try to apply to it
				if (l && isMarkup(l))
					v.changes[v.changes.length - 1] = mu(unmu(l) + ' ' + REL_ATTRS[toAddRel].bstring + ' ' + SIGN_REF + (++refidx));
				else
					v.changes.push(mu(REL_ATTRS[toAddRel].bstring + ' ' + SIGN_REF + refidx));
				kvalue(target).changes.push(wrapRef(keyv(target), refidx++));
			}
		}
	}

	function changeWord(r, changes) {
		var result = _.reduce(changes, function(result, ch) {
			if (ch.length > 1 && ch.charAt(0) === SIGN_MU_BEGIN && ch.charAt(1) !== SIGN_REF)
				return result + ' ' + ch;
			//else if (ch.length === 0)
				//return '';
		    else
				return ch;
		}, r);
		//console.log('\tCHANGE:', r, JSON.stringify(changes), '->', JSON.stringify(result));
		return result;
	}

	function markupText(text) {
		var words = [];
		var prevv = undefined;
		var textarr = text.split(simpleWordRe);
		var result = _.map(textarr, function(v, idx) {
			//console.log('\tv:', v);
			var i = _.indexOf(qwords, v.toLowerCase());
			if (i !== -1) { // question word
				var rel = qmods[i];
				v = v + mu(REL_ATTRS[REL_UNKNOWN].bstring + (rel !== REL_THING ? " " + REL_ATTRS[rel].bstring : ""));
				if (rel === REL_PERSON) // seems currently required only for "who"
					words.push(kv(v, { rel: rel, idx: idx, changes: [] }));
				prevv = v;
				return v;
			} else {
				if (prevv) { // 2nd question word?
					var v2 = textarr[idx-1].toLowerCase() + ' ' + v.toLowerCase();
					i = _.indexOf(qwords2, v2);
					if (i !== -1) {
						//console.log('!', v2, i, REL_ATTRS[qmods2[i].rel].bstring, qmods2[i].mod);
						v2 = v + mu(SIGN_UNKNOWN + ' ' + REL_ATTRS[qmods2[i].rel].bstring + (qmods2[i].mod ? ' ' + qmods2[i].mod : ''));
						// works only if we add only 'who' to words, otherwise should be reworked
						words.push(kv(prevv, { rel: -1, idx: idx-1, changes: [ textarr[idx-1] ] }));
						words.push(kv(v, { rel: qmods2[i].rel, idx: idx, changes: [ v2 ] }));
					}
				}
				var arr = v.split(simpleMeaningRe);
				i = arr && arr.length > 1 ? _.find(_.keys(LANG_MODS), function(k) { return arr[1] === LANG_MODS[k]; }) : -1;
				i = parseInt(i);
				if (i !== -1) {
					v = v.substring(0, v.length - LANG_MODS[i].length);
					words.push(kv(v, { rel : i, idx: idx, changes: [] }));
				}
				prevv = undefined;
				return matchRelString(v);
			}
		});
		//console.log('\t', JSON.stringify(result));
		// linking words
		var refidx = 1;
		_.each(words, function(rec, i) {
			var v = kvalue(rec);
			switch (v.rel) {
			case REL_THING: case REL_PERSON:
				linkWith(words, REL_DOES, v, REL_DOES, refidx);
				linkWith(words, REL_IS_DONE, v, REL_IS_DONE, refidx);
				break;
			case REL_DOES: case REL_IS_DONE: case REL_ACTION:
				linkWith(words, REL_SPACE, v, REL_HAS_PROP, refidx);
				if (v.rel === REL_ACTION) { // applied only to "what do[_ @action]"
					linkWith(words, REL_THING, v, REL_DONE_BY, refidx);
					linkWith(words, REL_PERSON, v, REL_DONE_BY, refidx);
				}
				break;
			}
			//console.log('\t', keyv(rec), kvalue(rec));
		});
		//console.log('\twords ->', JSON.stringify(words));
		// applying changes
		result = _.map(result, function(r, idx) {
			var rec = findWord(words, r);
			if (rec && idx === rec.idx && rec.changes.length > 0)
				r = changeWord(r, rec.changes);
			return r;
		}).join(' ');
		//console.log(words);
		// 2nd pass to replace partial markup, eg [is] instance [of] -> [is instance of]
		_.each(_.keys(REL_2ND_PASS_MARKUP), function(s) {
			result = result.replace(s, REL_2ND_PASS_MARKUP[s]);
		});
		return result;
	}

	function matchRelString(v) {
		var f1 = _.find(_.keys(REL_ATTRS), function(key) { return v === REL_ATTRS[key].bstring; });
		if (f1)
			return REL_ATTRS[f1].string;
		var f2 = _.filter(_.keys(REL_ATTRS), function(key) {
			return REL_ATTRS[key].bstring.indexOf(v) !== -1;
		});
		return v;
	}

}
	
/*********************
 * Querying part
 *********************/
	
function ask(request, opts) {
	return query(markup(request, opts), opts);
}

function query(request, opts) {
	opts = opts || {};
	opts.log = opts.log || (glob ? glob.log : {}) || {};
	opts.repo = {};
	opts.index = new Index();
	var qrepo = build(request, opts);
	debug(opts.log.query, 'query', request);// ->', JSON.stringify(qrepo)/*, 'opts:', JSON.stringify(opts)*/);
	var first = _.first(_.keys(qrepo));
	var isFirstUnknown = first && isUnknown(first);
	var result = queryLevel(0, isFirstUnknown && _ismod(first, REL_ABLE) ? qrepo[first] : qrepo, repo);
	textCache.fill(result);
	debug(opts.log.query, 'query ->', JSON.stringify(result), '\n');
	return result;

	function queryLevel(level, qrepo2, repo2) {
		debug(opts.log.query, tab(level) + 'queryLevel:', '\n', tab(level + 1) + 'q:', JSON.stringify(qrepo2), '\n', tab(level + 1) + 'r:', JSON.stringify(repo2));
		var result1 = _.reduce(_.keys(qrepo2), function(result1, src) {
			result1 = queryId(level, src, repo2) ? querySrc(level, qrepo2, repo2, src, undefined, result1) : result1;
			var same = getTheSame(repo2, src);
			if (same && same.length > 0)
				result1 = _.reduce(same, function(r, same) {
					return r.concat(same);
					//return concatUnique(r, same);querySrc(level, qrepo2, repo2, src, same, r));
				}, result1.slice(0, result1.length - 1));
			return result1;
		}, []);
		debug(opts.log.query, tab(level) + 'queryLevel =>', JSON.stringify(result1));
		return result1;
	}

	function getTheSame(repo2, src) {
		return _.reduce(index.filter(src, rel2Mstr(REL_IS_SAME)), function(r, same) {
			same = repo2[same[2]]; // would work for something like "A [is the same] [/] A1 [and] A2"
			if (same[rel2Mstr(REL_INCLUDE)])
				same = same[rel2Mstr(REL_INCLUDE)];
			return r.concat(
				_.reduce(_.keys(same), function(r2, sk) {
					var el = same[sk] ? same[sk][rel2Mstr(REL_AND)] : undefined;
					if (!el)
						pushUnique(r2, kv(sk, same[sk]));
					else {
						pushUnique(r2, sk);
						if (el.length > 0)
							pushUnique(r2, el[0]);
						else
							pushUnique(r2, el);
					}
					return r2;
				},
			[]));
		}, []);
	}

	function querySrc(level, qrepo2, repo2, src, src2, result1) {
		var target = qrepo2[src];
		src = src2 ? src2 : src;
		return _.reduce(_.keys(target), function(result2, rel) {
			if (isUnknown(src) && math.isMath(rel) && math.mod(rel) === '$units') {
				var q = _.find(_.keys(repo2), function(rk) { return keyv(repo2[rk]) === rel && kvalue(repo2[rk]) === target[rel]; });
				return q ? [ q ] : [];
			} else if (rel === REL_ATTRS[REL_HAS_CONDIT].model)
				return queryCondition(level, src, rel, target, repo2[src]);
			else {
				var q = queryRel(level, src, rel, target[rel], repo2);
				var qsrc;
				if (isUnknown(src) || !repo2[src]) {
					qsrc = _.uniq(_.map(q, function(qv) { return qv ? qv.src : undefined; }));
					q = _.map(q, function(qv) { return qv ? qv.dest : undefined; });
					if (_.reduce(q, function(r, qv) { return qv ? false : r; }, true))
						q = [];
				}
				if (q.length > 0 && q[0].subst) {
					src = q[0].src;
					q = _.map(q, function(qv) { return qv ? qv.dest : undefined; });
				}
				result2 = q.length > 0 ?
					_.reduce(target[rel], function(result3, dest) {
						var exprResult = queryExpression(level, q, src, rel, dest, result3);
						if (!isUnknown(src) || _ismod(first, REL_ABLE))
							return result3 && exprResult;
						else
							return exprResult;
					}, result2) : result2;
				if (isUnknown(src) && (result2 === true || (_.isArray(result2) && result2.length === 0))) /// ??? 
					result2 = qsrc;
				return result2;
			}
		}, result1);
	}

	function queryId(level, id, repo2) {
		var result = (typeof repo2[id] !== 'undefined') || isUnknown(id) || index.filter(id).length > 0;
		debug(opts.log.query, tab(level + 1) + 'queryId:', id, '->', result);
		return result;
	}

	function queryRel(level, id, rel, dests, repo2) {
		var result = isUnknown(id) || !repo2[id] ? findMRelationsInIndex(id, rel, dests, repo2) : findMRelations(repo2[id], rel);
		if (!result || result.length === 0) {
			// if nothing found then try to find the same for type like in "falcon [does] fly" where "bird [does] fly"
			result = _.reduce(index.filter(id, rel2Mstr(REL_IS_INSTANCE)), function(r, rec) {
				var f = findMRelations(repo2[rec[2]], rel);
				return r.concat(f)
			}, []);
		}
		if (_.intersection(dests, result).length === 0) {
			// if result is not equal to dest, then try to find similar meaning as for "can bird move?"
			var simil = _.reduce(result, function(r, el) {
				return repo2[el] ? r.concat(_.map(repo2[el][rel2Mstr(REL_IS_SIMILAR)], function(k) {
					return repo2[k];
				})) : r;
			}, []);
			if (simil.length > 0)
				result = _.reduce(simil, function(r, el) { return _.isString(el) ? r.concat(el) : r.concat(el[rel2Mstr(REL_INCLUDE)]); }, []);
		}
		debug(opts.log.query, tab(level + 1) + 'queryRel:', id, rel, dests, '->', JSON.stringify(result));
		return result;
	}

	function queryExpression(level, q, src, rel, dest, result3) {
		debug(opts.log.query, tab(level + 1) + 'queryExpression:', src, rel, dest);
		var result = result3;
		if (_.isString(dest))
			if (isUnknown(src) || isUnknown(dest)) { // ????
				var unknwn = unmu(dest).split(' ');
				result = unknwn[1] === REL_ATTRS[REL_EFFECT].model ? q : _.map(_.filter(q, function(qkv) { 
					return _.isObject(qkv) ? typeof kvalue(qkv)[unknwn[1]] !== 'undefined' : qkv;
				}), function(qkv) { 
					return _.isObject(qkv) ? keyv(qkv) : qkv;
				});
			} else { // if it just a string then check if it is present in the list
				if (isFirstUnknown && _ismod(first, REL_ABLE) && opts.userRepo)
					result = queryUserRepo(level + 1, q, opts.userRepo, dest);
				else
					result = _.reduce(q, function(doContain, qv) {
						if (doContain) 
							return true;
						return _.isString(qv) ? qv === dest : keyv(qv) === dest;
					}, false);
			}
		else // if not string then descends
			result = _.reduce(q, function(result4, qv) {
				//return keyv(qv) === keyv(dest) || isUnknown(keyv(dest)) ? queryLevel(level + 2, dest, qv) : result4;
				if (keyv(qv) === keyv(dest) || isUnknown(keyv(dest))) {
					var q = queryLevel(level + 2, dest, qv);
					return typeof q === 'boolean' || typeof result4 === 'boolean' ? q : (q ? result4.concat(q) : result4);
				}
				return result4;
			}, result);
		debug(opts.log.query, tab(level + 1) + 'queryExpression:', src, rel, dest, '=>', result);
		return result;
	}

	// simplified version of comparing with user repository
	function queryUserRepo(level, qrepo2, urepo, dest) {
		debug(opts.log.query, tab(level) + 'queryUserRepo:', dest, '\n', tab(level + 1), 'q:', JSON.stringify(qrepo2), '\n', tab(level + 1), 'u:', JSON.stringify(urepo));
		var result = [];
		if (urepo[dest])
			_.each(qrepo2, function(qv) {
				var urv = urepo[keyv(qv)];
				var urvIs = urv[REL_ATTRS[REL_IS].model];
				if (urvIs && _.contains(urvIs, dest)) { // check if keyv(qv) === dest
					urepo[keyv(qv)] = urepo[dest];
					result = queryLevel(level, qv, urepo);
				}
			});
		debug(opts.log.query, tab(level) + 'queryUserRepo:', dest, '=>', result);
		return result;
	}

	function queryCondition(level, src, rel, qrepo2, repo2) {
		debug(opts.log.query, tab(level + 1) + 'queryCondition:', src, rel, qrepo2, repo2);
		var result = false;
		var target = repo2[REL_ATTRS[REL_HAS_VALUE].model];
		if (qrepo2[rel] && repo2 && target) {
			_.each(qrepo2[rel], function(qv) {
				var k1 = keyv(qv);
				var v1 = kvalue(qv);
				var k2 = keyv(_.first(target));
				var v2 = kvalue(_.first(target));
				if (hasRelKey(v1, REL_ATTRS[REL_MATH].model) || hasRelKey(v2, REL_ATTRS[REL_MATH].model))
					result = queryMath(level + 1, k1, v1, k2, v2);
			});
		}
		debug(opts.log.query, tab(level + 1) + 'queryCondition:', src, rel, '=>', result);
		return result;
	}

	function queryMath(level, v1, opts1, v2, opts2) {
		var result = math.compare(v1, opts1, v2, opts2);
		debug(opts.log.query, tab(level + 1) + 'queryMath:', v1, '|', opts1, '<->', v2, '|', opts2, '=>', result);
		return result;
	}

	function findMRelations(rels, rel) {
		var mrels = mstr2MatchingRels(rel) || [ rel ];
		return _.reduce(mrels, function(result, rel) {
			if (rels[rel])
				return result.concat(rels[rel]);
			return result;
		}, []);
	}                                                       	

	function findMRelationsInIndex(id, rel, dests, repo2) {
		var isUnkn = isUnknown(id);
		var src = isUnkn ? undefined : id;
		var mrels = mstr2MatchingRels(rel) || [ rel ];
		var dest = isUnkn && dests && dests.length > 0 ? (_.isString(dests[0]) ? dests[0] : keyv(dests[0])) : undefined;
		//console.log('@@@@@@@@@@', id, rel, dest, '@@@', JSON.stringify(index.filter(src, mrels, dest)), '@@@', getTheSame(repo2, dest));
		//console.log(JSON.stringify(index.filter(), null, '\t'));
		var same = getTheSame(repo2, dest);
		if (same && same.length > 0)
			dest = [ dest ].concat(same);
		var f = index.filter(src, mrels, dest);
		//console.log(JSON.stringify(src), '@@@', JSON.stringify(mrels), '@@@', JSON.stringify(dest), '-->', f);
		if (f.length > 0)
			return _.map(f, function(r) {
				var target = repo2[r[0]] || index.filter(r[0], null);
			   	if (!repo2[r[0]] && target.length === 1)
			   		target = target[0][2];
			   	var fullPath = findFullPath(0, r[0]);
			   	if (fullPath.length === 0)
			   		fullPath = r[0];
			   	else if (fullPath.length === 1)
			   		fullPath = fullPath[0];
			   	//var causePath = findCausePath(r[0]);
				return target ? { src: fullPath, dest: _.find(target[r[1]], function(kv) { return keyv(kv) === r[2]; }) } : undefined;
			});
	   	else {
   			var rev = mstr2RevRelMstr(rel);
			if (rev !== rel) {
				var f = index.filter(undefined, rev);
				return _.map(f, function(r) {
					var target = repo2[r[2]];
					return target ? { src: r[2], dest: _.find(target[rel], function(kv) { return keyv(kv) === r[0]; }) } : undefined;
				});
			}
	   	}
	}

	function findFullPath(level, id, addTheFirstElOfInclude) {
		var hasMRels = mstr2MatchingRels(REL_ATTRS[REL_HAS].model);
		hasMRels.push(rel2Mstr(REL_DOES));
		hasMRels.push(rel2Mstr(REL_IS_DONE));
		hasMRels.push(rel2Mstr(REL_CAUSES));
		var ofTriples = uniq(_.map(index.filter(undefined, hasMRels, id), function(t) { return [ t[0], mstr2Str(t[1])]; }));
		//console.log(tab(level) + '@@@ findFullPath:', id, JSON.stringify(ofTriples));
		var result = [];
		if (isComplex(id)) {
			var arr = index.filter(id, undefined, undefined);
			if (arr && arr.length > 0) {
				var include = arr[0][2][rel2Mstr(REL_INCLUDE)];
				var p1 = findFullPath(level + 1, keyv(include));
				var p2 = unwindInclude(include).slice(1);
				if (addTheFirstElOfInclude)
					result = result.concat(keyv(include));
				result = result.concat(p1, p2);
			}
		} else if (id) {
			var theSame = false;
			_.each(index.filter(id, rel2Mstr(REL_IS_SAME), undefined), function(el) {
				theSame = true;
				result = result.concat(findFullPath(level + 1, el[2]));
			});
			if (!theSame) {
				// several triples --> alternative paths
				_.each(ofTriples, function(triple) {
					var r = findFullPath(level + 1, triple[0])
					if (r[r.length - 1] !== triple[0])
						r.push(triple[0]);
					r.push(triple[1]);
					r.push(id);
					if (ofTriples.length === 1)
						result = result.concat(r);
					else
						result.push(r);
				});
			}
		}
		_.each(index.filter(id, [rel2Mstr(REL_HAS_CONDIT)], undefined), function(cond) {
			result.push([].concat(mstr2Str(rel2Mstr(REL_HAS_CONDIT)), findFullPath(level + 1, cond[2], true)));
		});
		//console.log(tab(level) + '@@@ findFullPath:', id, '\t->', JSON.stringify(result));
		return result;
	}

	function unwindInclude(include) {
		//console.log('>>>', include);
		if (_.isString(include))
			return include;
		var v = kvalue(include);
		var v2 = kvalue(v);
		v2 = _.isArray(v2) ? v2[0] : v2;
		return [ keyv(include), mstr2Str(keyv(v))].concat(v2 ? unwindInclude(v2) : undefined);
	}

	function uniq(idRelArr) {
		return _.reduce(idRelArr, function(result, el1) {
			var idx = _.findIndex(result, function(el2) { return el1[0] === el2[0] && el1[1] === el2[1]; });
			if (idx === -1)
				result.push(el1);
			return result;
		}, []);
	}

	function findKVInKVArray(kvarr, kv) {
		return _.find(kvarr, function(el) { return keyv(el) === keyv(kv); });
	}

	function tab(n) { return Array(n + 2).join('\t'); }

}

/*********************
 * Executing part
 *********************/
	
function execute(string, opts) {
	opts = opts || {};
	opts.log = opts.log || (glob ? glob.log : {}) || {};
	opts.repo = {};
	opts.index = new Index();
	debug(opts.log.execute, 'execute', string);
	var repo2 = build(string, opts);
	repo = executeStages();
	return repo;

	function orderByTime() {
		var hasComplexes = false;
		_.each(_.keys(repo2), function(k) {
			if (isComplex(k)) {
				hasComplexes = true;
				if (!repo2[k].timeOrder)
					repo2[k].timeOrder = 0;
				var then = repo2[k][REL_ATTRS[REL_TIME].model + ' then'];
				if (then)
					repo2[then[0]].timeOrder = repo2[k].timeOrder + 1;
			}
		});
		if (!hasComplexes) {
			var result = {
				singleStage: {
					timeOrder: 0
				}
			};
			result.singleStage[REL_ATTRS[REL_INCLUDE].model] = repo2;
			repo2 = result;
		}
	}

	function executeStages() {
		var result = {};
		orderByTime();
		var ordered = _.map(_.sortBy(_.values(repo2), function(v) { return v.timeOrder; }), function(v) { return v[REL_ATTRS[REL_INCLUDE].model]; });
		debug(opts.log.execute, '\texecuteStages');
		_.each(ordered, function(stage) {
			debug(opts.log.execute, '\t\texecuteStage:', JSON.stringify(stage));
			_.each(_.keys(stage), function(k) {
				var rel = keyv(stage[k]);
				if (mstrMatchesRel2(rel, REL_HAS) || mstrMatchesRel2(rel, REL_OF))
					result[k] = _.clone(stage[k]);
				else if (rel === REL_ATTRS[REL_DOES].model || rel === REL_ATTRS[REL_IS_DONE].model) {
					executeAction(stage, k, result);
				}
			});
		});
		debug(opts.log.execute, '\texecuteStages ->', JSON.stringify(result, null, '\t'));
		index.add(result);
		return result;
	}

	function executeAction(stage, k, currResult) {
		var action = stage && stage[k] ? stage[k][REL_ATTRS[REL_DOES].model] || stage[k][REL_ATTRS[REL_IS_DONE].model] : undefined;
		if (action) {
			debug(opts.log.execute, '\t\texecuteAction:', k, JSON.stringify(action));
			_.each(action, function(a) {
				var actName = keyv(a);
				var actBody = _.clone(kvalue(a));
				if (actBody && actBody[REL_ATTRS[REL_IS_SAME].model]) {
					var actName2 = actBody[REL_ATTRS[REL_IS_SAME].model][0];
					if (!math.isMath(actName) && math.isMath(actName2)) {
						actName = actName2;
						delete actBody[REL_ATTRS[REL_IS_SAME].model];
					}
				}
				actBody = mapBody(actBody, currResult);
				if (actBody.params.length === 1) { // if 1 parameter than the first implied one is "X has N"
					actBody.owner = k;
					var filtered = _.filter(currResult[k][REL_ATTRS[REL_HAS].model], function(el) {
						var p1 = kvalue(actBody.params[0]);
						var p2 = kvalue(el); 
						return keyv(p1) === keyv(p2) && kvalue(p1) === kvalue(p2); // works at least for @math units
					});
					actBody.params = filtered.concat(actBody.params);
				}
				debug(opts.log.execute, '\t\t\texecuteMathAction:', actName, 'params:', JSON.stringify(actBody.params));
				applyAction(actBody.owner, REL_HAS, math.execute(actName, actBody.params), currResult);
			});
			debug(opts.log.execute, '\t\texecuteAction ->', JSON.stringify(currResult));
		}
	}

	function mapBody(actBody, currResult) {
		var owner;
		var result = [];
		var units = _.reduce(actBody[REL_ATTRS[REL_HAS_PROP].model], function(r, p, i) { return math.getKVUnits(p) || r; }, undefined);
		_.each(actBody[REL_ATTRS[REL_HAS_PROP].model], function(p, i) {
			var k = keyv(p);
			var opts = kvalue(p);
			// if the same as "..." then replace with has of the same units of
			var subst = opts[REL_ATTRS[REL_IS_SAME].model];
			if (subst && subst.length > 0 && currResult[subst[0]]) {
				owner = subst[0];
				subst = currResult[subst[0]][REL_ATTRS[REL_HAS].model];
				if (subst)
					subst = _.find(subst, function(kv) { return math.getKVUnits(kv) === units; });
			}
			result.push(subst ? kv(keyv(subst), kvalue(subst)) : p);
		});
		return { owner: owner, params: result };
	}

	function applyAction(src, rel, dest, currResult) {
		debug(opts.log.execute, '\t\t\tapplyAction:', src, REL_ATTRS[rel].model, dest);
		if (!currResult[src])
			currResult[src] = {};
		if (!currResult[src][REL_ATTRS[rel].model])
			currResult[src][REL_ATTRS[rel].model] = [];
		var target = currResult[src][REL_ATTRS[rel].model];
		if (target && dest) {
			var units = math.getKVUnits(dest);
			var idx = _.findIndex(target, function(t) { return math.getKVUnits(t) === units; });
			if (idx !== -1)
				target.splice(idx, 1, dest);
		   	else
		   		target.push(dest);
		}
	}

}

/*********************
 * UI part
 *********************/
	
function uiBuild(jQuery, opts) {

	var meaningfulTags = []; // list of tags which can be organized hierarchically, for example, as tables

	var $ = typeof window !== 'undefined' && window.$ ? window.$ : jQuery;
	opts = opts || { log: {} };
	opts.log = opts.log || (glob ? glob.log : {}) || {};
	//var $ = jQuery ? jQuery : $;
	var tags = [];
	$('*[meaning]').each(function () { pushUnique(tags, $(this)); });
	$('*[meaning-before]').each(function () { pushUnique(tags, $(this)); });
	$('*[meaning-after]').each(function () { pushUnique(tags, $(this)); });
	$('*[meaning-local]').each(function () { pushUnique(tags, $(this)); });
	_.each(tags, function(t) {
		addMeaningfulTag(t, false, undefined);
	});
	normalizeTags();
	buildMeaningFromTags();

	return meaningfulTags;

	function buildMeaningFromTags() {
		_.each(meaningfulTags, function(rec) {
			if (!rec.template && rec.meaning) {
				debug(opts.log.ui, 'buildFromTag:', rec.meaning);
				build(rec.meaning, opts);
			}
		});
		debug(opts.log.ui, 'repo:', JSON.stringify(repo, null, '\t'));
	}

	function addMeaningfulTag(tag, isGenerated, meaning) {
		var rec = { 
			tagName: $(tag).prop('tagName').toLowerCase(), 
			meaning: $(tag).attr('meaning'),
			tag: tag,
			children: [],
			spans: [],
			generated: isGenerated,
			linked: false
		};
		if (rec.meaning)
			debug(opts.log.ui, 'addMeaningfulTag:', rec.tagName + '\t' +
				(rec.meaning ? ' meaning: ' + rec.meaning : ''));
		else
			rec.meaning = meaning;
		$(tag).data('meaning-rec', rec);
		meaningfulTags.push(rec);
		return rec;
	}
	
	function toBool(value) {
		return value ? 'y' : 'n';
	}
	
	function normalizeTags() {
		debug(opts.log.ui, 'normalizeTags');
		// look for hierarchies of tags
		normalizeTableTags();
		normalizeOtherTags();
	}
	
	function normalizeTableTags() {
		_.each(_.filter(meaningfulTags, function(rec) { return rec.tagName === 'table'; }), function(rec) {
			rec.linked = true;
			normalizeTableParts('thead', rec, opts, function(thead) {
				normalizeTableParts('th', thead, opts);
			});
			normalizeTableParts('tbody', rec, opts, function(tbody) {
				normalizeTableParts('tr', tbody, opts, function(tr) {
					normalizeTableParts('td', tr, opts);
				});
			});
		});
	}
	
	function normalizeTableParts(tagName, prec, opts, callback) {
		_.each($(prec.tag).find(tagName), function(tt) {
			var rec = $(tt).data('meaning-rec');
			var isTemplate = tagName === 'thead' || tagName === 'tbody';
			if (!rec) { // generate
				rec = addMeaningfulTag($(tt), true, undefined, opts);
				rec.meaning = fillMeaning(tagName, rec, prec, prec.meaning, isTemplate ? undefined : $(tt).text());
			} else
				rec.meaning = fillMeaning(tagName, rec, prec, rec.meaning, isTemplate ? undefined: $(tt).text());
			rec.template = isTemplate;
			//if (!(rec.template))
				//rec.value = $(tt).text();
			// link tags
			var isMultiple = tagName === 'th' || tagName === 'tr' || tagName === 'td';
			if (!isMultiple)
				prec[tagName] = rec;
			else {
				if (!prec[tagName])
					prec[tagName] = [];
				prec[tagName].push(rec);
			}
			rec[prec.tagName] = prec;
			rec.linked = true;
			if (callback)
				callback(rec);
		});
	}
	
	function normalizeOtherTags() {
		_.each(meaningfulTags, function(rec) {
			//console.log('>>> ', rec.tagName, rec.meaning);
			_.each(meaningfulTags, function(rec2) {
				if (rec !== rec2 && _.findIndex($(rec2.tag).parents(), function(t) { return $(t).is($(rec.tag)); }) !== -1) {
					//console.log('\t>>> ', rec2.tagName, rec2.meaning);
					if (rec2.tagName === 'span' && $(rec2.tag).parent()[0] === $(rec.tag)[0]) {
						rec.spans.push(rec2);
						rec2.span = true;
					} else {
						rec.children.push(rec2);
					}
					rec2.parent = rec;
				}
			});
		});
		_.each(meaningfulTags, function(rec) {
			if (!rec.generated && !rec.linked) {
				//console.log('\t', rec.tagName, 'parent:', rec.parent ? rec.parent.tagName : '-');
				//if (!rec.meaning)
				//	rec.meaning = '';
				if (/*!rec.meaning_local &&*/ rec.parent && rec.parent.meaning)
					rec.meaning = joinMeaning(rec.parent.meaning, rec.meaning);
				var m = [];
				if (rec.meaning)
					m.push(rec.meaning);
				if (rec.spans.length > 0) {
					$(rec.tag).children().each(function() {
						var rec2 = $(this).data('meaning-rec');
						var v = $(this).text();
						var meaning = rec2.meaning ? joinMeaning(rec2.meaning, v) : v;
						m.push(meaning);
					});
				}
				rec.meaning = m.join(' ');
				//console.log('>>>', m, rec.meaning);
				if (rec.children.length === 0 && !rec.span)
					rec.meaning = fillMeaning(rec.tagName, rec, undefined, rec.meaning, $(rec.tag).text());
				//console.log('\t->', rec.meaning);
			}
		});
		_.each(meaningfulTags, function(rec) {
			if (!rec.generated && !rec.linked && (rec.children.length > 0 || rec.span)) {
				rec.meaning = undefined;
			}
		});
	}
	
	function fillMeaning(tagName, rec, prec, meaning, value) {
		if (meaning) {
			//console.log('fill', tagName, '\tmeaning:', meaning, '\tvalue:', value);
			if (tagName === 'th') {
				return joinMeaning(meaning, value);
			} else if (tagName === 'tr') {
				var ths = prec.table.thead.th;
				var idx = _.indexOf(ths, _.find(ths, function(th) { return th.meaning.indexOf(REL_ATTRS[REL_HAS_ID].string) > -1; }));
				var tds = $(rec.tag).children('td');
				if (idx !== -1 && tds && idx < tds.length) {
					var id = $(tds[idx]).text();
					var rec = $(rec.tag).data('meaning-rec');
					if (rec)
						rec.id = id;
					return id + ' ' + meaning;
				}
				return meaning;
			} if (tagName === 'td') {
				var idx = $(rec.tag).index();
				var table = prec.tbody.table;
				var ths = prec.tbody.table.thead.th;
				if (idx !== -1 && ths && idx < ths.length) {
					if (ths[idx].meaning.indexOf(REL_ATTRS[REL_HAS_ID].string) !== -1) // skip id as it is already used
						return '';
					var m1 = substMeaning(ths[idx].meaning, table.meaning, prec.id);
					var m2 = REL_ATTRS[REL_HAS_VALUE].string + ' ' + value;
					return joinMeaning(m2, m1);
				}
				return meaning;
			} else {
				return joinMeaning(meaning, value);
			}
		}
	}	

	/*
	joinMeaning('', 'val')						->
	joinMeaning('[#1]', '')						-> [#1]
	joinMeaning('[#1]', 'val')					-> [/]val[/#1]
	joinMeaning('[has value] value', 'prop')	-> prop [has value] value
	joinMeaning('obj [has property]', 'prop')	-> obj [has property] prop
	*/
	function joinMeaning(meaning, value) {
		if (meaning && value) {
			var openingBr = meaning.length > 0 && meaning.charAt(0) === SIGN_MU_BEGIN;
			var closingBr = meaning.length > 0 && meaning.charAt(meaning.length - 1) === SIGN_MU_END;
			if (openingBr) {
				if (closingBr && meaning.charAt(1) === SIGN_REF)
					return getOpeningMarkup() + value + getClosingMarkup(meaning);
				else
					return value + ' ' + meaning;
			} else
				return meaning + ' ' + value;
		} else
			return meaning;
	}

	function getOpeningMarkup() {
		return SIGN_MU_BEGIN + SIGN_CLOSE + SIGN_MU_END;
	}

	function getClosingMarkup(meaning) {
		return SIGN_MU_BEGIN + SIGN_CLOSE + meaning.substring(1);
	}
	
	function substMeaning(meaning, key, value) {
		return meaning.replace(key, value);
	}

}

/*********************
 * UI only part
 *********************/

function uiInit() {

	var highlights = [];
	var highlightColor = 'rgb(153, 204, 255)'; //'#99ccff';

	var meaningfulTags = [];
	initialize();
		
	function uiHighlight(btn) {
		if (highlights.length !== 0) {
			_.each(highlights, function(ht) {
				if ($(ht).is(':visible'))
					$(ht).hide()
				else
					$(ht).show();
			});
		} else
			$.each(meaningfulTags, function(i, rec) {
				var ht = document.createElement('div');
				$(ht)
					.attr({	
						id: 'highlighted-meaning-' + highlights.length,
						title: rec.meaning
					})
					.css({
						position: 'absolute',
						'background-color': 'white',
						padding: '2px',
						border: '3px solid lightblue',
						'border-radius': '10px',
						font: '9px arial, sans-serif'
					})
					.text(rec.meaning)
	    			.appendTo($('body'));
		    	$(ht).offset($(rec.tag).position());
		    	$(ht).css({
		    		width: $(rec.tag).width(),
		    		height: $(rec.tag).height()
		    	});
    			highlights.push(ht);
				//var oldColor = $(tag).css('background-color');
				//var newColor = oldColor === highlightColor ? $(tag).data('old-color') : highlightColor;
				//$(tag).data('old-color', oldColor);
				//$(tag).css('background-color', newColor);
			});
	}
	
	function initialize() {
		//$(document).ready(function() {
		log('Initializing meaningful.js');
	
		var cp = document.createElement('div');
		$(cp)
			.attr({	id: 'meaningful-control-panel' })
			.css({
				position: 'fixed', // fixed !important absolute ?
				bottom: '4px',
				right: '4px',
				'background-color': 'white',
				padding: '8px',
				border: '2px solid #3399ff',
				'border-radius': '10px'
			})
    		.appendTo($('body'));
    	
    	var queryInput = document.createElement('textarea');
    	$(queryInput)
    		.prop('id', 'userTextarea')
    		.css({ display: 'block', margin: '0 4px 4px 4px' })
	   		.attr('cols', 70)
	   		.attr('rows', 5)
    		.appendTo($(cp))
    		.attr('placeholder', 'User data');
	   	var queryInput = document.createElement('input');
    	$(queryInput)
    		.prop('id', 'queryInput')
    		.css({ margin: '0 4px 0 4px' })
	   		.attr('size', 50)
    		.appendTo($(cp))
    		.attr('placeholder', 'What[_] is[] planet');
    	var queryBtn = document.createElement('button');
		$(queryBtn)
			.addClass('btn btn-primary')
			.css({ margin: '0 4px 0 4px' })
			.appendTo($(cp))
			.text('Query')
			.click(function() {
				queryMeaning($('#queryInput').val());
			});

		var checkBtn = document.createElement('button');
		$(checkBtn)
			.addClass('btn btn-primary')
			.css({ margin: '0 4px 0 4px' })
			.appendTo($(cp))
			.text('Highlight')
			.click(function() {
				uiHighlight($(this));
			});

        $(window).scroll(function(){            
   	        $(cp)
       	        .stop()
           	    .animate({ 'marginTop': ($(window).scrollTop()) }, 'slow' );         
        });

   	    meaningfulTags = uiBuild();
		//});
	}

}

/*********************
 * Misc part
 *********************/

	function getRepo() {
		return repo;
	}

	function reset() {
		repo = {};
		currComplexIdx = 0;
		textCache.reset();
		index.reset();
		//meaningfulTags = [];
	}
	
	function log(msg) { /*console.log.apply(this, arguments);*/console.log(msg); }
	function warn() { console.log.apply(this, arguments); }
	function debug(opts) { if (opts === 'debug') console.log.apply(this, Array.prototype.slice.call(arguments, 1)); }

	var glob;

	function config(opts) {
		glob = opts;	
	}
	
	return exports;

})();