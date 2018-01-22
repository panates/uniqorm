/* UNIQORM
 ------------------------
 (c) 2017-present Panates
 UNIQORM may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/uniqorm/
 */

/**
 * Module dependencies.
 * @private
 */
const CHAR = require('./CHAR');

/**
 * Expose `VARCHAR`.
 */
module.exports = VARCHAR;

/**
 *
 * @param {String} alias
 * @param {Object} def
 * @constructor
 * @extends Field
 */
function VARCHAR(alias, def) {
  CHAR.apply(this, arguments);
}

VARCHAR.prototype = {
  /**
   *
   * @return {string}
   */
  get jsType() {
    return 'String';
  },
  /**
   *
   * @return {string}
   * @constructor
   */
  get SqlType() {
    return 'VARCHAR(' + (this._charLength) + ')';
  }
};

Object.setPrototypeOf(VARCHAR.prototype, CHAR.prototype);
VARCHAR.prototype.constructor = VARCHAR;