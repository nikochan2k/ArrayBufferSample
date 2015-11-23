import Text from "./Text";
import LZString from "lz-string";

class LZText extends Text {
    private u8: Uint8Array;

    constructor() {
        super();
    }

    public get Text(): string {
        return this.value;
    }

    public set Text(value: string) {
        this.value = value;
        this.buffer = LZString.compressToUint8Array(value);
        this.numOfBytes = buffer.byteLength;
    }

    public get Buffer(): ArrayBuffer {
        return this.buffer;
    }

    public set Buffer(buffer: ArrayBuffer) {
        this.buffer = buffer;
        this.value = LZString.decompressFromUint8Array(this.u8);
    }
}

export default LZText;
