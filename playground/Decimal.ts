import Decimal from "../src/Decimal";
import Binary from "../src/Binary";

const binary = new Binary(2);
const decimal = new Decimal(false, -16, 15);
decimal.setValue(0);
decimal.write(binary);
console.log(binary.u8[0]);
