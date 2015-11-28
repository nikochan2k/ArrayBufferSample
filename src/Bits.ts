abstract class Bits {
    private buffer: ArrayBuffer;
    public byteLength: number;

    public getBuffer(): ArrayBuffer {
        return this.buffer;
    }

    public setBuffer(buffer: ArrayBuffer): void {
        this.buffer = buffer;
    }
}

export default Bits;
