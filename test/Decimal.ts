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
            const range = new Decimal(0, 1);
            assert.deepEqual(1, range.bitLength);
        });

        it("from 0 to 2", () => {
            const range = new Decimal(0, 2);
            assert.deepEqual(2, range.bitLength);
        });

        it("from -32768 to 32767", () => {
            const range = new Decimal(-32768, 32767);
            assert.deepEqual(16, range.bitLength);
        });

        it("from -32768 to 32768", () => {
            const range = new Decimal(-32768, 32768);
            assert.deepEqual(17, range.bitLength);
        });

        it("from -2147483648 to 2147483647", () => {
            const range = new Decimal(-2147483648, 2147483647);
            assert.deepEqual(32, range.bitLength);
        });

        it("from -2147483648 to 2147483648", () => {
            const range = new Decimal(-2147483648, 2147483648);
            assert.deepEqual(33, range.bitLength);
        });

        it("the max of float64", () => {
            const range = new Decimal(0, 9007199254740991);
            assert.deepEqual(53, range.bitLength);
        });
    });

    context("Value", () => {
        it("8bit, center value", () => {
            const range = new Decimal(-128, 127);
            range.value = 0;
            assert.deepEqual(128, range.bitsValue);
        });

        it("8bit, minimum value", () => {
            const range = new Decimal(-128, 127);
            range.value = -128;
            assert.deepEqual(0, range.bitsValue);
        });

        it("8bit, maximum value", () => {
            const range = new Decimal(-128, 127);
            range.value = 127;
            assert.deepEqual(255, range.bitsValue);
        });

        it("8bit, less than minimum value", () => {
            const range = new Decimal(-128, 127);
            try {
                range.value = -129;
                assert.fail();
            } catch (e) {
                assert.ok("Catch exception");
            }
        });

        it("8bit, more than maximum value", () => {
            const range = new Decimal(-128, 127);
            try {
                range.value = 128;
                assert.fail();
            } catch (e) {
                assert.ok("Catch exception");
            }
        });

        it("With step", () => {
            const range = new Decimal(-1, 100, 0.1);
            range.value = 100;
            assert.deepEqual(1010, range.bitsValue);
        });
    });

    context("BitsValue", () => {
        it("8bit, max", () => {
            const range = new Decimal(-128, 127);
            range.bitsValue = 255;
            assert.deepEqual(127, range.value);
        });

        it("8bit, min", () => {
            const range = new Decimal(-128, 127);
            range.bitsValue = 0;
            assert.deepEqual(-128, range.value);
        });

        it("With step, max", () => {
            const range = new Decimal(-128, 127, 0.1);
            range.bitsValue = 2550;
            assert.deepEqual(127, range.value);
        });

        it("With step, min", () => {
            const range = new Decimal(-128, 127, 0.1);
            range.bitsValue = 0;
            assert.deepEqual(-128, range.value);
        });
    });

    describe("Float", () => {
        context("constructor()", () => {
            it("double", () => {
                const float = new Float();
                assert.equal(64, float.bitLength);
            });

            it("single", () => {
                const float = new Float(false);
                assert.equal(32, float.bitLength);
            });
        });

        context("value", () => {
            it("double", () => {
                const float = new Float();
                float.value = 1234567890;
                assert.equal(float.value, float.bitsValue);
            });

            it("single", () => {
                const float = new Float();
                float.value = 1234567;
                assert.equal(float.value, float.bitsValue);
            });
        });
    });

});
