var MultiKeyCache = require('../src/multi-key-cache');

describe("SET undefined keys", () => {
    var multiKeyCache = new MultiKeyCache();

    beforeEach(() => {
        multiKeyCache = new MultiKeyCache();
    });

    it("should have no length", () => {
        expect(multiKeyCache.keyNodes().length).toEqual(0);
    });

    it("should have no values", () => {
        multiKeyCache.set([]);
        expect(multiKeyCache.keyNodes().length).toEqual(0);
    });

    it("should have undefined keys and value", () => {
        multiKeyCache.set([undefined]);

        expect(multiKeyCache.keyNodes().length).toEqual(2);
        expect(multiKeyCache.values().length).toEqual(1);
        expect(multiKeyCache.get([undefined])).toEqual(undefined);
        expect(multiKeyCache.has([undefined])).toEqual(true);
        expect(multiKeyCache.has([null])).toEqual(false);
    });

    it("should have null keys and value", () => {
        multiKeyCache.set([null], null);

        expect(multiKeyCache.keyNodes().length).toEqual(2);
        expect(multiKeyCache.values().length).toEqual(1);
        expect(multiKeyCache.get([undefined])).toEqual(undefined);
        expect(multiKeyCache.has([undefined])).toEqual(false);
        expect(multiKeyCache.get([null])).toEqual(null);
        expect(multiKeyCache.has([null])).toEqual(true);
    });
});

describe("SET one key", () => {
    var multiKeyCache = new MultiKeyCache();

    multiKeyCache.set(['a', 'b', 'c'], 123);

    it("should have a key for each arg + the value", () => {
        expect(multiKeyCache.keyNodes().length).toEqual(4);
    });

    it("should have one value", () => {
        expect(multiKeyCache.values().length).toEqual(1);
    });

    it("should have one value", () => {
        expect(multiKeyCache.get(['a', 'b', 'c'])).toEqual(123);
    });
});

describe("SET replace key", () => {
    var multiKeyCache = new MultiKeyCache();

    multiKeyCache.set(['a', 'b', 'c'], 123);
    multiKeyCache.set(['a', 'b', 'c'], 345);

    it("should have a key for each arg + the value", () => {
        expect(multiKeyCache.keyNodes().length).toEqual(4);
    });

    it("should have one value", () => {
        expect(multiKeyCache.values().length).toEqual(1);
    });

    it("should have replaced value", () => {
        expect(multiKeyCache.get(['a', 'b', 'c'])).toEqual(345);
    });

    it("should not have other values", () => {
        expect(multiKeyCache.get(['a', 'b'])).toEqual(undefined);
    });
});

describe("SET multiple overlapping keys", () => {
    var multiKeyCache = new MultiKeyCache();

    multiKeyCache.set(['a', 'b', 'c'], 123);
    multiKeyCache.set(['a', 'b', 'c'], 345);
    multiKeyCache.set(['a', 'b', 'd'], 678);

    it("should have a key for each unique arg + values", () => {
        expect(multiKeyCache.keyNodes().length).toEqual(6);
    });

    it("should have two values", () => {
        expect(multiKeyCache.values().length).toEqual(2);
    });

    it("should have proper values", () => {
        expect(multiKeyCache.get(['a', 'b', 'c'])).toEqual(345);
        expect(multiKeyCache.get(['a', 'b', 'd'])).toEqual(678);
    });
});

describe("SET multiple unique keys", () => {
    var multiKeyCache = new MultiKeyCache();

    multiKeyCache.set(['a', 'b', 'c'], 123);
    multiKeyCache.set(['d', 'e', 'f'], 345);

    it("should have a key for each unique arg + values", () => {
        expect(multiKeyCache.keyNodes().length).toEqual(8);
    });

    it("should have two values", () => {
        expect(multiKeyCache.values().length).toEqual(2);
    });

    it("should have proper values", () => {
        expect(multiKeyCache.get(['a', 'b', 'c'])).toEqual(123);
        expect(multiKeyCache.get(['d', 'e', 'f'])).toEqual(345);
    });
});

