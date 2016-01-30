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
        let i = 0;
        let temp = (u8[i++] << left) & 0xFF;
        while (i < u8.length) {
            temp |= (u8[i] >> right);
            this.u8[this.byteOffset++] |= temp;
            temp = (u8[i++] << left) & 0xFF;
        }
        this.u8[this.byteOffset] |= temp;
    }

    _writeU8WithRightBitShift(u8: Uint8Array, right: number): void {
        const left = 8 - right;
        let temp = this.u8[this.byteOffset];
        for (let i = 0; i < u8.length; i++ , this.byteOffset++) {
            this.u8[this.byteOffset] = temp | (u8[i] >> right);
            temp = (u8[i] << left) & 0xFF;
        }
        this.u8[this.byteOffset] = temp;
    }

    _writeU8WithoutBitShift(u8: Uint8Array) {
        let i = 0;
        this.u8[this.byteOffset++] |= u8[i];
        for (i = 1; i < u8.length; i++) {
            this.u8[this.byteOffset++] = u8[i];
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
        const byteLength = Math.ceil(total / 8);
        const buffer = new ArrayBuffer(byteLength);
        const u8 = new Uint8Array(buffer);
        const first = this.u8[this.byteOffset] & (0xFF >> this.bitOffset);
        if (0 < left) {
            this._readU8WithBitShift(first, u8, left);
        } else {
            this._readU8WithoutBitShift(first, u8);
        }
        this._forwardBits(bitLength);
        return u8;
    }

    _readU8WithBitShift(temp: number, u8: Uint8Array, left: number): void {
        const right = 8 - left;
        for (let i = 0; i < u8.byteLength;) {
            u8[i++] |= temp >> right;
            if (i < u8.byteLength) {
                u8[i] = (temp << left) & 0xFF;
                temp = this.u8[++this.byteOffset];
            }
        }
    }

    _readU8WithoutBitShift(first: number, u8: Uint8Array): void {
        let i = 0;
        u8[i++] = first;
        while(i < u8.length) {
            u8[i++] = this.u8[++this.byteOffset];
        }
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
