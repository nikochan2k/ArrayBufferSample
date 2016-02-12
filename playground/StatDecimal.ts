import Binary from "../src/Binary";
import StatDecimal from "../src/StatDecimal";

const binary = new Binary(1);
const d = new StatDecimal(false, 100, 15, 1);
d.setValue(120);
d.write(binary);
