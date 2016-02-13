import Binary from "../src/Binary";
import StatDecimal from "../src/StatDecimal";

const binary = new Binary(1);
const d = new StatDecimal(false, 100, 15, 1);
d.setValue(109);
d.write(binary);
binary._byteOffset = 0;
binary._bitOffset = 0;
d.read(binary);
