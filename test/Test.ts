import Decimal from "../src/Decimal";

const range = new Decimal(-128, 127);
range.Value = 0;
console.log(range.Value);
console.log(range.BitsValue);
