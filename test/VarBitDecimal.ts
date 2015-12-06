import assert from "power-assert";
import VarBitDecimal from "../src/VarBitDecimal";

describe("VarBitDecimal", () => {

    context("constructor()", () => {
        it("1 bit", () => {
            const decimal = new VarBitDecimal(false, 0, 1);
            assert.deepEqual(decimal._varBitLength, 1);
        });

        it("2 bits", () => {
            const decimal = new VarBitDecimal(false, 0, 2);
            assert.deepEqual(decimal._varBitLength, 2);
        });

        it("8 bits", () => {
            const decimal = new VarBitDecimal(false, -128, 127);
            assert.deepEqual(decimal._varBitLength, 8);
        });

        it("9 bits", () => {
            try {
                new VarBitDecimal(false, -128, 128);
                assert.fail();
            } catch (e) {
                assert.ok("greater than 8 bits");
            }
        });
    });

});
