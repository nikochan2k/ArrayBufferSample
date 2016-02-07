import Binary from "../src/Binary";
import VarBitDecimal from "../src/VarBitDecimal";

const binary = new Binary(5);
const d = new VarBitDecimal(false, 0, 65535);
d.setValue(1);
d.write(binary);
d.setValue(2);
d.write(binary);
d.setValue(5);
d.write(binary);
d.setValue(65535);
d.write(binary);
console.log(binary.u8[0].toString(2))
console.log(binary.u8[1].toString(2))
console.log(binary.u8[2].toString(2))
console.log(binary.u8[3].toString(2))
binary.byteOffset = 0;
binary.bitOffset = 0;
d.read(binary);
d.read(binary);
d.read(binary);
