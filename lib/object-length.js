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
