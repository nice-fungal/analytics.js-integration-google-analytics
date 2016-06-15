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
