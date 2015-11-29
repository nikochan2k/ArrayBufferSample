abstract class Bits {
    byteLength: number;
    u8: Uint8Array;
    abstract setBuffer(buffer: ArrayBuffer): void;
}

export default Bits;
