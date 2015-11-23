abstract class Bits {
    protected static isBigEndian: boolean;

    static initialize(): void {
        const buf = new ArrayBuffer(2);
        const u16 = new Uint16Array(buf);
        u16[0] = 1;
        const u8 = new Uint8Array(buf);
        Bits.isBigEndian = (u8[0] === 0);
    }

    protected numOfBytes: number;
    protected buffer: ArrayBuffer;

    public get Buffer() {
        return this.buffer;
    }
}
Bits.initialize();

export default Bits;
