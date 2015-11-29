import assert from "power-assert";
import Decimal from "../src/Decimal";
import Float from "../src/Float";

describe("Decimal", () => {
    context("constructor()", () => {
        it("max < min", () => {
            try {
                new Decimal(1, 0);
                assert.fail();
            } catch (e) {
                assert.ok("max < min");
            }
        });

        it("Valid step", () => {
            try {
                new Decimal(-2, 10, 0.3);
                assert.ok("Valid step");
            } catch (e) {
                assert.fail(e);
            }
        });

        it("Invalid step", () => {
            try {
                new Decimal(0, 10, 0.3);
                assert.fail();
            } catch (e) {
                assert.ok("Invalid step");
            }
        });

        it("Valid bits", () => {
            try {
                new Decimal(0, 9007199254740991);
                assert.ok("Valid step");
            } catch (e) {
                assert.fail(e);
            }
        });

        it("Invalid step", () => {
            try {
                new Decimal(0, 9007199254740992);
                assert.fail();
            } catch (e) {
                assert.ok("Invalid step");
            }
        });
    });

    context("NumOfBits", () => {
        it("from 0 to 1", () => {
            const decimal = new Decimal(0, 1);
            assert.deepEqual(1, decimal._bitLength);
        });

        it("from 0 to 2", () => {
            const decimal = new Decimal(0, 2);
            assert.deepEqual(2, decimal._bitLength);
        });

        it("from -32768 to 32767", () => {
            const decimal = new Decimal(-32768, 32767);
            assert.deepEqual(16, decimal._bitLength);
        });

        it("from -32768 to 32768", () => {
            const decimal = new Decimal(-32768, 32768);
            assert.deepEqual(17, decimal._bitLength);
        });

        it("from -2147483648 to 2147483647", () => {
            const decimal = new Decimal(-2147483648, 2147483647);
            assert.deepEqual(32, decimal._bitLength);
        });

        it("from -2147483648 to 2147483648", () => {
            const decimal = new Decimal(-2147483648, 2147483648);
            assert.deepEqual(33, decimal._bitLength);
        });

        it("the max of float64", () => {
            const decimal = new Decimal(0, 9007199254740991);
            assert.deepEqual(53, decimal._bitLength);
        });
    });

    context("Value", () => {
        it("8bit, center value", () => {
            const decimal = new Decimal(-128, 127);
            decimal.setValue(0);
            assert.deepEqual(128, decimal._u8ToRawValue());
        });

        it("8bit, minimum value", () => {
            const decimal = new Decimal(-128, 127);
            decimal.setValue(-128);
            assert.deepEqual(0, decimal._u8ToRawValue());
        });

        it("8bit, maximum value", () => {
            const decimal = new Decimal(-128, 127);
            decimal.setValue(127);
            assert.deepEqual(255, decimal._u8ToRawValue());
        });

        it("8bit, less than minimum value", () => {
            const decimal = new Decimal(-128, 127);
            try {
                decimal.setValue(-129);
                assert.fail();
            } catch (e) {
                assert.ok("Catch exception");
            }
        });

        it("8bit, more than maximum value", () => {
            const decimal = new Decimal(-128, 127);
            try {
                decimal.setValue(128);
                assert.fail();
            } catch (e) {
                assert.ok("Catch exception");
            }
        });

        it("With step", () => {
            const decimal = new Decimal(-1, 100, 0.1);
            decimal.setValue(100);
            assert.deepEqual(1010, decimal._u8ToRawValue());
        });
    });

    context("BitsValue", () => {
        it("8bit, max", () => {
            const decimal = new Decimal(-128, 127);
            const u8 = Decimal._toBuffer(255, decimal._byteLength);
            decimal.setBuffer(u8.buffer);
            assert.deepEqual(decimal._value, 127);
        });

        it("8bit, min", () => {
            const decimal = new Decimal(-128, 127);
            const u8 = Decimal._toBuffer(0, decimal._byteLength);
            decimal.setBuffer(u8.buffer);
            assert.deepEqual(-128, decimal._value);
        });

        it("With step, max", () => {
            const decimal = new Decimal(-128, 127, 0.1);
            const u8 = Decimal._toBuffer(2550, decimal._byteLength);
            decimal.setBuffer(u8.buffer);
            assert.deepEqual(127, decimal._value);
        });

        it("With step, min", () => {
            const decimal = new Decimal(-128, 127, 0.1);
            const u8 = Decimal._toBuffer(0, decimal._byteLength);
            decimal.setBuffer(u8.buffer);
            assert.deepEqual(-128, decimal._value);
        });
    });

    describe("Float", () => {
        context("constructor()", () => {
            it("double", () => {
                const float = new Float();
                assert.equal(64, float._bitLength);
            });

            it("single", () => {
                const float = new Float(false);
                assert.equal(32, float._bitLength);
            });
        });

        context("value", () => {
            it("double", () => {
                const float = new Float();
                float.setValue(1234567890);
                float.setBuffer(float.getBuffer());
                assert.equal(float._value, 1234567890);
            });

            it("single", () => {
                const float = new Float();
                float.setValue(1234567);
                float.setBuffer(float.getBuffer());
                assert.equal(float._value, 1234567);
            });
        });
    });

});
