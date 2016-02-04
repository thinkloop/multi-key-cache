var MultiKeyCache = require('../src/multi-key-cache');

describe("HAS with no items", () => {
    var multiKeyCache = new MultiKeyCache();

    it("should return undefined #1", () => { expect(multiKeyCache.has([])).toEqual(false); });
    it("should return undefined #1", () => { expect(multiKeyCache.has([1])).toEqual(false); });
    it("should return undefined #2", () => { expect(multiKeyCache.has([undefined])).toEqual(false); });
    it("should return undefined #3", () => { expect(multiKeyCache.has([false])).toEqual(false); });
    it("should return undefined #4", () => { multiKeyCache = new MultiKeyCache(); expect(multiKeyCache.has({ a: false })).toEqual(false); });
});
