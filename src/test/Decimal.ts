import assert from "power-assert";
import Decimal from "../main/Decimal";
import Binary from "../main/Binary";

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
            decimal.value = 0;
            assert.equal(decimal._rawValue, 128);
        });

        it("8bit, minimum value", () => {
            const decimal = new Decimal(false, -128, 127);
            decimal.value = -128;
            assert.equal(decimal._rawValue, 0);
        });

        it("8bit, maximum value", () => {
            const decimal = new Decimal(false, -128, 127);
            decimal.value = 127;
            assert.equal(decimal._rawValue, 255);
        });

        it("8bit, less than minimum value", () => {
            const decimal = new Decimal(false, -128, 127);
            try {
                decimal.value = -129;
                assert.fail();
            } catch (e) {
                assert.ok("Catch exception");
            }
        });

        it("8bit, more than maximum value", () => {
            const decimal = new Decimal(false, -128, 127);
            try {
                decimal.value = 128;
                assert.fail();
            } catch (e) {
                assert.ok("Catch exception");
            }
        });

        it("With step", () => {
            const decimal = new Decimal(false, -1, 100, 0.1);
            decimal.value = 100;
            assert.equal(decimal._rawValue, 1010);
        });
    });

    context("set byte value and write", () => {
        const binary = new Binary(2);
        const decimal = new Decimal(false, -16, 15);
        decimal.value = 0;
        decimal.write(binary);

        it("byteOffset", () => {
            assert.equal(binary._byteOffset, 0);
        });

        it("bitOffset", () => {
            assert.equal(binary._bitOffset, 5);
        });

        it("value", () => {
            assert.equal(binary._u8[0], parseInt("10000000", 2));
        });
    });

    context("set byte values and write", () => {
        const binary = new Binary(2);
        const decimal = new Decimal(false, -16, 15);
        decimal.value = -16;
        decimal.write(binary);
        decimal.value = 15;
        decimal.write(binary);

        it("byteOffset", () => {
            assert.equal(binary._byteOffset, 1);
        });

        it("bitOffset", () => {
            assert.equal(binary._bitOffset, 2);
        });

        it("value", () => {
            assert.equal(binary._u8[0], parseInt("00000111", 2));
            assert.equal(binary._u8[1], parseInt("11000000", 2));
        });
    });

    context("set short values and write", () => {
        const binary = new Binary(3);
        const decimal = new Decimal(false, 0, 1023);
        decimal.value = 682;
        decimal.write(binary);
        decimal.value = 1023;
        decimal.write(binary);

        it("byteOffset", () => {
            assert.equal(binary._byteOffset, 2);
        });

        it("bitOffset", () => {
            assert.equal(binary._bitOffset, 4);
        });

        it("value", () => {
            assert.equal(binary._u8[0], parseInt("10101010", 2));
            assert.equal(binary._u8[1], parseInt("10111111", 2));
            assert.equal(binary._u8[2], parseInt("11110000", 2));
        });
    });

    context("set long value and write", () => {
        const binary = new Binary(7);
        const decimal = new Decimal(false, 0, 9007199254740991);
        decimal.value = 9007199254740991;
        decimal.write(binary);

        it("byteOffset", () => {
            assert.equal(binary._byteOffset, 6);
        });

        it("bitOffset", () => {
            assert.equal(binary._bitOffset, 5);
        });

        it("value", () => {
            assert.equal(binary._u8[0], parseInt("11111111", 2));
            assert.equal(binary._u8[1], parseInt("11111111", 2));
            assert.equal(binary._u8[2], parseInt("11111111", 2));
            assert.equal(binary._u8[3], parseInt("11111111", 2));
            assert.equal(binary._u8[4], parseInt("11111111", 2));
            assert.equal(binary._u8[5], parseInt("11111111", 2));
            assert.equal(binary._u8[6], parseInt("11111000", 2));
        });
    });

    context("nullable, set short values and write", () => {
        const binary = new Binary(3);
        const decimal = new Decimal(true, 0, 1023);
        decimal.write(binary);
        decimal.value = 682;
        decimal.write(binary);
        decimal.value = 1023;
        decimal.write(binary);

        it("byteOffset", () => {
            assert.equal(binary._byteOffset, 2);
        });

        it("bitOffset", () => {
            assert.equal(binary._bitOffset, 7);
        });

        it("value", () => {
            assert.equal(binary._u8[0], parseInt("01101010", 2));
            assert.equal(binary._u8[1], parseInt("10101111", 2));
            assert.equal(binary._u8[2], parseInt("11111110", 2));
        });
    });

    context("read", () => {
        const binary = new Binary(2);
        const u8 = binary._u8;
        u8[0] = parseInt("11111111", 2);
        u8[1] = parseInt("11100000", 2);

        it("nullable, null", () => {
            const d = new Decimal(false, -1024, 1023);
            d.read(binary);
            assert.equal(binary._byteOffset, 1);
            assert.equal(binary._bitOffset, 3);
            assert.equal(d.value, 1023);
        });
    });

    context("read", () => {
        const binary = new Binary(11);
        const u8 = binary._u8;
        u8[0] = parseInt("00000011", 2);
        u8[1] = parseInt("11111111", 2);
        u8[2] = parseInt("11100000", 2);
        u8[3] = parseInt("00000000", 2);
        u8[4] = parseInt("00111111", 2);
        u8[5] = parseInt("11111111", 2);
        u8[6] = parseInt("11111111", 2);
        u8[7] = parseInt("11111111", 2);
        u8[8] = parseInt("11111111", 2);
        u8[9] = parseInt("11111111", 2);
        u8[10] = parseInt("11111110", 2);

        it("nullable, null", () => {
            const d = new Decimal(true, 0, 255);
            d.read(binary);
            assert.equal(binary._byteOffset, 0);
            assert.equal(binary._bitOffset, 1);
            assert.equal(d.value, undefined);
        });

        it("byte value, min", () => {
            const d = new Decimal(false, -16, 15);
            d.read(binary);
            assert.equal(binary._byteOffset, 0);
            assert.equal(binary._bitOffset, 6);
            assert.equal(d.value, -16);
        });

        it("nullable, short value, max", () => {
            const d = new Decimal(true, -1024, 1023);
            d.read(binary);
            assert.equal(binary._byteOffset, 2);
            assert.equal(binary._bitOffset, 2);
            assert.equal(d.value, 1023);
        });

        it("integer value, center", () => {
            const d = new Decimal(false, -32768, 32767);
            d.read(binary);
            assert.equal(d.value, 0);
        });

        it("long value, max", () => {
            const d = new Decimal(false, 0, 9007199254740991);
            d.read(binary);
            assert.equal(d.value, 9007199254740991);
        });

    });

});
