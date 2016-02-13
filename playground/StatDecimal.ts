import Binary from "../src/Binary";
import StatDecimal from "../src/StatDecimal";

const binary = new Binary(1);
const d = new StatDecimal(false, 100, 15, 1);
d.setValue(109);
d.write(binary);
binary.byteOffset = 0;
binary.bitOffset = 0;
d.read(binary);
