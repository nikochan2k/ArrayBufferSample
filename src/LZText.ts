import Text from "./Text";
import LZString from "lz-string";

class LZText extends Text {
    constructor() {
        super();
    }

    setText(text: string): void {
        this.text = text;
        this._u8 = LZString.compressToUint8Array(text);
    }

    setBuffer(buffer: ArrayBuffer): void {
        this._u8 = new Uint8Array(buffer);
        this.text = LZString.decompressFromUint8Array(this._u8);
    }
}

export default LZText;
