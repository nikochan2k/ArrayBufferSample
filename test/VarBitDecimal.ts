import assert from "power-assert";
import Binary from "../src/Binary";
import VarBitDecimal from "../src/VarBitDecimal";

describe("VarBitDecimal", () => {
    context("control bit length", () => {

        it("8 bit", () => {
            const decimal = new VarBitDecimal(false, 0, 255);
            assert.equal(decimal._controlBitLength, 3);
        });

        it("9 bit", () => {
            const decimal = new VarBitDecimal(false, 0, 256);
            assert.equal(decimal._controlBitLength, 4);
        });

        it("16 bit", () => {
            const decimal = new VarBitDecimal(false, -32768, 32767);
            assert.equal(decimal._controlBitLength, 4);
        });

        it("17 bit", () => {
            const decimal = new VarBitDecimal(false, -32768, 32768);
            assert.equal(decimal._controlBitLength, 5);
        });

        it("32 bit", () => {
            const decimal = new VarBitDecimal(false, 0, 4294967295);
            assert.equal(decimal._controlBitLength, 5);
        });

        it("33 bit", () => {
            const decimal = new VarBitDecimal(false, 0, 4294967296);
            assert.equal(decimal._controlBitLength, 6);
        });

        it("53 bit", () => {
            const decimal = new VarBitDecimal(false, 0, 9007199254740991);
            assert.equal(decimal._controlBitLength, 6);
        });
    });

    context("write and read float value", () => {
        const binary = new Binary(1);
        const dw = new VarBitDecimal(false, 0, 255);
        dw.setValue(1);
        dw.write(binary);

        it("byteOffset", () => {
            assert.equal(binary.byteOffset, 0);
        });

        it("bitOffset", () => {
            assert.equal(binary.bitOffset, 4);
        });

        it("value", () => {
            assert.equal(binary.u8[0], parseInt("00110000", 2));
        });
    });
});
