import Bits from "./Bits";

abstract class Num extends Bits {
    static _isBigEndian: boolean;

    private _value: number;

    constructor(nullable: boolean, controlBitLength: number) {
        super(nullable, controlBitLength);

        if (Num._isBigEndian == null) {
            return;
        }

        const buf = new ArrayBuffer(2);
        const u16 = new Uint16Array(buf);
        u16[0] = 1;
        const u8 = new Uint8Array(buf);
        Num._isBigEndian = (u8[0] === 0);
    }

    _decimalLen(value: number): number {
        const str = value.toString();
        const index = str.indexOf(".");
        if (index === -1) {
            return 0;
        }
        return str.length - index - 1;
    }

    _computeBitLength(value: number): number {
        return Math.floor(Math.log(value) / Math.LN2) + 1;
    }

    getValue(): number {
        return this._value;
    }

    setValue(value: number) {
        this._value = value;
    }
}

export default Num;
