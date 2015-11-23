import Text from "./Text";
import LZString from "lz-string";

class LZText extends Text {
    private u8: Uint8Array;

    constructor() {
        super();
    }

    public get text(): string {
        return this._text;
    }

    public set text(text: string) {
        this._text = text;
        this.buffer = LZString.compressToUint8Array(text);
        this.byteLength = buffer.byteLength;
    }

    public get Buffer(): ArrayBuffer {
        return this.buffer;
    }

    public set Buffer(buffer: ArrayBuffer) {
        this.buffer = buffer;
        this._text = LZString.decompressFromUint8Array(this.u8);
    }
}

export default LZText;
