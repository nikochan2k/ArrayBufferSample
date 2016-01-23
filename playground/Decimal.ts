import Decimal from "../src/Decimal";
import Binary from "../src/Binary";

const binary = new Binary(2);
const decimal = new Decimal(false, 0, 4095);
decimal.setValue(4095);
decimal.write(binary);
