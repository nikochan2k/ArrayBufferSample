import Binary from "../src/Binary";
import VarBitDecimal from "../src/VarBitDecimal";

function toBinary(value: number): string {
    'use strict';
    let result = value.toString(2);
    for (let i = result.length; i < 8; i++) {
        result = "0" + result;
    }
    return result;
}

function log(binary: Binary) {
    'use strict';
    console.log("bitOffset: " + binary.bitOffset);
    console.log("byteOffset: " + binary.byteOffset);
    for (let i = 0; i <= binary.byteOffset; i++) {
        console.log("u[" + i + "]: " + toBinary(binary.u8[i]));
    }
}

const binary = new Binary(20);
const d = new VarBitDecimal(true, 0, 9007199254740991);
log(binary);
d.write(binary);
log(binary);
d.setValue(1);
d.write(binary);
log(binary);
d.setValue(2);
d.write(binary);
log(binary);
d.setValue(5);
d.write(binary);
log(binary);
d.setValue(65535);
d.write(binary);
log(binary);
d.setValue(9007199254740991);
d.write(binary);
log(binary);
binary.byteOffset = 0;
binary.bitOffset = 0;
log(binary);
console.log(d.getValue());
d.read(binary);
log(binary);
console.log(d.getValue());
d.read(binary);
log(binary);
console.log(d.getValue());
d.read(binary);
log(binary);
console.log(d.getValue());
d.read(binary);
log(binary);
console.log(d.getValue());
d.read(binary);
log(binary);
console.log(d.getValue());
d.read(binary);
log(binary);
console.log(d.getValue());
