import assert from "power-assert";
import Decimal from "../src/Decimal";

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

    context("NumOfBits", () => {
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

    context("Value", () => {
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

});
