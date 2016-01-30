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
        const nextBitOffset = sum % 8;
        if (nextBitOffset !== 0) {
            const shift = sum - 8;
            if (shift < 0) {
                this._writeU8WithLeftBitShift(u8, -shift);
            } else {
                this._writeU8WithRightBitShift(u8, shift);
            }
        } else {
            this._writeU8WithoutBitShift(u8);
        }
        this.bitOffset = nextBitOffset;
    }

    _writeU8WithLeftBitShift(u8: Uint8Array, left: number): void {
        const right = 8 - left;
        for (let current = 0, length = u8.length; current < length;) {
            let temp = (u8[current++] << left) & 0xFF;
            if (current < length) {
                temp |= (u8[current] >> right);
            }
            this.u8[this.byteOffset++] |= temp;
        }
        this.byteOffset--;
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

    readU8(bitLength: number): Uint8Array {
        //                                                        left          byteLength
        // instance                     bitOffset bitLength total total%8 right Math.ceil(total/8)
        // "xooxxxxx"                   1         2         3     3       5     1
        // "oooooooo"                   0         8         8     0       8     1
        // "xxxooooo oooxxxxx"          3         8         11    3       5     2
        // "xxxxxxxo oooooooo oxxxxxxx" 7         10        17    1       7     3
        // "xxxxxxoo oooooooo ooooooox" 6         17        23    7       1     3
        const total = this.bitOffset + bitLength;
        const left = total % 8;
        const right = (left !== 0 ? 8 - left : 0);
        const byteLength = Math.ceil(total / 8);
        const buffer = new ArrayBuffer(byteLength);
        const u8 = new Uint8Array(buffer);
        let temp = this.u8[this.byteOffset] & (0xFF >> this.bitOffset);
        for (let i = 0; i < byteLength;) {
            u8[i++] |= temp >> right;
            if (i < byteLength) {
                u8[i] = temp << left;
                temp = this.u8[++this.byteOffset];
            }
        }
        this._forwardBits(bitLength);
        return u8;
    }

    readBit(): number {
        const right = 7 - this.bitOffset;
        const bit = (this.u8[this.byteOffset] >> right) & 0x1;
        this._forwardBits(1);
        if (this.bitOffset === 0) {
            this.byteOffset++;
        }
        return bit;
    }

    _forwardBits(bitLength: number): void {
        const bitOffset = this.bitOffset + bitLength;
        this.bitOffset = bitOffset % 8;
    }

}

export default Binary;
