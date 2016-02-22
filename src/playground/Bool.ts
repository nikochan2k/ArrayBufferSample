import Bool from "../main/Bool";
import Binary from "../main/Binary";

const binary = new Binary(2);
const u8 = binary._u8;
u8[0] = parseInt("10101101", 2);
u8[1] = parseInt("01100000", 2);

const b1 = new Bool(false);
b1.read(binary);
console.log(b1.value);

const b2 = new Bool(false);
b2.read(binary);
console.log(b2.value);

const b3 = new Bool(true);
b3.read(binary);
console.log(b3.value);

const b4 = new Bool(true);
b4.read(binary);
console.log(b4.value);

const b5 = new Bool(true);
b5.read(binary);
console.log(b5.value);

const b6 = new Bool(true);
b6.read(binary);
console.log(b6.value);

const b7 = new Bool(true);
b7.read(binary);
console.log(b7.value);

const b8 = new Bool(true);
b8.read(binary);
console.log(b8.value);
