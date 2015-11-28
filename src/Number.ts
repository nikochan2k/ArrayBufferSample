import Bits from "./Bits";

abstract class Number extends Bits {
    protected static isBigEndian: boolean;

    private value: number;
    public bitLength: number;

    constructor() {
        super();

        if (Number.isBigEndian == null) {
            return;
        }

        const buf = new ArrayBuffer(2);
        const u16 = new Uint16Array(buf);
        u16[0] = 1;
        const u8 = new Uint8Array(buf);
        Number.isBigEndian = (u8[0] === 0);
    }

    public getValue(): number {
        return this.value;
    }

    public setValue(value: number) {
        this.value = value;
    }
}

export default Number;
