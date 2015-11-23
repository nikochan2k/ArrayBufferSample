const buffer = new ArrayBuffer(8);
const double = new Float64Array(buffer);
const uint8 = new Uint8Array(buffer);
double[0] = 255E0;
printU8(uint8);
double[0] = 65535;
printU8(uint8);
const max = Math.pow(2, 53) - 1;
double[0] = max;
printU8(uint8);

function printU8(u8: Uint8Array): void {
    "use strict";
    let str = "";
    for (let i = 7; i >= 0; i--) {
        let tmp = u8[i].toString(2);
        for (let j = tmp.length; j < 8; j++) {
            tmp = "0" + tmp;
        }
        str += tmp + " ";
    }
    console.log(str);
}
