var MultiKeyCache = require('../src/multi-key-cache');


describe("DELETE with no items", () => {
    var multiKeyCache = new MultiKeyCache();

    it("should not error", () => {
        expect(multiKeyCache.delete(['a', 'b', 'c'])).toEqual(false);
        expect(multiKeyCache.delete([undefined])).toEqual(false);
        expect(multiKeyCache.delete({ a: null })).toEqual(false);
    });
});

describe("DELETE some items", () => {
    var multiKeyCache;

    beforeEach(() => {
        multiKeyCache = new MultiKeyCache();
        multiKeyCache.set(['a', 'b', 'c'], 123);
        multiKeyCache.set(['a', 'b', 'c'], 345);
    });

    it("should have some keys and values before delete", () => {
        expect(multiKeyCache.keyNodes().length).toEqual(4);
        expect(multiKeyCache.values().length).toEqual(1);
    });

    it("should have no keys after delete", () => {
        expect(multiKeyCache.delete(['a', 'b', 'c'])).toEqual(true);
        it("should no longer have keys", () => { expect(multiKeyCache.keyNodes().length).toEqual(0); });
    });

    it("should not error if deleting twice", () => {
        expect(multiKeyCache.delete(['a', 'b', 'c'])).toEqual(true);
        expect(multiKeyCache.delete(['a', 'b', 'c'])).toEqual(false);
        it("should no longer have keys", () => { expect(multiKeyCache.keyNodes().length).toEqual(0); });
    });
});

describe("DELETE varying length keys", () => {
    var multiKeyCache;

    beforeEach(() => {
        multiKeyCache = new MultiKeyCache();
        multiKeyCache.set(['a'], 'x');
        multiKeyCache.set(['a', 'b'], 'c');
        multiKeyCache.set(['a', 'b', 'c'], 'd');
        multiKeyCache.set(['a'], 'b');
        multiKeyCache.set(['b'], 'y');
    });

    it("should have proper number keys and values", () => {
        expect(multiKeyCache.keyNodes().length).toEqual(8);
        expect(multiKeyCache.values().length).toEqual(4);
    });

    it("should delete just value, not whole key", () => {
        multiKeyCache.delete(['a']);
        expect(multiKeyCache.keyNodes().length).toEqual(7);
        expect(multiKeyCache.values().length).toEqual(3);

        expect(multiKeyCache.get(['a'])).toEqual(undefined);
        expect(multiKeyCache.get(['b'])).toEqual('y');
        expect(multiKeyCache.get(['a', 'b'])).toEqual('c');
        expect(multiKeyCache.get(['a', 'b', 'c'])).toEqual('d');
        expect(multiKeyCache.get(['a', 'b', 'd'])).toEqual(undefined);
        expect(multiKeyCache.get(['c'])).toEqual(undefined);
        expect(multiKeyCache.get(['a','c'])).toEqual(undefined);
    });
});