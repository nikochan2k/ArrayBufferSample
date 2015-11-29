abstract class Bits {
    _u8: Uint8Array;
    _optional: boolean;

    constructor(optional: boolean) {
        this._optional = optional;
    }

    abstract setBuffer(buffer: ArrayBuffer): void;

    getBuffer(): ArrayBuffer {
        return this._u8.buffer;
    }
}

export default Bits;
