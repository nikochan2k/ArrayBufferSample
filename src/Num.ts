import Bits from "./Bits";

abstract class Num extends Bits<number> {
    static _isBigEndian: boolean;

    constructor(nullable: boolean) {
        if (Num._isBigEndian == null) {
            const buf = new ArrayBuffer(2);
            const u16 = new Uint16Array(buf);
            u16[0] = 1;
            const u8 = new Uint8Array(buf);
            Num._isBigEndian = (u8[0] === 0);
        }

        super(nullable);
    }

    _decimalLen(value: number): number {
        const str = value.toString();
        const index = str.indexOf(".");
        if (index === -1) {
            return 0;
        }
        return str.length - index - 1;
    }

    _computeBitLength(num: number): number {
        const bitLength = Math.ceil(Math.log(num) / Math.LN2);
        return 0 < bitLength ? bitLength : 1;
    }
}

export default Num;
