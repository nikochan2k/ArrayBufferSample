import assert from "power-assert";
import Binary from "../src/Binary";
import StatDecimal from "../src/StatDecimal";

describe("StatDecimal", () => {
    context("control bit length", () => {

        it("mean=100, sigma=15, value=109", () => {
            const binary = new Binary(1);
            const d = new StatDecimal(false, 100, 15, 1);
            d.setValue(109);
            d.write(binary);
            assert.equal(binary.u8[0], parseInt("00010010", 2));
        });

        it("mean=100, sigma=15, value=93", () => {
            const binary = new Binary(1);
            const d = new StatDecimal(false, 100, 15, 1);
            d.setValue(93);
            d.write(binary);
            assert.equal(binary.u8[0], parseInt("00101110", 2));
        });

        it("mean=100, sigma=15, value=120", () => {
            const binary = new Binary(1);
            const d = new StatDecimal(false, 100, 15, 1);
            d.setValue(120);
            d.write(binary);
            assert.equal(binary.u8[0], parseInt("01010100", 2));
        });

    });

});
