import Bits from "./Bits";

abstract class Number extends Bits {
    protected static isBigEndian: boolean;

    public value: number;
    public bitLength: number;

    constructor(bitLength: number) {
        super();
        this.bitLength = bitLength;
        this.byteLength = Math.ceil(bitLength / 8);

        if (Number.isBigEndian == null) {
            return;
        }

        const buf = new ArrayBuffer(2);
        const u16 = new Uint16Array(buf);
        u16[0] = 1;
        const u8 = new Uint8Array(buf);
        Number.isBigEndian = (u8[0] === 0);
    }
}

export default Number;
