import Bits from "./Bits";

abstract class Num extends Bits {
    static _isBigEndian: boolean;

    _value: number;
    _byteLength: number;

    constructor(optional: boolean, bitLength: number) {
        super(optional, bitLength);
        this._bitLength = bitLength;
        this._byteLength = Math.ceil(bitLength / 8);

        if (Num._isBigEndian == null) {
            return;
        }

        const buf = new ArrayBuffer(2);
        const u16 = new Uint16Array(buf);
        u16[0] = 1;
        const u8 = new Uint8Array(buf);
        Num._isBigEndian = (u8[0] === 0);
    }

    abstract setValue(value: number): void;

    getValue(): number {
        return this._value;
    }
}

export default Num;
