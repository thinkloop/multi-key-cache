# Multi Key Cache
A JavaScript (JS) cache that can have multiple complex values as keys.
Keys can be objects, arrays, arrays-within-objects, objects-within-arrays, maps, sets, anything.
Highly performant.
Made for the browser and nodejs.

## Install
```javascript
npm install multi-key-cache --save
```

## Use
Supports the following methods:

```Slim
set(keys, val) : Sets a value to a set of keys. Keys can be an array of values, an arguments structure, or any object with a `length` property and numerical property names.
get(keys)      : Returns the value of a set of keys.
has(keys)      : Returns true if the set of keys have a value, otherwise false.
delete(keys)   : Deletes the value of a set of keys.

values()       : Returns array of all values.
keyNodes()     : Returns array of all individual key nodes (not sets of keys).
```

Examples:

```javascript
var MultiKeyCache = require('multi-key-cache');
var multiKeyCache = new MultiKeyCache();

multiKeyCache.set(['a', 'b', 'c'], 'my value'); // sets 'my value' to keys a b c
multiKeyCache.set(['a', 'b', 'd'], 'another value'); // sets 'another value' to keys a b d

multiKeyCache.get(['a', 'b', 'c']); // returns 'my value'
multiKeyCache.get(['a', 'b', 'd']); // returns 'another value'
multiKeyCache.get(['a', 'b', 'x']); // returns undefined

multiKeyCache.has(['a', 'b', 'c']); // returns true
multiKeyCache.delete(['a', 'b', 'c']); // deletes 'my value'
multiKeyCache.has(['a', 'b', 'c']); // returns false
multiKeyCache.get(['a', 'b', 'c']); // returns undefined
```

Complex objects as keys:
```javascript
var MultiKeyCache = require('multi-key-cache'),
    multiKeyCache = new MultiKeyCache(),
    arg1 = { a: 1 },
    arg2 = [{ b: 2 }],
    arg3 = { c: [{ d: 3 }] };


multiKeyCache.set([arg1, arg2, arg3], 'my value'); // sets 'my value' to complex keys
multiKeyCache.set([arg3, arg2, arg1], 'another value'); // sets 'another value' to completely unrelated set of complex keys

multiKeyCache.get([arg1, arg2, arg3]); // returns 'my value'
multiKeyCache.get({ 0: arg3, 1: arg2, 2: arg1, length: 3}); // returns 'another value', keys container doesn't have to be an array

multiKeyCache.delete({ 0: arg1, 1: arg2, 2: arg3, length: 3}); // deletes 'my value' and associated empty keys
multiKeyCache.has([arg1, arg2, arg3]); // returns false
multiKeyCache.get([arg1, arg2, arg3]); // returns undefined
```

## Test
```javascript
npm run test
```

## License

Released under an MIT license.

### Other Libs

- [Memoizerific](https://github.com/thinkloop/memoizerific): Fastest, smallest, most-efficient JavaScript memoization lib to memoize JS functions.
- [Map or Similar](https://github.com/thinkloop/map-or-similar): A JavaScript (JS) Map or Similar object polyfill if Map is not available.