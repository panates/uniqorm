/* UNIQORM
 ------------------------
 (c) 2017-present Panates
 UNIQORM may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/uniqorm/
 */

/* External module dependencies. */


/**
 * @class
 */

class Field {

    constructor(cfg) {
        this._fieldType = Field.DataType.DATA;
        if (typeof cfg === 'object') {
            this.setFieldName(cfg.fieldName);
            //noinspection PointlessBooleanExpressionJS
            this.setPrimaryKey(!!cfg.primaryKey);
            //noinspection PointlessBooleanExpressionJS
            this.setNotNull(!!cfg.notNull);
        }
    }

    /**
     * @type {string}
     */
    get fieldName() {
        return this._fieldName;
    }

    /**
     * @type {string}
     */
    set fieldName(val) {
        this._fieldName = String(val);
    }

    /**
     * @type {boolean}
     */
    get primaryKey() {
        return this._primaryKey;
    }

    /**
     * @type {boolean}
     */
    set primaryKey(value) {
        this._primaryKey = value;
    }

    /**
     * @type {boolean}
     */
    get notNull() {
        return this._notNull;
    }

    /**
     * @type {boolean}
     */
    set notNull(value) {
        this._notNull = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @type {int}
     */
    get fieldType() {
        return this._fieldType;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @type {int}
     */
    set fieldType(value) {
        this._fieldType = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @type {*}
     */
    get defaultValue() {
        return this._defaultValue;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @type {*}
     */
    set defaultValue(value) {
        this._defaultValue = value;
    }

    /**
     * @param {*} value
     * @return {Field}
     */
    setDefaultValue(value) {
        this.defaultValue = value;
        return this;
    }

    /**
     * @param {string} name
     * @return {Field}
     */
    setFieldName(name) {
        this._fieldName = name;
        return this;
    }

    /**
     * @param {boolean=true} value
     * @return {Field}
     */
    setPrimaryKey(value = true) {
        this.primaryKey = value;
        return this;
    }

    /**
     * @param {boolean=true} value
     * @return {Field}
     */
    setNotNull(value = true) {
        this.notNull = value;
        return this;
    }
}

/** @export @enum {number} */
Field.DataType = {};

/** @export */
Field.DataType.DATA = /** @type {!Field.DataType} */ (0);

/** @export */
Field.DataType.AGGREGATE = /** @type {!Field.DataType} */ (1);

/** @export */
Field.DataType.CALCULATED = /** @type {!Field.DataType} */ (2);


/**
 * Registers a serializer class for given dialect
 *
 * @param {constructor<Field>} fieldProto
 * @static
 * @public
 */
Field.register = function (fieldProto) {
    const items = this._registry = this._registry || {};
    items[fieldProto.name.toUpperCase()] = fieldProto;
};

/**
 * Retrieves serializer class for given dialect
 *
 * @param {String} type
 * @return {constructor<Field>}
 * @static
 * @public
 */
Field.get = function (type) {
    return this._registry ? this._registry[type.toUpperCase()] : undefined;
};


/**
 * @class
 */
class NUMBER extends Field {

    constructor(precision, scale) {
        super(...arguments);
        if (typeof precision === 'object') {
            this.setPrecision(precision.precision);
            this.setScale(precision.scale);
            this.setUnsigned(precision.unsigned);
        }
    }

    /**
     * @type {int}
     */
    get precision() {
        return this._precision;
    }

    /**
     * @type {int}
     */
    set precision(val) {
        this._precision = parseInt(val);
    }

    /**
     * @type {int}
     */
    get scale() {
        return this._scale;
    }

    /**
     * @type {int}
     */
    set scale(val) {
        this._scale = parseInt(val) || 0;
    }

    /**
     * @type {boolean}
     */
    get unsigned() {
        return this._unsigned;
    }

    /**
     * @type {boolean}
     */
    set unsigned(val) {
        this._unsigned = val;
    }

    //noinspection JSCheckFunctionSignatures
    /**
     *
     * @param {Number} value
     * @return {NUMBER}
     * @override
     */
    setDefaultValue(value) {
        super.setDefaultValue(parseFloat(value));
        return this;
    }

    /**
     *
     * @param {int=18} value
     * @return {NUMBER}
     */
    setPrecision(value = 18) {
        this.precision = value;
        return this;
    }

    /**
     *
     * @param {int=0} value
     * @return {NUMBER}
     */
    setScale(value = 0) {
        this.scale = value;
        return this;
    }

    /**
     *
     * @param {boolean=true} value
     * @return {NUMBER}
     */
    setUnsigned(value = true) {
        this.unsigned = value;
        return this;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     *
     * @return {string}
     * @public
     */
    toSql() {
        return 'NUMBER' + (this._precision || this._scale ?
                '(' + (this._precision || 18) + ',' + (this._scale || 0) + ')' : '');
    }
}

Field.register(NUMBER);

/**
 * @class
 */

class INTEGER extends Field {

    constructor(cfg) {
        super(...arguments);
        if (typeof cfg === 'object') {
            this.setUnsigned(cfg.unsigned);
        }
    }

    /**
     * @type {boolean}
     */
    get unsigned() {
        return this._unsigned;
    }

    /**
     * @type {boolean}
     */
    set unsigned(val) {
        this._unsigned = val;
    }

    //noinspection JSCheckFunctionSignatures
    /**
     *
     * @param {int} value
     * @return {INTEGER}
     * @override
     */
    setDefaultValue(value) {
        super.setDefaultValue(parseInt(value));
        return this;
    }

    /**
     *
     * @param {boolean=true} value
     * @return {INTEGER}
     */
    setUnsigned(value = true) {
        this.unsigned = value;
        return this;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     *
     * @return {string}
     * @public
     */
    toSql() {
        return 'INTEGER';
    }

}

Field.register(INTEGER);


/**
 * @class
 */

class BIGINT extends INTEGER {

    constructor() {
        super(...arguments);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     *
     * @return {string}
     * @public
     */
    toSql() {
        return 'BIGINT';
    }

}

Field.register(BIGINT);


/**
 * @class
 */

class VARCHAR extends Field {

    constructor(length) {
        super(...arguments);
        if (typeof length === 'object') {
            this.setLength(length.length);
        }
    }

    /**
     * @param {*} value
     * @return {VARCHAR}
     */
    setDefaultValue(value) {
        super.setDefaultValue(String(value));
        return this;
    }

    /**
     *
     * @param {int=1} value
     * @return {VARCHAR}
     */
    setLength(value = 1) {
        this._length = parseInt(value);
        return this;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     *
     * @return {string}
     * @public
     */
    toSql() {
        return 'VARCHAR' + (this._length ? '(' + this._length + ')' : '');
    }

}

Field.register(VARCHAR);


//noinspection JSUnusedGlobalSymbols
module.exports = {

    Field,

    BIGINT: function () {
        return Reflect.construct(BIGINT, arguments);
    },

    INTEGER: function () {
        return Reflect.construct(INTEGER, arguments);
    },

    NUMBER: function (precision, scale) {
        return Reflect.construct(NUMBER, arguments);
    },

    VARCHAR: function (length) {
        return Reflect.construct(VARCHAR, arguments);
    }

};