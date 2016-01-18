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

    context("2 bytes", () => {
        const binary = new Binary(2);
        const b = new Bool(true);
        b.setValue(false);
        b.write(binary);
        b.write(binary);
        b.write(binary);
        b.write(binary);
        b.write(binary);

        it("byteOffset", () => {
            assert.equal(binary.byteOffset, 1);
        });

        it("bitOffset", () => {
            assert.equal(binary.bitOffset, 2);
        });

        it("value", () => {
            assert.equal(binary.u8[0], parseInt("10101010", 2));
            assert.equal(binary.u8[1], parseInt("10000000", 2));
        });
    });

    context("read", () => {
        const binary = new Binary(2);
        const u8 = binary.u8;
        u8[0] = parseInt("10101101", 2);
        u8[1] = parseInt("01100000", 2);

        it("true", () => {
            const b1 = new Bool(false);
            b1.read(binary);
            assert.equal(b1.getValue(), true);
        });

        it("false", () => {
            const b2 = new Bool(false);
            b2.read(binary);
            assert.equal(b2.getValue(), false);
        });

        it("nullable, false", () => {
            const b3 = new Bool(true);
            b3.read(binary);
            assert.equal(b3.getValue(), false);
        });

        it("nullable, true", () => {
            const b4 = new Bool(true);
            b4.read(binary);
            assert.equal(b4.getValue(), true);
        });

        it("nullable, null", () => {
            const b5 = new Bool(true);
            b5.read(binary);
            assert.equal(b5.getValue(), undefined);
        });

        it("nullable, false, again", () => {
            const b6 = new Bool(true);
            b6.read(binary);
            assert.equal(b6.getValue(), false);
        });

        it("nullable, true, again", () => {
            const b7 = new Bool(true);
            b7.read(binary);
            assert.equal(b7.getValue(), true);
        });

        it("nullable, null, again", () => {
            const b8 = new Bool(true);
            b8.read(binary);
            assert.equal(b8.getValue(), undefined);
        });
    });

});
