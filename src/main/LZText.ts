/// <reference path="../../typings/lz-string/lz-string.d.ts"/>

import Text from "./Text";
import Binary from "./Binary";

class LZText extends Text {
    constructor(optional: boolean) {
        super(optional);
    }

    _forward(binary: Binary) {
        if (0 < binary._bitOffset) {
            binary._bitOffset = 0;
            binary._byteOffset++;
        }
    }

    write(binary: Binary) {
        this._forward(binary);
        const u8 = LZString.compressToUint8Array(this.value);
        let i = 0;
        while (i < u8.length) {
            binary._u8[binary._byteOffset++] = u8[i++];
        }
    }

    read(binary: Binary): void {
        this._forward(binary);
        const u8 = new Uint8Array(binary._u8.buffer, binary._byteOffset);
        this.value = LZString.decompressFromUint8Array(u8);
    }

}

export default LZText;
