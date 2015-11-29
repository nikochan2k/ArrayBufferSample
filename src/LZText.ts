import Text from "./Text";
import LZString from "lz-string";

class LZText extends Text {
    constructor() {
        super();
    }

    public setText(text: string): void {
        this.text = text;
        this.u8 = LZString.compressToUint8Array(text);
    }

    public setBuffer(buffer: ArrayBuffer): void {
        this.u8 = new Uint8Array(buffer);
        this.text = LZString.decompressFromUint8Array(this.u8);
    }
}

export default LZText;
