import assert from "power-assert";
import Binary from "../src/Binary";
import StatDecimal from "../src/StatDecimal";

describe("StatDecimal", () => {

    context("write value", () => {

        it("mean=100, sigma=15, value=109", () => {
            const binary = new Binary(1);
            const d = new StatDecimal(false, 100, 15, 1);
            d.setValue(109);
            d.write(binary);
            assert.equal(binary._u8[0], parseInt("01010010", 2));
        });

        it("mean=100, sigma=15, value=93", () => {
            const binary = new Binary(1);
            const d = new StatDecimal(false, 100, 15, 1);
            d.setValue(93);
            d.write(binary);
            assert.equal(binary._u8[0], parseInt("00111100", 2));
        });

        it("mean=100, sigma=15, value=120", () => {
            const binary = new Binary(1);
            const d = new StatDecimal(false, 100, 15, 1);
            d.setValue(120);
            d.write(binary);
            assert.equal(binary._u8[0], parseInt("10010100", 2));
        });

        it("mean=100, sigma=15, value=143", () => {
            const binary = new Binary(2);
            const d = new StatDecimal(false, 100, 15, 1);
            d.setValue(143);
            d.write(binary);
            assert.equal(binary._u8[0], parseInt("11000101", 2));
            assert.equal(binary._u8[1], parseInt("01100000", 2));
        });

    });

    context("write and read value", () => {

        it("mean=100, sigma=15, value=109", () => {
            const binary = new Binary(1);
            const d = new StatDecimal(false, 100, 15, 1);
            d.setValue(109);
            d.write(binary);
            binary._byteOffset = 0;
            binary._bitOffset = 0;
            d.read(binary);
            assert.equal(d.getValue(), 109);
        });

        it("mean=100, sigma=15, value=93", () => {
            const binary = new Binary(1);
            const d = new StatDecimal(false, 100, 15, 1);
            d.setValue(93);
            d.write(binary);
            binary._byteOffset = 0;
            binary._bitOffset = 0;
            d.read(binary);
            assert.equal(d.getValue(), 93);
        });

        it("mean=100, sigma=15, value=120", () => {
            const binary = new Binary(1);
            const d = new StatDecimal(false, 100, 15, 1);
            d.setValue(120);
            d.write(binary);
            binary._byteOffset = 0;
            binary._bitOffset = 0;
            d.read(binary);
            assert.equal(d.getValue(), 120);
        });

        it("mean=100, sigma=15, value=143", () => {
            const binary = new Binary(2);
            const d = new StatDecimal(false, 100, 15, 1);
            d.setValue(143);
            d.write(binary);
            binary._byteOffset = 0;
            binary._bitOffset = 0;
            d.read(binary);
            assert.equal(d.getValue(), 143);
        });

    });

    context("write and read values", () => {
        const binary = new Binary(4);
        const d = new StatDecimal(false, 100, 15, 1);
        d.setValue(109);
        d.write(binary);
        d.setValue(93);
        d.write(binary);
        d.setValue(120);
        d.write(binary);
        d.setValue(143);
        d.write(binary);
        binary._byteOffset = 0;
        binary._bitOffset = 0;

        it("mean=100, sigma=15, value=109", () => {
            d.read(binary);
            assert.equal(d.getValue(), 109);
        });

        it("mean=100, sigma=15, value=93", () => {
            d.read(binary);
            assert.equal(d.getValue(), 93);
        });

        it("mean=100, sigma=15, value=120", () => {
            d.read(binary);
            assert.equal(d.getValue(), 120);
        });

        it("mean=100, sigma=15, value=143", () => {
            d.read(binary);
            assert.equal(d.getValue(), 143);
        });

    });

});
