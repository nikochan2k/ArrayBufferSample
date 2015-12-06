import assert from "power-assert";
import Bool from "../src/Bool";

describe("Bool", () => {

    context("constructor()", () => {
        it("double", () => {
            const b = new Bool(false);
            b.setValue(true);
            const buffer = b.getBuffer();
            const u8 = new Uint8Array(buffer);
            assert.equal(u8[0], 1);
        });
    });

});
