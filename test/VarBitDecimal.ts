import assert from "power-assert";
import VarBitDecimal from "../src/VarBitDecimal";

describe("VarBitDecimal", () => {

    context("constructor()", () => {
        it("1 bit", () => {
            const decimal = new VarBitDecimal(false, 0, 1);
            assert.deepEqual(decimal._varBitLength, 1);
        });

        it("2 bit", () => {
            const decimal = new VarBitDecimal(false, 0, 2);
            assert.deepEqual(decimal._varBitLength, 2);
        });

        it("16 bit", () => {
            const decimal = new VarBitDecimal(false, -32768, 32767);
            assert.deepEqual(decimal._varBitLength, 16);
        });
    });

});
