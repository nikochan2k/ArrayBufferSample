import Bits from "./Bits";

abstract class Number extends Bits {
    public bitLength: number;
    protected _value: number;
    protected _bitsValue: number;

    protected swap(buffer: ArrayBuffer): void {
        if (Bits.isBigEndian) {
            return;
        }

        const byteLength = buffer.byteLength;
        const end = byteLength / 2;
        for (let lhs = 0; lhs < end; lhs++) {
            const rhs = byteLength - lhs - 1;
            this.swapByte(buffer, lhs, rhs);
        }
    }

    private swapByte(buffer: ArrayBuffer, lhs: number, rhs: number): void {
        const u8 = new Uint8Array(buffer);
        const temp = u8[lhs];
        u8[lhs] = u8[rhs];
        u8[rhs] = temp;
    }
}

export default Number;
