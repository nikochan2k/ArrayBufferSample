import Bool from "../src/Bool";
import Binary from "../src/Binary";

const binary = new Binary(2);
const u8 = binary.u8;
u8[0] = parseInt("10101101", 2);
u8[1] = parseInt("01100000", 2);

const b1 = new Bool(false);
b1.read(binary);
console.log(b1.getValue());

const b2 = new Bool(false);
b2.read(binary);
console.log(b2.getValue());

const b3 = new Bool(true);
b3.read(binary);
console.log(b3.getValue());

const b4 = new Bool(true);
b4.read(binary);
console.log(b4.getValue());

const b5 = new Bool(true);
b5.read(binary);
console.log(b5.getValue());

const b6 = new Bool(true);
b6.read(binary);
console.log(b6.getValue());

const b7 = new Bool(true);
b7.read(binary);
console.log(b7.getValue());

const b8 = new Bool(true);
b8.read(binary);
console.log(b8.getValue());
