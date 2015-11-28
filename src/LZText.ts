import Text from "./Text";
import LZString from "lz-string";

class LZText extends Text {
    constructor() {
        super();
    }

    public setText(text: string): void {
        super.setText(text);
        const u8 = LZString.compressToUint8Array(text);
        super.setBuffer(u8.buffer);
    }

    public setBuffer(buffer: ArrayBuffer): void {
        super.setBuffer(buffer);
        const u8 = new Uint8Array(buffer);
        const text = LZString.decompressFromUint8Array(u8);
        super.setText(text);
    }
}

export default LZText;
