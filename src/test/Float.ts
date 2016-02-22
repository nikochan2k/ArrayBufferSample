import assert from "power-assert";
import Binary from "../main/Binary";
import Float from "../main/Float";

describe("Float", () => {
    context("constructor()", () => {
        it("double", () => {
            const float = new Float(false);
            assert.equal(float._valueBitLength, 64);
        });

        it("single", () => {
            const float = new Float(false, false);
            assert.equal(float._valueBitLength, 32);
        });
    });

    context("write and read float value", () => {
        const binary = new Binary(4);
        const fw = new Float(false, false);
        fw.value = 1234567;
        fw.write(binary);

        it("byteOffset", () => {
            assert.equal(binary._byteOffset, 4);
        });

        it("bitOffset", () => {
            assert.equal(binary._bitOffset, 0);
        });

        it("value", () => {
            binary._byteOffset = 0;
            const fr = new Float(false, false);
            fr.read(binary);
            assert.equal(fr.value, fw.value);
        });
    });
});
