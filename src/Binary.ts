class Binary {

    buffer: ArrayBuffer;
    u8: Uint8Array;
    byteOffset: number;
    bitOffset: number;

    constructor(byteLength: number) {
        this.buffer = new ArrayBuffer(byteLength);
        this.u8 = new Uint8Array(this.buffer);
        this.byteOffset = 0;
        this.bitOffset = 0;
    }

}

export default Binary;
