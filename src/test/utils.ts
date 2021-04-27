import assert from "assert";
import { Util } from "../util/Util";

describe("ConcordiaClient > Utilities", () => {
    describe("Merging options", () => {
        it("defaults, no options", () => {
            const defaults = { foo: "bar", 1: 2 };
            const merged = Util.mergeDefault(defaults, undefined);
            assert.deepStrictEqual(defaults, merged);
        });

        it("defaults, options", () => {
            const defaults = { foo: "bar", 1: 2 };
            const merged = Util.mergeDefault(defaults, { 1: 3 });
            assert.deepStrictEqual(merged, { foo: "bar", 1: 3 });
        });

        it("no defaults, no options", () => {
            const merged = Util.mergeDefault(undefined, undefined);
            assert.deepStrictEqual(merged, {});
        });

        it("no defaults, options", () => {
            const merged = Util.mergeDefault(undefined, { foo: "bar", 1: 2 });
            assert.deepStrictEqual(merged, { foo: "bar", 1: 2 });
        });
    })

});

