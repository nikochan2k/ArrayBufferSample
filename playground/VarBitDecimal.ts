import Binary from "../src/Binary";
import VarBitDecimal from "../src/VarBitDecimal";

const binary = new Binary(4);
binary.u8[0] = parseInt("00001000", 2);
binary.u8[1] = parseInt("11000101", 2);
binary.u8[2] = parseInt("01000000", 2);
const d = new VarBitDecimal(false, 0, 65535);
d.read(binary);
d.read(binary);
d.read(binary);
