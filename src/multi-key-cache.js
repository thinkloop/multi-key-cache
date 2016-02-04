var MapOrSimilar = require('map-or-similar');

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