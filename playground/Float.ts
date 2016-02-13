import Binary from "../src/Binary";
import Float from "../src/Float";

const binary = new Binary(4);
const fw = new Float(false, false);
fw.setValue(1234567);
fw.write(binary);
binary._byteOffset = 0;
const fr = new Float(false, false);
fr.read(binary);
