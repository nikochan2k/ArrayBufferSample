import assert from "power-assert";
import VarByteDecimal from "../src/VarByteDecimal";

describe("VarBitDecimal", () => {

    context("constructor()", () => {
        it("1 byte", () => {
            const decimal = new VarByteDecimal(false, 0, 1);
            assert.deepEqual(decimal._varBitLength, 1);
        });

        it("2 bytes", () => {
            const decimal = new VarByteDecimal(false, 0, 256);
            assert.deepEqual(decimal._varBitLength, 2);
        });

        it("2 byte", () => {
            const decimal = new VarByteDecimal(false, -32768, 32767);
            assert.deepEqual(decimal._varBitLength, 2);
        });

        it("3 byte", () => {
            const decimal = new VarByteDecimal(false, -32768, 32768);
            assert.deepEqual(decimal._varBitLength, 3);
        });
    });

});