describe("SET varying length keys", () => {
    var multiKeyCache = new MultiKeyCache();

    multiKeyCache.set(['a'], 'x');
    multiKeyCache.set(['a', 'b'], 'c');
    multiKeyCache.set(['a', 'b', 'c'], 'd');
    multiKeyCache.set(['a'], 'b');
    multiKeyCache.set(['b'], 'y');

    it("should have a key for each unique arg + values", () => {
        expect(multiKeyCache.keyNodes().length).toEqual(8);
    });

    it("should have proper number of values", () => {
        expect(multiKeyCache.values().length).toEqual(4);
    });

    it("should get the right values and no others", () => {
        expect(multiKeyCache.get(['a'])).toEqual('b');
        expect(multiKeyCache.get(['b'])).toEqual('y');
        expect(multiKeyCache.get(['a', 'b'])).toEqual('c');
        expect(multiKeyCache.get(['a', 'b', 'c'])).toEqual('d');
        expect(multiKeyCache.get(['a', 'b', 'd'])).toEqual(undefined);
        expect(multiKeyCache.get(['c'])).toEqual(undefined);
        expect(multiKeyCache.get(['a','c'])).toEqual(undefined);
    });
});

describe("SET one with complex keys", () => {
    var multiKeyCache = new MultiKeyCache(),
        complexArg1 = { a: { b: { c: 99 }}},
        complexArg2 = [{ z: 1}, { q: [{ x: 3 }]}],
        complexArg3 = new Map([['d', 55],['e', 66]]),
        complexArg4 = new Set();

    multiKeyCache.set([complexArg1, complexArg2, complexArg3, complexArg4], 123);
    multiKeyCache.set([complexArg1, complexArg2, complexArg3, complexArg4], 345);

    it("should have a key for each unique arg + values", () => {
        expect(multiKeyCache.keyNodes().length).toEqual(5);
    });

    it("should have proper number of values", () => {
        expect(multiKeyCache.values().length).toEqual(1);
    });

    it("should have proper values", () => {
        expect(multiKeyCache.get([complexArg1, complexArg2, complexArg3, complexArg4])).toEqual(345);
    });
});

describe("SET multiple with complex keys", () => {
    var multiKeyCache = new MultiKeyCache(),
        complexArg1 = { a: { b: { c: 99 }}},
        complexArg2 = [{ z: 1}, { q: [{ x: 3 }]}],
        complexArg3 = new Map([['d', 55],['e', 66]]),
        complexArg4 = new Set();

    multiKeyCache.set([complexArg1, complexArg2, complexArg3, complexArg4], 123);
    multiKeyCache.set([complexArg2, complexArg3, complexArg4, complexArg1], 345);
    multiKeyCache.set([complexArg1, complexArg2, complexArg4, complexArg3], 678);

    it("should have a key for each unique arg + values", () => {
        expect(multiKeyCache.keyNodes().length).toEqual(13);
    });

    it("should have proper number of values", () => {
        expect(multiKeyCache.values().length).toEqual(3);
    });

    it("should have proper values", () => {
        expect(multiKeyCache.get([complexArg1, complexArg2, complexArg3, complexArg4])).toEqual(123);
        expect(multiKeyCache.get([complexArg2, complexArg3, complexArg4, complexArg1])).toEqual(345);
        expect(multiKeyCache.get([complexArg1, complexArg2, complexArg4, complexArg3])).toEqual(678);
    });
});


describe("SET weird object keys container instead of array", () => {
    var multiKeyCache = new MultiKeyCache(),
        complexArg1 = { a: { b: { c: 99 }}},
        complexArg2 = [{ z: 1}, { q: [{ x: 3 }]}],
        complexArg3 = new Map([['d', 55],['e', 66]]),
        complexArg4 = new Set();

    multiKeyCache.set({ 0: complexArg1, 1: complexArg2, 2: complexArg3, 3: complexArg4, length:4 }, 123);
    multiKeyCache.set({ 0: complexArg2, 1: complexArg3, 2: complexArg4, 3: complexArg1, length:4 }, 345);
    multiKeyCache.set({ 0: complexArg1, 1: complexArg2, 2: complexArg4, 3: complexArg3, length:4 }, 678);

    it("should have a key for each unique arg + values", () => {
        expect(multiKeyCache.keyNodes().length).toEqual(13);
    });

    it("should have proper number of values", () => {
        expect(multiKeyCache.values().length).toEqual(3);
    });

    it("should have proper values", () => {
        expect(multiKeyCache.get({ 0: complexArg1, 1: complexArg2, 2: complexArg3, 3: complexArg4, length:4 })).toEqual(123);
        expect(multiKeyCache.get({ 0: complexArg2, 1: complexArg3, 2: complexArg4, 3: complexArg1, length:4 })).toEqual(345);
        expect(multiKeyCache.get({ 0: complexArg1, 1: complexArg2, 2: complexArg4, 3: complexArg3, length:4 })).toEqual(678);
    });
});