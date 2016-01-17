import Text from "./Text";
import Binary from "./Binary";
import LZString from "lz-string";

class LZText extends Text {
    constructor(optional: boolean) {
        super(optional);
    }

    _forward(binary: Binary) {
        if (0 < binary.bitOffset) {
            binary.bitOffset = 0;
            binary.byteOffset++;
        }
    }

    write(binary: Binary) {
        this._forward(binary);
        const u8 = LZString.compressToUint8Array(this.getValue());
        let i = 0;
        while (i < u8.length) {
            binary.u8[binary.byteOffset++] = u8[i++];
        }
    }

    read(binary: Binary): void {
        this._forward(binary);
        const u8 = new Uint8Array(binary.buffer, binary.byteOffset);
        this.setValue(LZString.decompressFromUint8Array(u8));
    }

}

export default LZText;
