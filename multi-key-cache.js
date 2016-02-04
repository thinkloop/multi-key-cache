(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.multiKeyCache = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
if (typeof Map !== 'function' || (process && process.env && process.env.TEST_MAPORSIMILAR === 'true')) {
    module.exports = _dereq_('./similar');
}
else {
    module.exports = Map;
}
},{"./similar":2}],2:[function(_dereq_,module,exports){
function Similar() {
    this.list = [];
    this.lastItem = undefined;
    this.size = 0;

    return this;
}

Similar.prototype.get = function(key) {
    var index;

    if (this.lastItem && this.lastItem.key === key) {
        return this.lastItem.val;
    }

    index = this.indexOf(key);
    if (index >= 0) {
        this.lastItem = this.list[index];
        return this.list[index].val;
    }

    return undefined;
};

Similar.prototype.set = function(key, val) {
    var index;

    if (this.lastItem && this.lastItem.key === key) {
        this.lastItem.val = val;
        return this;
    }

    index = this.indexOf(key);
    if (index >= 0) {
        this.lastItem = this.list[index];
        this.list[index].val = val;
        return this;
    }

    this.lastItem = { key: key, val: val };
    this.list.push(this.lastItem);
    this.size++;

    return this;
};

Similar.prototype.delete = function(key) {
    var index;

    if (this.lastItem && this.lastItem.key === key) {
        this.lastItem = undefined;
    }

    index = this.indexOf(key);
    if (index >= 0) {
        this.size--;
        return this.list.splice(index, 1)[0];
    }

    return undefined;
};


// important that has() doesn't use get() in case an existing key has a falsy value, in which case has() would return false
Similar.prototype.has = function(key) {
    var index;

    if (this.lastItem && this.lastItem.key === key) {
        return true;
    }

    index = this.indexOf(key);
    if (index >= 0) {
        this.lastItem = this.list[index];
        return true;
    }

    return false;
};

Similar.prototype.forEach = function(callback, thisArg) {
    var i;
    for (i = 0; i < this.size; i++) {
        callback.call(thisArg || this, this.list[i].val, this.list[i].key, this);
    }
};

Similar.prototype.indexOf = function(key) {
    var i;
    for (i = 0; i < this.size; i++) {
        if (this.list[i].key === key) {
            return i;
        }
    }
    return -1;
};

module.exports = Similar;
},{}],3:[function(_dereq_,module,exports){
var MapOrSimilar = _dereq_('map-or-similar');

function MultiKeyCache() {
	this.cache = new MapOrSimilar();
	this._vAl_kEY_nAMe_no_cOLLision_ = '_vAl_kEY_nAMe_no_cOLLision_';
}

MultiKeyCache.prototype.set = function(keys, value) {
	var keysLen = keys.length,
		currentCache = this.cache,
		newSubCache,
		i;

	if (!keysLen) {
		return this;
	}

	for (i = 0; i < keysLen; i++) {
		if (currentCache.has(keys[i])) {
			currentCache = currentCache.get(keys[i]);
			continue;
		}
		newSubCache = new MapOrSimilar();
		currentCache.set(keys[i], newSubCache);
		currentCache = newSubCache;
	}

	currentCache.set(this._vAl_kEY_nAMe_no_cOLLision_, value);

	return this;
};

MultiKeyCache.prototype.get = function(keys) {
	var keysLen = keys.length,
		currentCache = this.cache,
		i;

	if (!keysLen) {
		return undefined;
	}

	for (i = 0; i < keysLen; i++) {
		currentCache = currentCache.get(keys[i]);
		if (!currentCache) {
			return undefined;
		}
	}

	return currentCache.get(this._vAl_kEY_nAMe_no_cOLLision_);
};

MultiKeyCache.prototype.delete = function(keys) {
	var keysLen = keys.length,
		currentCache = this.cache,
		cachePath = [currentCache],
		i;

	if (!keysLen) {
		return false;
	}

	// walk up the tree gathering the maps
	for (i = 0; i < keysLen; i++) {
		currentCache = currentCache.get(keys[i]);
		cachePath.push(currentCache);
		if (!currentCache) {
			return false;
		}
	}

	// delete the value
	currentCache.delete(this._vAl_kEY_nAMe_no_cOLLision_);

	// walk back down the tree deleting any empty maps
	for (i = keysLen - 1; i >= 0; i--) {
		currentCache = cachePath[i].get(keys[i]);
		if (currentCache.size) {
			break;
		}
		cachePath[i].delete(keys[i]);
	}

	return true;
};

MultiKeyCache.prototype.has = function(keys) {
	var keysLen = keys.length,
		currentCache = this.cache,
		i;

	if (!keysLen) {
		return false;
	}

	for (i = 0; i < keysLen; i++) {
		currentCache = currentCache.get(keys[i]);
		if (!currentCache) {
			return false;
		}
	}
	return true;
};

MultiKeyCache.prototype.values = function() {
	var self = this,
		values = [];

	function getCacheValues(currentCache) {
		currentCache.forEach(function(val, key) {
			if (key === self._vAl_kEY_nAMe_no_cOLLision_) {
				values.push(val);
			}
			else {
				getCacheValues(val);
			}
		});
	}

	getCacheValues(this.cache);

	return values;
};

MultiKeyCache.prototype.keyNodes = function() {
	var keys = [];

	function getCacheKeys(currentCache) {
		currentCache.forEach(function(val, key) {
			keys.push(key);
			if (val && val.size) {
				getCacheKeys(val);
			}
		});
	}

	getCacheKeys(this.cache);

	return keys;
};

module.exports = MultiKeyCache;
},{"map-or-similar":1}]},{},[3])(3)
});