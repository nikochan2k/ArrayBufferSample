import assert from "power-assert";
import Decimal from "../src/Decimal";
import Binary from "../src/Binary";

describe("Decimal", () => {

    context("constructor()", () => {
        it("max < min", () => {
            try {
                new Decimal(false, 1, 0);
                assert.fail();
            } catch (e) {
                assert.ok("max < min");
            }
        });

        it("Valid step", () => {
            try {
                new Decimal(false, -2, 10, 0.3);
                assert.ok("Valid step");
            } catch (e) {
                assert.fail(e);
            }
        });

        it("Valid bits", () => {
            try {
                new Decimal(false, 0, 9007199254740991);
                assert.ok("Valid step");
            } catch (e) {
                assert.fail(e);
            }
        });

        it("Invalid step", () => {
            try {
                new Decimal(false, 0, 9007199254740992);
                assert.fail();
            } catch (e) {
                assert.ok("Invalid step");
            }
        });
    });

    context("precision", () => {
        it("1", () => {
            const decimal = new Decimal(false, 0, 1);
            assert.equal(decimal._precision, 1);
        });

        it("0.1", () => {
            const decimal = new Decimal(false, 0.1, 1);
            assert.equal(decimal._precision, 0.1);
        });

        it("0.01", () => {
            const decimal = new Decimal(false, 0.01, 0.1);
            assert.equal(decimal._precision, 0.01);
        });
    });

    context("bitLength", () => {
        it("from 0 to 1", () => {
            const decimal = new Decimal(false, 0, 1);
            assert.equal(decimal._valueBitLength, 1);
        });

        it("from 0 to 2", () => {
            const decimal = new Decimal(false, 0, 2);
            assert.equal(decimal._valueBitLength, 2);
        });

        it("from -32768 to 32767", () => {
            const decimal = new Decimal(false, -32768, 32767);
            assert.equal(decimal._valueBitLength, 16);
        });

        it("from -32768 to 32768", () => {
            const decimal = new Decimal(false, -32768, 32768);
            assert.equal(decimal._valueBitLength, 17);
        });

        it("from -2147483648 to 2147483647", () => {
            const decimal = new Decimal(false, -2147483648, 2147483647);
            assert.equal(decimal._valueBitLength, 32);
        });

        it("from -2147483648 to 2147483648", () => {
            const decimal = new Decimal(false, -2147483648, 2147483648);
            assert.equal(decimal._valueBitLength, 33);
        });

        it("the max of float64", () => {
            const decimal = new Decimal(false, 0, 9007199254740991);
            assert.equal(decimal._valueBitLength, 53);
        });
    });

    context("value", () => {
        it("8bit, center value", () => {
            const decimal = new Decimal(false, -128, 127);
            decimal.setValue(0);
            assert.equal(decimal._getRawValue(), 128);
        });

        it("8bit, minimum value", () => {
            const decimal = new Decimal(false, -128, 127);
            decimal.setValue(-128);
            assert.equal(decimal._getRawValue(), 0);
        });

        it("8bit, maximum value", () => {
            const decimal = new Decimal(false, -128, 127);
            decimal.setValue(127);
            assert.equal(decimal._getRawValue(), 255);
        });

        it("8bit, less than minimum value", () => {
            const decimal = new Decimal(false, -128, 127);
            try {
                decimal.setValue(-129);
                assert.fail();
            } catch (e) {
                assert.ok("Catch exception");
            }
        });

        it("8bit, more than maximum value", () => {
            const decimal = new Decimal(false, -128, 127);
            try {
                decimal.setValue(128);
                assert.fail();
            } catch (e) {
                assert.ok("Catch exception");
            }
        });

        it("With step", () => {
            const decimal = new Decimal(false, -1, 100, 0.1);
            decimal.setValue(100);
            assert.equal(decimal._getRawValue(), 1010);
        });
    });

    context("set byte value and write", () => {
        const binary = new Binary(2);
        const decimal = new Decimal(false, -16, 15);
        decimal.setValue(0);
        decimal.write(binary);

        it("byteOffset", () => {
            assert.equal(binary.byteOffset, 0);
        });

        it("bitOffset", () => {
            assert.equal(binary.bitOffset, 5);
        });

        it("value", () => {
            assert.equal(binary.u8[0], parseInt("10000000", 2));
        });
    });

    context("set byte values and write", () => {
        const binary = new Binary(2);
        const decimal = new Decimal(false, -16, 15);
        decimal.setValue(-16);
        decimal.write(binary);
        decimal.setValue(15);
        decimal.write(binary);

        it("byteOffset", () => {
            assert.equal(binary.byteOffset, 1);
        });

        it("bitOffset", () => {
            assert.equal(binary.bitOffset, 2);
        });

        it("value", () => {
            assert.equal(binary.u8[0], parseInt("00000111", 2));
            assert.equal(binary.u8[1], parseInt("11000000", 2));
        });
    });

    context("set short values and write", () => {
        const binary = new Binary(3);
        const decimal = new Decimal(false, 0, 1023);
        decimal.setValue(682);
        decimal.write(binary);
        decimal.setValue(1023);
        decimal.write(binary);

        it("byteOffset", () => {
            assert.equal(binary.byteOffset, 2);
        });

        it("bitOffset", () => {
            assert.equal(binary.bitOffset, 4);
        });

        it("value", () => {
            assert.equal(binary.u8[0], parseInt("10101010", 2));
            assert.equal(binary.u8[1], parseInt("10111111", 2));
            assert.equal(binary.u8[2], parseInt("11110000", 2));
        });
    });

    context("set integer values and write", () => {
        const binary = new Binary(7);
        const decimal = new Decimal(false, 0, 9007199254740991);
        decimal.setValue(9007199254740991);
        decimal.write(binary);

        it("byteOffset", () => {
            assert.equal(binary.byteOffset, 6);
        });

        it("bitOffset", () => {
            assert.equal(binary.bitOffset, 5);
        });

        it("value", () => {
            assert.equal(binary.u8[0], parseInt("11111111", 2));
            assert.equal(binary.u8[1], parseInt("11111111", 2));
            assert.equal(binary.u8[2], parseInt("11111111", 2));
            assert.equal(binary.u8[3], parseInt("11111111", 2));
            assert.equal(binary.u8[4], parseInt("11111111", 2));
            assert.equal(binary.u8[5], parseInt("11111111", 2));
            assert.equal(binary.u8[6], parseInt("11111000", 2));
        });
    });

});
