(function (require$$6) {
	require$$6 = 'default' in require$$6 ? require$$6['default'] : require$$6;

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var index$3 = createCommonjsModule(function (module) {
	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}
	});

	var require$$0$3 = (index$3 && typeof index$3 === 'object' && 'default' in index$3 ? index$3['default'] : index$3);

	var debug = createCommonjsModule(function (module, exports) {
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = require$$0$3;

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}
	});

	var require$$0$2 = (debug && typeof debug === 'object' && 'default' in debug ? debug['default'] : debug);

	var browser = createCommonjsModule(function (module, exports) {
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = require$$0$2;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}
	});

	var require$$0$1 = (browser && typeof browser === 'object' && 'default' in browser ? browser['default'] : browser);

	var index$2 = createCommonjsModule(function (module) {
	/**
	 * Module dependencies.
	 */

	var debug = require$$0$1;

	/**
	 * Expose `generate`.
	 */

	module.exports = generate;

	/**
	 * Generate a global queue pushing method with `name`.
	 *
	 * @param {String} name
	 * @param {Object} options
	 *   @property {Boolean} wrap
	 * @return {Function}
	 */

	function generate (name, options) {
	  var log = debug('global-queue:' + name);
	  options = options || {};

	  return function (args) {
	    args = [].slice.call(arguments);
	    window[name] || (window[name] = []);
	    log('%o', args);
	    options.wrap === false
	      ? window[name].push.apply(window[name], args)
	      : window[name].push(args);
	  };
	}
	});

	var require$$0 = (index$2 && typeof index$2 === 'object' && 'default' in index$2 ? index$2['default'] : index$2);

	var objectLength = createCommonjsModule(function (module) {
	// https://github.com/component/object/blob/master/index.js#L62

	var has = Object.prototype.hasOwnProperty;

	var keys = Object.keys || function (obj) {
	  var a = [];
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      a.push(key);
	    }
	  }
	  return a;
	};

	/**
	 * Return length of `obj`.
	 *
	 * @param {Object} obj
	 * @return {Number}
	 * @api public
	 */

	module.exports = function (obj) {
	  return keys(obj).length;
	};
	});

	var require$$1 = (objectLength && typeof objectLength === 'object' && 'default' in objectLength ? objectLength['default'] : objectLength);

	var isBoolean = createCommonjsModule(function (module) {
	// https://github.com/enricomarino/is/blob/master/index.js#L288
	var toStr = Object.prototype.toString;

	/**
	 * is.bool
	 * Test if `value` is a boolean.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a boolean, false otherwise
	 * @api public
	 */

	module.exports = function (value) {
	  return toStr.call(value) === '[object Boolean]';
	};
	});

	var require$$2 = (isBoolean && typeof isBoolean === 'object' && 'default' in isBoolean ? isBoolean['default'] : isBoolean);

	var index$5 = createCommonjsModule(function (module) {
	'use strict';

	var hop = Object.prototype.hasOwnProperty;
	var strCharAt = String.prototype.charAt;
	var toStr = Object.prototype.toString;

	/**
	 * Returns the character at a given index.
	 *
	 * @param {string} str
	 * @param {number} index
	 * @return {string|undefined}
	 */
	// TODO: Move to a library
	var charAt = function(str, index) {
	  return strCharAt.call(str, index);
	};

	/**
	 * hasOwnProperty, wrapped as a function.
	 *
	 * @name has
	 * @api private
	 * @param {*} context
	 * @param {string|number} prop
	 * @return {boolean}
	 */

	// TODO: Move to a library
	var has = function has(context, prop) {
	  return hop.call(context, prop);
	};

	/**
	 * Returns true if a value is a string, otherwise false.
	 *
	 * @name isString
	 * @api private
	 * @param {*} val
	 * @return {boolean}
	 */

	// TODO: Move to a library
	var isString = function isString(val) {
	  return toStr.call(val) === '[object String]';
	};

	/**
	 * Returns true if a value is array-like, otherwise false. Array-like means a
	 * value is not null, undefined, or a function, and has a numeric `length`
	 * property.
	 *
	 * @name isArrayLike
	 * @api private
	 * @param {*} val
	 * @return {boolean}
	 */
	// TODO: Move to a library
	var isArrayLike = function isArrayLike(val) {
	  return val != null && (typeof val !== 'function' && typeof val.length === 'number');
	};


	/**
	 * indexKeys
	 *
	 * @name indexKeys
	 * @api private
	 * @param {} target
	 * @param {Function} pred
	 * @return {Array}
	 */
	var indexKeys = function indexKeys(target, pred) {
	  pred = pred || has;

	  var results = [];

	  for (var i = 0, len = target.length; i < len; i += 1) {
	    if (pred(target, i)) {
	      results.push(String(i));
	    }
	  }

	  return results;
	};

	/**
	 * Returns an array of an object's owned keys.
	 *
	 * @name objectKeys
	 * @api private
	 * @param {*} target
	 * @param {Function} pred Predicate function used to include/exclude values from
	 * the resulting array.
	 * @return {Array}
	 */
	var objectKeys = function objectKeys(target, pred) {
	  pred = pred || has;

	  var results = [];

	  for (var key in target) {
	    if (pred(target, key)) {
	      results.push(String(key));
	    }
	  }

	  return results;
	};

	/**
	 * Creates an array composed of all keys on the input object. Ignores any non-enumerable properties.
	 * More permissive than the native `Object.keys` function (non-objects will not throw errors).
	 *
	 * @name keys
	 * @api public
	 * @category Object
	 * @param {Object} source The value to retrieve keys from.
	 * @return {Array} An array containing all the input `source`'s keys.
	 * @example
	 * keys({ likes: 'avocado', hates: 'pineapple' });
	 * //=> ['likes', 'pineapple'];
	 *
	 * // Ignores non-enumerable properties
	 * var hasHiddenKey = { name: 'Tim' };
	 * Object.defineProperty(hasHiddenKey, 'hidden', {
	 *   value: 'i am not enumerable!',
	 *   enumerable: false
	 * })
	 * keys(hasHiddenKey);
	 * //=> ['name'];
	 *
	 * // Works on arrays
	 * keys(['a', 'b', 'c']);
	 * //=> ['0', '1', '2']
	 *
	 * // Skips unpopulated indices in sparse arrays
	 * var arr = [1];
	 * arr[4] = 4;
	 * keys(arr);
	 * //=> ['0', '4']
	 */
	var keys = function keys(source) {
	  if (source == null) {
	    return [];
	  }

	  // IE6-8 compatibility (string)
	  if (isString(source)) {
	    return indexKeys(source, charAt);
	  }

	  // IE6-8 compatibility (arguments)
	  if (isArrayLike(source)) {
	    return indexKeys(source, has);
	  }

	  return objectKeys(source);
	};

	/*
	 * Exports.
	 */

	module.exports = keys;
	});

	var require$$0$4 = (index$5 && typeof index$5 === 'object' && 'default' in index$5 ? index$5['default'] : index$5);

	var index$4 = createCommonjsModule(function (module) {
	'use strict';

	/*
	 * Module dependencies.
	 */

	var keys = require$$0$4;

	var objToString = Object.prototype.toString;

	/**
	 * Tests if a value is a number.
	 *
	 * @name isNumber
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean} Returns `true` if `val` is a number, otherwise `false`.
	 */
	// TODO: Move to library
	var isNumber = function isNumber(val) {
	  var type = typeof val;
	  return type === 'number' || (type === 'object' && objToString.call(val) === '[object Number]');
	};

	/**
	 * Tests if a value is an array.
	 *
	 * @name isArray
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean} Returns `true` if the value is an array, otherwise `false`.
	 */
	// TODO: Move to library
	var isArray = typeof Array.isArray === 'function' ? Array.isArray : function isArray(val) {
	  return objToString.call(val) === '[object Array]';
	};

	/**
	 * Tests if a value is array-like. Array-like means the value is not a function and has a numeric
	 * `.length` property.
	 *
	 * @name isArrayLike
	 * @api private
	 * @param {*} val
	 * @return {boolean}
	 */
	// TODO: Move to library
	var isArrayLike = function isArrayLike(val) {
	  return val != null && (isArray(val) || (val !== 'function' && isNumber(val.length)));
	};

	/**
	 * Internal implementation of `each`. Works on arrays and array-like data structures.
	 *
	 * @name arrayEach
	 * @api private
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Array} array The array(-like) structure to iterate over.
	 * @return {undefined}
	 */
	var arrayEach = function arrayEach(iterator, array) {
	  for (var i = 0; i < array.length; i += 1) {
	    // Break iteration early if `iterator` returns `false`
	    if (iterator(array[i], i, array) === false) {
	      break;
	    }
	  }
	};

	/**
	 * Internal implementation of `each`. Works on objects.
	 *
	 * @name baseEach
	 * @api private
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Object} object The object to iterate over.
	 * @return {undefined}
	 */
	var baseEach = function baseEach(iterator, object) {
	  var ks = keys(object);

	  for (var i = 0; i < ks.length; i += 1) {
	    // Break iteration early if `iterator` returns `false`
	    if (iterator(object[ks[i]], ks[i], object) === false) {
	      break;
	    }
	  }
	};

	/**
	 * Iterate over an input collection, invoking an `iterator` function for each element in the
	 * collection and passing to it three arguments: `(value, index, collection)`. The `iterator`
	 * function can end iteration early by returning `false`.
	 *
	 * @name each
	 * @api public
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @return {undefined} Because `each` is run only for side effects, always returns `undefined`.
	 * @example
	 * var log = console.log.bind(console);
	 *
	 * each(log, ['a', 'b', 'c']);
	 * //-> 'a', 0, ['a', 'b', 'c']
	 * //-> 'b', 1, ['a', 'b', 'c']
	 * //-> 'c', 2, ['a', 'b', 'c']
	 * //=> undefined
	 *
	 * each(log, 'tim');
	 * //-> 't', 2, 'tim'
	 * //-> 'i', 1, 'tim'
	 * //-> 'm', 0, 'tim'
	 * //=> undefined
	 *
	 * // Note: Iteration order not guaranteed across environments
	 * each(log, { name: 'tim', occupation: 'enchanter' });
	 * //-> 'tim', 'name', { name: 'tim', occupation: 'enchanter' }
	 * //-> 'enchanter', 'occupation', { name: 'tim', occupation: 'enchanter' }
	 * //=> undefined
	 */
	var each = function each(iterator, collection) {
	  return (isArrayLike(collection) ? arrayEach : baseEach).call(this, iterator, collection);
	};

	/*
	 * Exports.
	 */

	module.exports = each;
	});

	var require$$3 = (index$4 && typeof index$4 === 'object' && 'default' in index$4 ? index$4['default'] : index$4);

	var index$6 = createCommonjsModule(function (module) {
	var identity = function(_){ return _; };


	/**
	 * Module exports, export
	 */

	module.exports = multiple(find);
	module.exports.find = module.exports;


	/**
	 * Export the replacement function, return the modified object
	 */

	module.exports.replace = function (obj, key, val, options) {
	  multiple(replace).call(this, obj, key, val, options);
	  return obj;
	};


	/**
	 * Export the delete function, return the modified object
	 */

	module.exports.del = function (obj, key, options) {
	  multiple(del).call(this, obj, key, null, options);
	  return obj;
	};


	/**
	 * Compose applying the function to a nested key
	 */

	function multiple (fn) {
	  return function (obj, path, val, options) {
	    normalize = options && isFunction(options.normalizer) ? options.normalizer : defaultNormalize;
	    path = normalize(path);

	    var key;
	    var finished = false;

	    while (!finished) loop();

	    function loop() {
	      for (key in obj) {
	        var normalizedKey = normalize(key);
	        if (0 === path.indexOf(normalizedKey)) {
	          var temp = path.substr(normalizedKey.length);
	          if (temp.charAt(0) === '.' || temp.length === 0) {
	            path = temp.substr(1);
	            var child = obj[key];

	            // we're at the end and there is nothing.
	            if (null == child) {
	              finished = true;
	              return;
	            }

	            // we're at the end and there is something.
	            if (!path.length) {
	              finished = true;
	              return;
	            }

	            // step into child
	            obj = child;

	            // but we're done here
	            return;
	          }
	        }
	      }

	      key = undefined;
	      // if we found no matching properties
	      // on the current object, there's no match.
	      finished = true;
	    }

	    if (!key) return;
	    if (null == obj) return obj;

	    // the `obj` and `key` is one above the leaf object and key, so
	    // start object: { a: { 'b.c': 10 } }
	    // end object: { 'b.c': 10 }
	    // end key: 'b.c'
	    // this way, you can do `obj[key]` and get `10`.
	    return fn(obj, key, val);
	  };
	}


	/**
	 * Find an object by its key
	 *
	 * find({ first_name : 'Calvin' }, 'firstName')
	 */

	function find (obj, key) {
	  if (obj.hasOwnProperty(key)) return obj[key];
	}


	/**
	 * Delete a value for a given key
	 *
	 * del({ a : 'b', x : 'y' }, 'X' }) -> { a : 'b' }
	 */

	function del (obj, key) {
	  if (obj.hasOwnProperty(key)) delete obj[key];
	  return obj;
	}


	/**
	 * Replace an objects existing value with a new one
	 *
	 * replace({ a : 'b' }, 'a', 'c') -> { a : 'c' }
	 */

	function replace (obj, key, val) {
	  if (obj.hasOwnProperty(key)) obj[key] = val;
	  return obj;
	}

	/**
	 * Normalize a `dot.separated.path`.
	 *
	 * A.HELL(!*&#(!)O_WOR   LD.bar => ahelloworldbar
	 *
	 * @param {String} path
	 * @return {String}
	 */

	function defaultNormalize(path) {
	  return path.replace(/[^a-zA-Z0-9\.]+/g, '').toLowerCase();
	}

	/**
	 * Check if a value is a function.
	 *
	 * @param {*} val
	 * @return {boolean} Returns `true` if `val` is a function, otherwise `false`.
	 */

	function isFunction(val) {
	  return typeof val === 'function';
	}
	});

	var require$$4 = (index$6 && typeof index$6 === 'object' && 'default' in index$6 ? index$6['default'] : index$6);

	var index$8 = createCommonjsModule(function (module) {
	'use strict';

	var max = Math.max;

	/**
	 * Produce a new array by passing each value in the input `collection` through a transformative
	 * `iterator` function. The `iterator` function is passed three arguments:
	 * `(value, index, collection)`.
	 *
	 * @name rest
	 * @api public
	 * @param {Array} collection The collection to iterate over.
	 * @return {Array} A new array containing all but the first element from `collection`.
	 * @example
	 * rest([1, 2, 3]); // => [2, 3]
	 */
	var rest = function rest(collection) {
	  if (collection == null || !collection.length) {
	    return [];
	  }

	  // Preallocating an array *significantly* boosts performance when dealing with
	  // `arguments` objects on v8. For a summary, see:
	  // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
	  var results = new Array(max(collection.length - 2, 0));

	  for (var i = 1; i < collection.length; i += 1) {
	    results[i - 1] = collection[i];
	  }

	  return results;
	};

	/*
	 * Exports.
	 */

	module.exports = rest;
	});

	var require$$0$5 = (index$8 && typeof index$8 === 'object' && 'default' in index$8 ? index$8['default'] : index$8);

	var index$9 = createCommonjsModule(function (module) {
	'use strict';

	var max = Math.max;

	/**
	 * Produce a new array composed of all but the first `n` elements of an input `collection`.
	 *
	 * @name drop
	 * @api public
	 * @param {number} count The number of elements to drop.
	 * @param {Array} collection The collection to iterate over.
	 * @return {Array} A new array containing all but the first element from `collection`.
	 * @example
	 * drop(0, [1, 2, 3]); // => [1, 2, 3]
	 * drop(1, [1, 2, 3]); // => [2, 3]
	 * drop(2, [1, 2, 3]); // => [3]
	 * drop(3, [1, 2, 3]); // => []
	 * drop(4, [1, 2, 3]); // => []
	 */
	var drop = function drop(count, collection) {
	  var length = collection ? collection.length : 0;

	  if (!length) {
	    return [];
	  }

	  // Preallocating an array *significantly* boosts performance when dealing with
	  // `arguments` objects on v8. For a summary, see:
	  // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
	  var toDrop = max(Number(count) || 0, 0);
	  var resultsLength = max(length - toDrop, 0);
	  var results = new Array(resultsLength);

	  for (var i = 0; i < resultsLength; i += 1) {
	    results[i] = collection[i + toDrop];
	  }

	  return results;
	};

	/*
	 * Exports.
	 */

	module.exports = drop;
	});

	var require$$1$1 = (index$9 && typeof index$9 === 'object' && 'default' in index$9 ? index$9['default'] : index$9);

	var index$7 = createCommonjsModule(function (module) {
	'use strict';

	/*
	 * Module dependencies.
	 */

	var drop = require$$1$1;
	var rest = require$$0$5;

	var has = Object.prototype.hasOwnProperty;
	var objToString = Object.prototype.toString;

	/**
	 * Returns `true` if a value is an object, otherwise `false`.
	 *
	 * @name isObject
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean}
	 */
	// TODO: Move to a library
	var isObject = function isObject(value) {
	  return Boolean(value) && typeof value === 'object';
	};

	/**
	 * Returns `true` if a value is a plain object, otherwise `false`.
	 *
	 * @name isPlainObject
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean}
	 */
	// TODO: Move to a library
	var isPlainObject = function isPlainObject(value) {
	  return Boolean(value) && objToString.call(value) === '[object Object]';
	};

	/**
	 * Assigns a key-value pair to a target object when the value assigned is owned,
	 * and where target[key] is undefined.
	 *
	 * @name shallowCombiner
	 * @api private
	 * @param {Object} target
	 * @param {Object} source
	 * @param {*} value
	 * @param {string} key
	 */
	var shallowCombiner = function shallowCombiner(target, source, value, key) {
	  if (has.call(source, key) && target[key] === undefined) {
	    target[key] = value;
	  }
	  return source;
	};

	/**
	 * Assigns a key-value pair to a target object when the value assigned is owned,
	 * and where target[key] is undefined; also merges objects recursively.
	 *
	 * @name deepCombiner
	 * @api private
	 * @param {Object} target
	 * @param {Object} source
	 * @param {*} value
	 * @param {string} key
	 * @return {Object}
	 */
	var deepCombiner = function(target, source, value, key) {
	  if (has.call(source, key)) {
	    if (isPlainObject(target[key]) && isPlainObject(value)) {
	        target[key] = defaultsDeep(target[key], value);
	    } else if (target[key] === undefined) {
	        target[key] = value;
	    }
	  }

	  return source;
	};

	/**
	 * TODO: Document
	 *
	 * @name defaultsWith
	 * @api private
	 * @param {Function} combiner
	 * @param {Object} target
	 * @param {...Object} sources
	 * @return {Object} Return the input `target`.
	 */
	var defaultsWith = function(combiner, target /*, ...sources */) {
	  if (!isObject(target)) {
	    return target;
	  }

	  combiner = combiner || shallowCombiner;
	  var sources = drop(2, arguments);

	  for (var i = 0; i < sources.length; i += 1) {
	    for (var key in sources[i]) {
	      combiner(target, sources[i], sources[i][key], key);
	    }
	  }

	  return target;
	};

	/**
	 * Copies owned, enumerable properties from a source object(s) to a target
	 * object when the value of that property on the source object is `undefined`.
	 * Recurses on objects.
	 *
	 * @name defaultsDeep
	 * @api public
	 * @param {Object} target
	 * @param {...Object} sources
	 * @return {Object} The input `target`.
	 */
	var defaultsDeep = function defaultsDeep(target /*, sources */) {
	  // TODO: Replace with `partial` call?
	  return defaultsWith.apply(null, [deepCombiner, target].concat(rest(arguments)));
	};

	/**
	 * Copies owned, enumerable properties from a source object(s) to a target
	 * object when the value of that property on the source object is `undefined`.
	 *
	 * @name defaults
	 * @api public
	 * @param {Object} target
	 * @param {...Object} sources
	 * @return {Object}
	 * @example
	 * var a = { a: 1 };
	 * var b = { a: 2, b: 2 };
	 *
	 * defaults(a, b);
	 * console.log(a); //=> { a: 1, b: 2 }
	 */
	var defaults = function(target /*, ...sources */) {
	  // TODO: Replace with `partial` call?
	  return defaultsWith.apply(null, [null, target].concat(rest(arguments)));
	};

	/*
	 * Exports.
	 */

	module.exports = defaults;
	module.exports.deep = defaultsDeep;
	});

	var require$$5 = (index$7 && typeof index$7 === 'object' && 'default' in index$7 ? index$7['default'] : index$7);

	var index = createCommonjsModule(function (module) {
	var core = require$$6;

	/**
	 * Module dependencies.
	 */

	var defaults = require$$5;
	var dot = require$$4;
	var each = require$$3;
	var isBoolean = require$$2;
	var len = require$$1;
	var push = require$$0('_gaq');
	var user;

	/**
	 * Expose plugin.
	 */

	function entry(analytics) {
	  analytics.addIntegration(GA);
	  user = analytics.user();
	};

	entry.Integration = GA;

	/**
	 * Expose `GA` integration.
	 *
	 * http://support.google.com/analytics/bin/answer.py?hl=en&answer=2558867
	 * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate
	 */

	var GA = core.createIntegration('Google Analytics')
	  .readyOnLoad()
	  .global('ga')
	  .global('gaplugins')
	  .global('_gaq')
	  .global('GoogleAnalyticsObject')
	  .option('anonymizeIp', false)
	  .option('classic', false)
	  .option('contentGroupings', {})
	  .option('dimensions', {})
	  .option('domain', 'auto')
	  .option('doubleClick', false)
	  .option('enhancedEcommerce', false)
	  .option('enhancedLinkAttribution', false)
	  .option('ignoredReferrers', null)
	  .option('includeSearch', false)
	  .option('metrics', {})
	  .option('nonInteraction', false)
	  .option('sendUserId', false)
	  .option('siteSpeedSampleRate', 1)
	  .option('sampleRate', 100)
	  .option('trackCategorizedPages', true)
	  .option('trackNamedPages', true)
	  .option('trackingId', '')
	  .tag('library', '<script src="//www.google-analytics.com/analytics.js">');

	/**
	 * On `construct` swap any config-based methods to the proper implementation.
	 */

	GA.on('construct', function(integration) {
	});

	/**
	 * Initialize.
	 *
	 * https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced
	 */

	GA.prototype.initialize = function() {
	  this.pageCalled = false;
	  var opts = this.options;

	  // setup the tracker globals
	  window.GoogleAnalyticsObject = 'ga';
	  window.ga = window.ga || function() {
	    window.ga.q = window.ga.q || [];
	    window.ga.q.push(arguments);
	  };
	  window.ga.l = new Date().getTime();

	  if (window.location.hostname === 'localhost') opts.domain = 'none';

	  window.ga('create', opts.trackingId, {
	    // Fall back on default to protect against empty string
	    cookieDomain: opts.domain || GA.prototype.defaults.domain,
	    siteSpeedSampleRate: opts.siteSpeedSampleRate,
	    sampleRate: opts.sampleRate,
	    allowLinker: true
	  });

	  // display advertising
	  if (opts.doubleClick) {
	    window.ga('require', 'displayfeatures');
	  }

	  // https://support.google.com/analytics/answer/2558867?hl=en
	  if (opts.enhancedLinkAttribution) {
	    window.ga('require', 'linkid', 'linkid.js');
	  }

	  // send global id
	  if (opts.sendUserId && user.id()) {
	    window.ga('set', 'userId', user.id());
	  }

	  // anonymize after initializing, otherwise a warning is shown
	  // in google analytics debugger
	  if (opts.anonymizeIp) window.ga('set', 'anonymizeIp', true);

	  // custom dimensions & metrics
	  var custom = metrics(user.traits(), opts);
	  if (len(custom)) window.ga('set', custom);

	  this.load('library', this.ready);
	};

	/**
	 * Loaded?
	 *
	 * @return {Boolean}
	 */

	GA.prototype.loaded = function() {
	  return !!window.gaplugins;
	};

	/**
	 * Page.
	 *
	 * https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
	 * https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications#multiple-hits
	 *
	 * @api public
	 * @param {Page} page
	 */

	GA.prototype.page = function(page) {
	  var category = page.category();
	  var props = page.properties();
	  var name = page.fullName();
	  var opts = this.options;
	  var campaign = page.proxy('context.campaign') || {};
	  var pageview = {};
	  var pagePath = path(props, this.options);
	  var pageTitle = name || props.title;
	  var pageReferrer = page.referrer() || '';
	  var track;

	  // store for later
	  // TODO: Why? Document this better
	  this._category = category;

	  pageview.page = pagePath;
	  pageview.title = pageTitle;
	  pageview.location = props.url;

	  if (campaign.name) pageview.campaignName = campaign.name;
	  if (campaign.source) pageview.campaignSource = campaign.source;
	  if (campaign.medium) pageview.campaignMedium = campaign.medium;
	  if (campaign.content) pageview.campaignContent = campaign.content;
	  if (campaign.term) pageview.campaignKeyword = campaign.term;

	  // custom dimensions, metrics and content groupings
	  var custom = metrics(props, opts);
	  if (len(custom)) window.ga('set', custom);

	  // set
	  var payload = {
	    page: pagePath,
	    title: pageTitle
	  };
	  if (pageReferrer !== document.referrer) payload.referrer = pageReferrer; // allow referrer override if referrer was manually set
	  window.ga('set', payload);

	  if (this.pageCalled) delete pageview.location;

	  // send
	  window.ga('send', 'pageview', pageview);

	  // categorized pages
	  if (category && this.options.trackCategorizedPages) {
	    track = page.track(category);
	    this.track(track, { nonInteraction: 1 });
	  }

	  // named pages
	  if (name && this.options.trackNamedPages) {
	    track = page.track(name);
	    this.track(track, { nonInteraction: 1 });
	  }

	  this.pageCalled = true;
	};

	/**
	 * Identify.
	 *
	 * @api public
	 * @param {Identify} event
	 */

	GA.prototype.identify = function(identify) {
	  var opts = this.options;

	  if (opts.sendUserId && identify.userId()) {
	    window.ga('set', 'userId', identify.userId());
	  }

	  // Set dimensions
	  var custom = metrics(user.traits(), opts);
	  if (len(custom)) window.ga('set', custom);
	};

	/**
	 * Track.
	 *
	 * https://developers.google.com/analytics/devguides/collection/analyticsjs/events
	 * https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
	 *
	 * @param {Track} event
	 */

	GA.prototype.track = function(track, options) {
	  var contextOpts = track.options(this.name);
	  var interfaceOpts = this.options;
	  var opts = defaults(options || {}, contextOpts);
	  opts = defaults(opts, interfaceOpts);
	  var props = track.properties();
	  var campaign = track.proxy('context.campaign') || {};

	  // custom dimensions & metrics
	  var custom = metrics(props, interfaceOpts);
	  if (len(custom)) window.ga('set', custom);

	  var payload = {
	    eventAction: track.event(),
	    eventCategory: track.category() || this._category || 'All',
	    eventLabel: props.label,
	    eventValue: formatValue(props.value || track.revenue()),
	    nonInteraction: !!(props.nonInteraction || opts.nonInteraction)
	  };

	  if (campaign.name) payload.campaignName = campaign.name;
	  if (campaign.source) payload.campaignSource = campaign.source;
	  if (campaign.medium) payload.campaignMedium = campaign.medium;
	  if (campaign.content) payload.campaignContent = campaign.content;
	  if (campaign.term) payload.campaignKeyword = campaign.term;

	  window.ga('send', 'event', payload);
	};

	/**
	 * Return the path based on `properties` and `options`.
	 *
	 * @param {Object} properties
	 * @param {Object} options
	 * @return {string|undefined}
	 */

	function path(properties, options) {
	  if (!properties) return;
	  var str = properties.path;
	  if (options.includeSearch && properties.search) str += properties.search;
	  return str;
	}

	/**
	 * Format the value property to Google's liking.
	 *
	 * @param {Number} value
	 * @return {Number}
	 */

	function formatValue(value) {
	  if (!value || value < 0) return 0;
	  return Math.round(value);
	}

	/**
	 * Map google's custom dimensions, metrics & content groupings with `obj`.
	 *
	 * Example:
	 *
	 *      metrics({ revenue: 1.9 }, { { metrics : { revenue: 'metric8' } });
	 *      // => { metric8: 1.9 }
	 *
	 *      metrics({ revenue: 1.9 }, {});
	 *      // => {}
	 *
	 * @param {Object} obj
	 * @param {Object} data
	 * @return {Object|null}
	 * @api private
	 */

	function metrics(obj, data) {
	  var dimensions = data.dimensions;
	  var metrics = data.metrics;
	  // var contentGroupings = data.contentGroupings;
	  var names = Object.keys(metrics).concat(Object.keys(dimensions));

	  var ret = {};

	  for (var i = 0; i < names.length; ++i) {
	    var name = names[i];
	    var key = metrics[name] || dimensions[name];
	    var value = dot(obj, name) || obj[name];
	    if (value == null) continue;
	    ret[key] = value;
	  }

	  return ret;
	}

	entry(core);
	});

	var index$1 = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

	return index$1;

}(analytics));
