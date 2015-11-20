import BitsType from "./BitsType";

abstract class Bits {
    protected static isBigEndian: boolean;

    static initialize(): void {
        if (Bits.isBigEndian == null) {
            const buf = new ArrayBuffer(2);
            const uint16 = new Uint16Array(buf);
            uint16[0] = 1;
            const uint8 = new Uint8Array(buf);
            Bits.isBigEndian = (uint8[0] === 0);
        }
    }

    protected bitsType: BitsType;
    protected buffer: ArrayBuffer;

    public get BitsType(): BitsType {
        return this.bitsType;
    }

    public get Buffer() {
        return this.buffer;
    }
}
Bits.initialize();

export default Bits;
