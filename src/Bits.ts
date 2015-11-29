abstract class Bits {
    _byteLength: number;
    _u8: Uint8Array;

    abstract setBuffer(buffer: ArrayBuffer): void;

    getBuffer(): ArrayBuffer {
        return this._u8.buffer;
    }
}

export default Bits;
