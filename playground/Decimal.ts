import Decimal from "../src/Decimal";
import Binary from "../src/Binary";

const binary = new Binary(3);
const decimal = new Decimal(false, 0, 1023);
decimal.setValue(682);
decimal.write(binary);
decimal.setValue(1023);
decimal.write(binary);
