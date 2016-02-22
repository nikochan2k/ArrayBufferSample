import Binary from "../main/Binary";
import StatDecimal from "../main/StatDecimal";

const binary = new Binary(1);
const d = new StatDecimal(false, 100, 15, 1);
d.value = 109;
d.write(binary);
binary._byteOffset = 0;
binary._bitOffset = 0;
d.read(binary);
