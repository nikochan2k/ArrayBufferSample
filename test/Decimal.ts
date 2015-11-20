/// <reference path="../typings/tsd.d.ts" />

import assert from "power-assert";
import Decimal from "../src/Decimal";
import Float from "../src/Float";
import BitsType from "../src/BitsType";

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
            assert.deepEqual(1, range.NumOfBits);
            assert.deepEqual(BitsType.uint8, range.BitsType);
        });

        it("from 0 to 2", () => {
            const range = new Decimal(0, 2);
            assert.deepEqual(2, range.NumOfBits);
            assert.deepEqual(BitsType.uint8, range.BitsType);
        });

        it("from -32768 to 32767", () => {
            const range = new Decimal(-32768, 32767);
            assert.deepEqual(16, range.NumOfBits);
            assert.deepEqual(BitsType.uint16, range.BitsType);
        });

        it("from -32768 to 32768", () => {
            const range = new Decimal(-32768, 32768);
            assert.deepEqual(17, range.NumOfBits);
            assert.deepEqual(BitsType.uint32, range.BitsType);
        });

        it("from -2147483648 to 2147483647", () => {
            const range = new Decimal(-2147483648, 2147483647);
            assert.deepEqual(32, range.NumOfBits);
            assert.deepEqual(BitsType.uint32, range.BitsType);
        });

        it("from -2147483648 to 2147483648", () => {
            const range = new Decimal(-2147483648, 2147483648);
            assert.deepEqual(33, range.NumOfBits);
            assert.deepEqual(BitsType.float64, range.BitsType);
        });

        it("the max of float64", () => {
            const range = new Decimal(0, 9007199254740991);
            assert.deepEqual(53, range.NumOfBits);
            assert.deepEqual(BitsType.float64, range.BitsType);
        });
    });

    context("Value", () => {
        it("8bit, center value", () => {
            const range = new Decimal(-128, 127);
            range.Value = 0;
            assert.deepEqual(128, range.BitsValue);
        });

        it("8bit, minimum value", () => {
            const range = new Decimal(-128, 127);
            range.Value = -128;
            assert.deepEqual(0, range.BitsValue);
        });

        it("8bit, maximum value", () => {
            const range = new Decimal(-128, 127);
            range.Value = 127;
            assert.deepEqual(255, range.BitsValue);
        });

        it("8bit, less than minimum value", () => {
            const range = new Decimal(-128, 127);
            try {
                range.Value = -129;
                assert.fail();
            } catch (e) {
                assert.ok("Catch exception");
            }
        });

        it("8bit, more than maximum value", () => {
            const range = new Decimal(-128, 127);
            try {
                range.Value = 128;
                assert.fail();
            } catch (e) {
                assert.ok("Catch exception");
            }
        });

        it("With step", () => {
            const range = new Decimal(-1, 100, 0.1);
            range.Value = 100;
            assert.deepEqual(1010, range.BitsValue);
        });
    });

    context("BitsValue", () => {
        it("8bit, max", () => {
            const range = new Decimal(-128, 127);
            range.BitsValue = 255;
            assert.deepEqual(127, range.Value);
        });

        it("8bit, min", () => {
            const range = new Decimal(-128, 127);
            range.BitsValue = 0;
            assert.deepEqual(-128, range.Value);
        });

        it("With step, max", () => {
            const range = new Decimal(-128, 127, 0.1);
            range.BitsValue = 2550;
            assert.deepEqual(127, range.Value);
        });

        it("With step, min", () => {
            const range = new Decimal(-128, 127, 0.1);
            range.BitsValue = 0;
            assert.deepEqual(-128, range.Value);
        });
    });

    describe("Float", () => {
        context("constructor()", () => {
            it("double", () => {
                const float = new Float();
                assert.equal(BitsType.float64, float.BitsType);
                assert.equal(64, float.NumOfBits);
            });

            it("single", () => {
                const float = new Float(false);
                assert.equal(BitsType.float32, float.BitsType);
                assert.equal(32, float.NumOfBits);
            });
        });

        context("value", () => {
            it("double", () => {
                const float = new Float();
                float.Value = 1234567890;
                assert.equal(float.Value, float.BitsValue);
            });

            it("single", () => {
                const float = new Float();
                float.Value = 1234567;
                assert.equal(float.Value, float.BitsValue);
            });
        });
    });

});
