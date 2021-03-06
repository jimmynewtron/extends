// References:
// Super method: 		http://ejohn.org/blog/simple-javascript-inheritance/
// Prototype setup: 	https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/instanceof
/**
 * Adds static properties/methods to new class
 * @param {Function} newClass
 * @param {Function} superClass
 * @param {Object} statics
 */

function addStatics(newClass, superClass, statics) {
	copy(newClass, superClass);
	if (statics) {
		copy(newClass, statics);
	}
}

/**
 * Shallow copy of object properties
 * @param {Object} destination
 * @param {Object} source
 */

function copy(destination, source) {
	if (Object.keys) {
		Object.keys(source).forEach(function(name) {
			destination[name] = source[name];
		});
	} else {
		var name;
		for (name in source) {
			if (has.call(source, name)) {
				destination[name] = source[name];
			}
		}
	}

	return destination;
}

var has = {}.hasOwnProperty,
	fnTest = /xyz/.test(function() {
		xyz();
	}) ? /\b_super\b/ : /.*/,
	f = 'function';

/**
 * Returns a function used to call superclass methods:
 *  - saves old this._super value;
 *  - sets this._super as parent fn
 *  - calls the proto.name fn in the proper scope (this)
 *  - restores the old _super value
 */

function addSuperMethod(property, superclass, fn) {
	return function() {
		var tmp = '_super' in this && typeof this._super === 'function' ? this._super : null;

		// Adds a new this._super() method that references the superclass
		this._super = superclass[property];

		var ret = fn.apply(this, arguments);

		// The method only needs to be bound temporarily, so we
		// remove it when we're done executing
		if (tmp !== null) {
			this._super = tmp;
		} else {
			delete this._super;
		}

		return ret;
	};
}

var __initialize__ = true;

/**
 * @method extend
 */

function extend(SuperClass, prototype) {
	var constructor, name, member, superProto, NewClass, superProto = SuperClass.prototype,
		Surrogate = function() {},
		statics = false;

	if (has.call(prototype, 'statics')) {
		statics = prototype.statics;
		prototype.statics = null;
		delete prototype.statics;
	}

	if (has.call(prototype, 'constructor')) {
		constructor = prototype.constructor;
	} else {
		//constructor = typeof superProto.constructor === f ? superProto.constructor : function constructor() {};
		constructor = SuperClass;
	}

	// _super() on constructor
	constructor = fnTest.test(constructor) ? addSuperMethod('constructor', superProto, constructor) : constructor;

	// I'm using a special tricky variable to avoid useless class initialization on prototype setup
	function NewClass() {
		if (__initialize__) {
			return constructor.apply(this, arguments);
		}
	}

	// a reference to superclass.prototype will allow the 'instanceof' operator to work
	// with all inherited superclasses of a instance

	Surrogate.prototype = SuperClass.prototype;
	__initialize__ = false;
	NewClass.prototype = new Surrogate();
	__initialize__ = true;

	for (name in prototype) {
		// skip reserved keys
		if (name === 'self' || name === 'superclass') continue;

		member = prototype[name];

		// Check if we're overwriting an existing function:
		// if proto.name is function and superclass.name are both function
		// and proto.name has a reference to _super(), we should:
		NewClass.prototype[name] = (typeof member === f && typeof superProto[name] === f && fnTest.test(member)) ? addSuperMethod(name, superProto, member) : member;
	}

	/**
	 * Creates a clone of this instance
	 * @method
	 * @return {Object}
	 */
	NewClass.prototype.clone = function() {
		return copy(new this.self(), this);
	};

	/**
	 * Copy static properties/methods to new class
	 */
	addStatics(NewClass, SuperClass, statics);

	NewClass.extend = function(prototype) {
		return extend(this, prototype || {});
	};

	// this.superclass gives access to parent class
	NewClass.superclass = NewClass.prototype.superclass = superProto;

	// this.self is a reference to proto
	NewClass.prototype.self = NewClass;

	NewClass.prototype.constructor = NewClass;

	return NewClass;
}
