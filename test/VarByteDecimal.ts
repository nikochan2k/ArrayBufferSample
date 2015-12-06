import assert from "power-assert";
import VarByteDecimal from "../src/VarByteDecimal";

describe("VarBitDecimal", () => {

    context("constructor()", () => {
        it("1 byte", () => {
            try {
                new VarByteDecimal(false, 0, 1);
                assert.fail();
            } catch (e) {
                assert.ok("less or equal than 8 bits");
            }
        });

        it("2 bytes", () => {
            const decimal = new VarByteDecimal(false, 0, 256);
            assert.deepEqual(decimal._varBitLength, 2);
        });

        it("2 bytes", () => {
            const decimal = new VarByteDecimal(false, -32768, 32767);
            assert.deepEqual(decimal._varBitLength, 2);
        });

        it("3 bytes", () => {
            const decimal = new VarByteDecimal(false, -32768, 32768);
            assert.deepEqual(decimal._varBitLength, 3);
        });
    });

});
