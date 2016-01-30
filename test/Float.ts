import assert from "power-assert";
import Binary from "../src/Binary";
import Float from "../src/Float";

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
        fw.setValue(1234567);
        fw.write(binary);

        it("byteOffset", () => {
            assert.equal(binary.byteOffset, 4);
        });

        it("bitOffset", () => {
            assert.equal(binary.bitOffset, 0);
        });

        it("value", () => {
            binary.byteOffset = 0;
            const fr = new Float(false, false);
            fr.read(binary);
            assert.equal(fr.getValue(), fw.getValue());
        });
    });
});
