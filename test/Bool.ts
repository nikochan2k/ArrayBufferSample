import assert from "power-assert";
import Bool from "../src/Bool";
import Binary from "../src/Binary";

describe("Bool", () => {

    context("set and get value", () => {
        const b = new Bool(false);

        it("undefined", () => {
            const value = b.getValue();
            assert.equal(value, undefined);
        });

        it("true", () => {
            b.setValue(true);
            const value = b.getValue();
            assert.equal(value, true);
        });

        it("false", () => {
            b.setValue(false);
            const value = b.getValue();
            assert.equal(value, false);
        });

    });

    context("set true and write", () => {
        const binary = new Binary(1);
        const b = new Bool(false);
        b.setValue(true);
        b.write(binary);

        it("byteOffset", () => {
            assert.equal(binary.byteOffset, 0);
        });

        it("bitOffset", () => {
            assert.equal(binary.bitOffset, 1);
        });

        it("value", () => {
            assert.equal(binary.u8[0], parseInt("10000000", 2));
        });
    });

    context("set false and write, then set true and write", () => {
        const binary = new Binary(1);
        const b1 = new Bool(false);
        b1.setValue(false);
        b1.write(binary);
        const b2 = new Bool(false);
        b2.setValue(true);
        b2.write(binary);

        it("byteOffset", () => {
            assert.equal(binary.byteOffset, 0);
        });

        it("bitOffset", () => {
            assert.equal(binary.bitOffset, 2);
        });

        it("value", () => {
            assert.equal(binary.u8[0], parseInt("01000000", 2));
        });
    });

    context("nullable", () => {
        const binary = new Binary(1);
        const b0 = new Bool(true);
        b0.setValue(false);
        b0.write(binary);
        const b1 = new Bool(true);
        b1.write(binary);
        const b2 = new Bool(true);
        b2.setValue(true);
        b2.write(binary);

        it("byteOffset", () => {
            assert.equal(binary.byteOffset, 0);
        });

        it("bitOffset", () => {
            assert.equal(binary.bitOffset, 5);
        });

        it("value", () => {
            assert.equal(binary.u8[0], parseInt("10011000", 2));
        });
    });

});
