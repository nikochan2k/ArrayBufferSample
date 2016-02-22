import Binary from "../main/Binary";
import Float from "../main/Float";

const binary = new Binary(4);
const fw = new Float(false, false);
fw.value = 1234567;
fw.write(binary);
binary._byteOffset = 0;
const fr = new Float(false, false);
fr.read(binary);
