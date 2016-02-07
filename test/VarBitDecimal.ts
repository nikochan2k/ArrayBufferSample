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

    context("write value", () => {
        const binary = new Binary(1);
        const d = new VarBitDecimal(false, 0, 255);
        d.setValue(1);
        d.write(binary);

        it("byteOffset", () => {
            assert.equal(binary.byteOffset, 0);
        });

        it("bitOffset", () => {
            assert.equal(binary.bitOffset, 4);
        });

        it("value", () => {
            assert.equal(binary.u8[0], parseInt("00010000", 2));
        });
    });

    context("write values", () => {
        const binary = new Binary(4);
        const d = new VarBitDecimal(false, 0, 65535);

        it("write 1", () => {
            d.setValue(1);
            d.write(binary);
            assert.equal(binary.u8[0], parseInt("00001000", 2));
        });

        it("write 2", () => {
            d.setValue(2);
            d.write(binary);
            assert.equal(binary.u8[0], parseInt("00001000", 2));
            assert.equal(binary.u8[1], parseInt("11000000", 2));
        });

        it("write 5", () => {
            d.setValue(5);
            d.write(binary);
            assert.equal(binary.u8[0], parseInt("00001000", 2));
            assert.equal(binary.u8[1], parseInt("11000101", 2));
            assert.equal(binary.u8[2], parseInt("01000000", 2));
        });
    });

    context("read values", () => {
        const binary = new Binary(5);
        binary.u8[0] = parseInt("00001000", 2);
        binary.u8[1] = parseInt("11000101", 2);
        binary.u8[2] = parseInt("01111111", 2);
        binary.u8[3] = parseInt("11111111", 2);
        binary.u8[4] = parseInt("11111100", 2);
        const d = new VarBitDecimal(false, 0, 65535);

        it("read 1", () => {
            d.read(binary);
            assert.equal(d.getValue(), 1);
        });

        it("read 2", () => {
            d.read(binary);
            assert.equal(d.getValue(), 2);
        });

        it("read 5", () => {
            d.read(binary);
            assert.equal(d.getValue(), 5);
        });

        it("read 65535", () => {
            d.read(binary);
            assert.equal(d.getValue(), 65535);
        });
    });

    context("write and read values", () => {
        const binary = new Binary(5);
        const d = new VarBitDecimal(false, 0, 65535);
        d.setValue(1);
        d.write(binary);
        d.setValue(2);
        d.write(binary);
        d.setValue(5);
        d.write(binary);
        d.setValue(65535);
        d.write(binary);
        binary.byteOffset = 0;
        binary.bitOffset = 0;

        it("read 1", () => {
            d.read(binary);
            assert.equal(d.getValue(), 1);
        });

        it("read 2", () => {
            d.read(binary);
            assert.equal(d.getValue(), 2);
        });

        it("read 5", () => {
            d.read(binary);
            assert.equal(d.getValue(), 5);
        });

        it("read 65535", () => {
            d.read(binary);
            assert.equal(d.getValue(), 65535);
        });
    });
});
