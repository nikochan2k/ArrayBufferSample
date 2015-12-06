import assert from "power-assert";
import Decimal from "../src/Decimal";
import Float from "../src/Float";
import Bool from "../src/Bool";

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

    context("Step", () => {
        it("1", () => {
            const decimal = new Decimal(false, 0, 1);
            assert.deepEqual(decimal._step, 1);
        });

        it("0.1", () => {
            const decimal = new Decimal(false, 0.1, 1);
            assert.deepEqual(decimal._step, 0.1);
        });

        it("0.01", () => {
            const decimal = new Decimal(false, 0.01, 0.1);
            assert.deepEqual(decimal._step, 0.01);
        });
    });

    context("NumOfBits", () => {
        it("from 0 to 1", () => {
            const decimal = new Decimal(false, 0, 1);
            assert.deepEqual(decimal._bitLength, 1);
        });

        it("from 0 to 2", () => {
            const decimal = new Decimal(false, 0, 2);
            assert.deepEqual(decimal._bitLength, 2);
        });

        it("from -32768 to 32767", () => {
            const decimal = new Decimal(false, -32768, 32767);
            assert.deepEqual(decimal._bitLength, 16);
        });

        it("from -32768 to 32768", () => {
            const decimal = new Decimal(false, -32768, 32768);
            assert.deepEqual(decimal._bitLength, 17);
        });

        it("from -2147483648 to 2147483647", () => {
            const decimal = new Decimal(false, -2147483648, 2147483647);
            assert.deepEqual(decimal._bitLength, 32);
        });

        it("from -2147483648 to 2147483648", () => {
            const decimal = new Decimal(false, -2147483648, 2147483648);
            assert.deepEqual(decimal._bitLength, 33);
        });

        it("the max of float64", () => {
            const decimal = new Decimal(false, 0, 9007199254740991);
            assert.deepEqual(decimal._bitLength, 53);
        });
    });

    context("Value", () => {
        it("8bit, center value", () => {
            const decimal = new Decimal(false, -128, 127);
            decimal.setValue(0);
            assert.deepEqual(decimal._intValue, 128);
        });

        it("8bit, minimum value", () => {
            const decimal = new Decimal(false, -128, 127);
            decimal.setValue(-128);
            assert.deepEqual(decimal._intValue, 0);
        });

        it("8bit, maximum value", () => {
            const decimal = new Decimal(false, -128, 127);
            decimal.setValue(127);
            assert.deepEqual(decimal._intValue, 255);
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
            assert.deepEqual(decimal._intValue, 1010);
        });
    });

    context("BitsValue", () => {
        it("8bit, max", () => {
            const decimal = new Decimal(false, -128, 127);
            const u8 = Decimal._toBuffer(255, decimal._byteLength);
            decimal.setBuffer(u8.buffer);
            assert.deepEqual(decimal._value, 127);
        });

        it("8bit, min", () => {
            const decimal = new Decimal(false, -128, 127);
            const u8 = Decimal._toBuffer(0, decimal._byteLength);
            decimal.setBuffer(u8.buffer);
            assert.deepEqual(decimal._value, -128);
        });

        it("With step, max", () => {
            const decimal = new Decimal(false, -128, 127, 0.1);
            const u8 = Decimal._toBuffer(2550, decimal._byteLength);
            decimal.setBuffer(u8.buffer);
            assert.deepEqual(decimal._value, 127);
        });

        it("With step, min", () => {
            const decimal = new Decimal(false, -128, 127, 0.1);
            const u8 = Decimal._toBuffer(0, decimal._byteLength);
            decimal.setBuffer(u8.buffer);
            assert.deepEqual(decimal._value, -128);
        });
    });

    describe("Float", () => {
        context("constructor()", () => {
            it("double", () => {
                const float = new Float(false);
                assert.equal(float._bitLength, 64);
            });

            it("single", () => {
                const float = new Float(false, false);
                assert.equal(float._bitLength, 32);
            });
        });

        context("value", () => {
            it("double", () => {
                const float = new Float(false);
                float.setValue(1234567890);
                float.setBuffer(float.getBuffer());
                assert.equal(float._value, 1234567890);
            });

            it("single", () => {
                const float = new Float(false);
                float.setValue(1234567);
                float.setBuffer(float.getBuffer());
                assert.equal(float._value, 1234567);
            });
        });
    });

    describe("Bool", () => {
        context("constructor()", () => {
            it("double", () => {
                const b = new Bool(false);
                b.setValue(true);
                const buffer = b.getBuffer();
                const u8 = new Uint8Array(buffer);
                assert.equal(u8[0], 1);
            });
        });

    });
});
