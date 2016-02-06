import Binary from "../src/Binary";
import VarBitDecimal from "../src/VarBitDecimal";

const binary = new Binary(1);
const dw = new VarBitDecimal(false, 0, 255);
dw.setValue(1);
dw.write(binary);
