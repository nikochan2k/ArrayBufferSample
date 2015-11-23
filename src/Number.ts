import Bits from "./Bits";

abstract class Number extends Bits {
    protected numOfBits: number;
    protected value: number;
    protected bitsValue: number;

    public get NumOfBits(): number {
        return this.numOfBits;
    }

    protected handleEndian(buf: ArrayBuffer): void {
        if (Bits.isBigEndian) {
            return;
        }

        this.swap(buf, 0, 7);
        this.swap(buf, 1, 6);
        this.swap(buf, 2, 5);
        this.swap(buf, 3, 4);
    }

    private swap(buf: ArrayBuffer, lhs: number, rhs: number): void {
        const u8 = new Uint8Array(buf);
        const temp = u8[lhs];
        u8[lhs] = u8[rhs];
        u8[rhs] = temp;
    }
}

export default Number;
