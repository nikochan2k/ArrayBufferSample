import Text from "./Text";
import LZString from "lz-string";

class LZText extends Text {
    constructor() {
        super();
    }

    public setText(text: string): void {
        this.text = text;
        const u8 = LZString.compressToUint8Array(text);
        this.buffer = u8.buffer;
    }

    public setBuffer(buffer: ArrayBuffer): void {
        this.buffer = buffer;
        const u8 = new Uint8Array(buffer);
        const text = LZString.decompressFromUint8Array(u8);
        this.text = text;
    }
}

export default LZText;
