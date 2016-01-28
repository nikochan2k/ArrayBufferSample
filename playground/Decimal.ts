import Decimal from "../src/Decimal";
import Binary from "../src/Binary";

const binary = new Binary(2);
const u8 = binary.u8;
u8[0] = parseInt("11111111", 2);
u8[1] = parseInt("11100000", 2);
const d = new Decimal(false, -1024, 1023);
d.read(binary);
