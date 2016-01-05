import assert from "power-assert";
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

    context("value", () => {
        it("double", () => {
            const float = new Float(false);
            float.setValue(1234567890);
            float.setBuffer(float.getBuffer());
            assert.equal(float.value, 1234567890);
        });

        it("single", () => {
            const float = new Float(false);
            float.setValue(1234567);
            float.setBuffer(float.getBuffer());
            assert.equal(float.value, 1234567);
        });
    });
});
