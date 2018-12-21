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
const Field = require('./Field');
const {normalizeAttributes} = require('./helpers');

/**
 *
 * @class
 * @extends Field
 */
class AssociatedField extends Field {

  /**
   * @param {string} name
   * @param {Model|string} model
   * @param {Object} [def]
   * @param {string} [def.foreignModel]
   * @param {string} [def.key]
   * @param {string} [def.foreignKey]
   * @param {boolean} [def.hasMany]
   * @param {string} [def.fieldName]
   * @param {Object} [def.attributes]
   * @param {Object|Array|Function} [def.filter]
   * @param {Object} [def.towards]
   * @constructor
   * @override
   */
  constructor(name, model, def) {
    super(name, model);
    this._def = def;
    this._key = def.key;
    this._foreignKey = def.foreignKey;
    this._attributes = normalizeAttributes(def.attributes);
    if (def.filter)
      def.filter =
          typeof def.filter === 'function' || Array.isArray(def.filter) ?
              def.filter : [def.filter];

    if (def.towards) {
      def.towards = typeof def.towards === 'object' ? def.towards : {
        foreignModel: def.towards
      };
      if (def.attributes)
        delete def.towards.fieldName;
    }
  }

  /**
   * @type {null|Object}
   */
  get attributes() {
    return this._attributes;
  }

  /**
   *
   * @return {string}
   */
  get key() {
    return this._key;
  }

  /**
   *
   * @return {Field}
   */
  get keyField() {
    return this.model.getField(this._key);
  }

  /**
   *
   * @return {string}
   */
  get foreignKey() {
    return this._foreignKey;
  }

  /**
   *
   * @return {Field}
   */
  get foreignField() {
    return this.foreignModel.getField(this._foreignKey);
  }

  /**
   *
   * @return {Model}
   */
  get foreignModel() {
    return this.orm.getModel(this._def.foreignModel);
  }

  /**
   * @type {string|null}
   */
  get fieldName() {
    return this._attributes ? null : this._def.fieldName;
  }

  /**
   * @type {boolean}
   */
  get hasMany() {
    return this._def.hasMany;
  }

  /**
   *
   * @return {Array<Object>|Function|null}
   */
  get filter() {
    return this._def.filter;
  }

  /**
   *
   * @return {AssociatedField|null}
   */
  get towards() {
    if (!this._towards && this._def.towards && !this.fieldName) {
      this._towards = new AssociatedField(this.name,
          this.foreignModel, this._def.towards);
    }
    return this._towards;
  }

  get returnsSingleValue() {
    return !!this.fieldName ||
        (this.towards && this.towards.returnsSingleValue);
  }

  /**
   *
   * @protected
   */
  prepare() {
    super.prepare();

    this._towards = null;

    if (this.towards)
      this.towards.prepare();

    if (!this._def.fieldName && !this._def.attributes && !this.towards)
      this._attributes =
          normalizeAttributes(Object.keys(this.foreignModel.fields));

    if (this._attributes)
      for (const atr of Object.getOwnPropertyNames(this._attributes)) {
        this.foreignModel.getField(this._attributes[atr] || atr);
      }

    this._key = this._def.key;
    this._foreignKey = this._def.foreignKey;
    if (!(this._key && this._foreignKey)) {
      /* Test if source model has an association with foreign model */
      for (const asc of this.model.associations) {
        if (asc.foreignModel === this.foreignModel) {
          this._key = asc.key;
          this._foreignKey = asc.foreignKey;
          break;
        }
      }
    }

    if (!(this._key && this._foreignKey)) {
      /* Test if foreign model has an association with source model */
      for (const asc of this.foreignModel.associations) {
        /* istanbul ignore else */
        if (asc.foreignModel === this.model) {
          this._key = asc.foreignKey;
          this._foreignKey = asc.key;
          break;
        }
      }
    }

    if (!(this._key && this._foreignKey)) {
      /* set key fields automatically if not discovered */
      this._key = this._key ||
          (this.foreignModel.name + '_' + this.orm.options.defaultPrimaryKey);
      this._foreignKey = this._foreignKey ||
          this.foreignModel.keyFields[0] || this.orm.options.defaultPrimaryKey;
    }

  }

}

/**
 * Expose `AssociatedField`.
 */
module.exports = AssociatedField;
