import Binary from "../src/Binary";
import Float from "../src/Float";

const binary = new Binary(4);
const fw = new Float(false, false);
fw.setValue(1234567);
fw.write(binary);
