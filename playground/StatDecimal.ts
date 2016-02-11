import assert from "power-assert";
import Binary from "../src/Binary";
import StatDecimal from "../src/StatDecimal";

const binary = new Binary(1);
const d = new StatDecimal(false, 100, 15, 1);
d.setValue(93);
d.write(binary);
assert.equal(binary.u8[0], parseInt("00101110", 2));
