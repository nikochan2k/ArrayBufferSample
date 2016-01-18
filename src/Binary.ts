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

    writeU8(u8: Uint8Array, bitLength: number): void {
        // bitOffset     used          sum shift result             next
        // 1"oxxxxxxx" - 7"xooooooo" = 8   0     oooooooo           0
        // 1"oxxxxxxx" - 5"xxxooooo" = 6   -2    ooooooxx           6
        // 3"oooxxxxx" - 7"xooooooo" = 10  2     oooooooo ooxxxxxx  2
        const used = bitLength % 8;
        const sum = this.bitOffset + used;
        const shift = sum - 8;
        if (shift < 0) {
            this._writeU8WithLeftBitShift(u8, -shift);
        } else if (0 < shift) {
            this._writeU8WithRightBitShift(u8, shift);
        } else {
            this._writeU8WithoutBitShift(u8);
        }
        this.bitOffset = sum % 8;
    }

    _writeU8WithLeftBitShift(u8: Uint8Array, left: number): void {
        const right = 8 - left;
        for (let current = 0, length = u8.length; current < length;) {
            let temp = (u8[current++] << left) & 0xFF;
            if (current < length) {
                temp |= (u8[current] >> right);
            }
            this.u8[this.byteOffset] |= temp;
        }
    }

    _writeU8WithRightBitShift(u8: Uint8Array, right: number): void {
        const left = 8 - right;
        let temp = this.u8[this.byteOffset];
        for (let current = 0, length = u8.length; current < length;
            current++ , this.byteOffset++) {
            this.u8[this.byteOffset] = temp | (u8[current] >> right);
            temp = (u8[current] << left) & 0xFF;
        }
        this.u8[this.byteOffset] = temp;
    }

    _writeU8WithoutBitShift(u8: Uint8Array) {
        let current = 0;
        this.u8[this.byteOffset++] |= u8[current];
        for (current = 1, length = u8.length; current < length; current++) {
            this.u8[this.byteOffset++] = u8[current];
        }
    }

    readValue(bitLength: number): number {
        //                                                        left
        // instance                     bitOffset bitLength total total&8 right (total)/8
        // "xooxxxxx"                   1         2         3     3       5     0
        // "xxxooooo ooxxxxxx"          3         7         10    2       6     1
        // "xxxxxxoo oooooooo ooooooox" 6         17        23    7       1     2
        const total = this.bitOffset + bitLength;
        const left = total % 8;
        const right = 8 - left;
        const mask = 0xFF >> (8 - (bitLength % 8));
        let value = 0;
        for (let i = Math.ceil(total / 8) - 1; 0 <= i; i--) {
            const byteIndex = this.byteOffset + i;
            value |= this.u8[byteIndex] >> right;
            if (0 < i) {
                value |= (this.u8[byteIndex - 1] << left) & mask;
                value = value << 8;
            } else {
                value &= mask;
            }
        }
        this._forwardBits(bitLength);
        return value;
    }

    readBit(): number {
        const right = 7 - this.bitOffset;
        const bit = (this.u8[this.byteOffset] >> right) & 0x1;
        this._forwardBits(1);
        return bit;
    }

    _forwardBits(bitLength: number): void {
        const bitOffset = this.bitOffset + bitLength;
        this.bitOffset = bitOffset % 8;
        this.byteOffset += Math.floor(bitOffset / 8);
    }

}

export default Binary;
