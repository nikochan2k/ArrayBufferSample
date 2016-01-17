import Particle from "./Particle";
import Binary from "./Binary";

abstract class Bits<T> extends Particle<T> {
    _controlBitLength: number;
    _controlValue: number;
    _valueBitLength: number;

    constructor(nullable: boolean, controlBitLength: number) {
        if (8 < controlBitLength) {
            throw new RangeError("controlBitLength: " + controlBitLength
                + " less equal than 8");
        }
        super(nullable);
        this._controlBitLength = controlBitLength;
    }

    _valueToU8(bitLength: number, value: number): Uint8Array {
        const byteLength = Math.ceil(bitLength / 8);
        const buffer = new ArrayBuffer(byteLength);
        const u8 = new Uint8Array(buffer);

        for (let i = byteLength - 1; 0 <= i; i--) {
            const byteValue = value & 0xFF;
            u8[i] = byteValue;
            value = value >>> 8;
        }
        return u8;
    }

    abstract _getRawValue(): number;

    write(binary: Binary): void {
        this._writeControlValue(binary);
        if (this.getValue() != null) {
            this._writeRawValue(binary);
        }
    }

    _writeControlValue(binary: Binary): void {
        let controlBitLength = 0, controlValue = 0;
        if (this._nullable) {
            controlBitLength = 1;
            if (this.getValue() != null) {
                controlValue = 1;
            }
        }
        if (0 < this._controlBitLength) {
            controlBitLength += this._controlBitLength;
            controlValue = (controlValue << this._controlBitLength) & this._controlValue;
        }
        if (0 < controlBitLength) {
            const u8 = this._valueToU8(controlBitLength, controlValue);
            this._writeU8(binary, u8, controlBitLength);
        }
    }

    _writeRawValue(binary: Binary): void {
        const u8 = this._valueToU8(this._valueBitLength, this._getRawValue());
        this._writeU8(binary, u8, this._valueBitLength);
    }

    _writeU8(binary: Binary, u8: Uint8Array, bitLength: number): void {
        // bitOffset     used          sum shift result             next
        // 1"oxxxxxxx" - 7"xooooooo" = 8   0     oooooooo           0
        // 1"oxxxxxxx" - 5"xxxooooo" = 6   -2    ooooooxx           6
        // 3"oooxxxxx" - 7"xooooooo" = 10  2     oooooooo ooxxxxxx  2
        const used = bitLength % 8;
        const sum = binary.bitOffset + used;
        const shift = sum - 8;
        if (shift < 0) {
            this._writeU8WithLeftBitShift(binary, u8, -shift);
        } else if (0 < shift) {
            this._writeU8WithRightBitShift(binary, u8, shift);
        } else {
            this._writeU8WithoutBitShift(binary, u8);
        }
        binary.bitOffset = sum % 8;
    }

    _writeU8WithLeftBitShift(binary: Binary, u8: Uint8Array,
        left: number): void {
        const right = 8 - left;
        for (let current = 0, length = u8.length; current < length;) {
            let temp = (u8[current++] << left) & 0xFF;
            if (current < length) {
                temp |= (u8[current] >>> right);
            }
            binary.u8[binary.byteOffset] |= temp;
            if (current < length) {
                binary.u8[++binary.byteOffset] = 0;
            }
        }
    }

    _writeU8WithRightBitShift(binary: Binary, u8: Uint8Array,
        right: number): void {
        const left = 8 - right;
        let temp = binary.u8[binary.byteOffset];
        for (let current = 0, length = u8.length; current < length;
            current++ , binary.byteOffset++) {
            binary.u8[binary.byteOffset] = temp | (u8[current] >>> right);
            temp = (u8[current] << left) & 0xFF;
        }
        binary.u8[binary.byteOffset] = temp;
    }

    _writeU8WithoutBitShift(binary: Binary, u8: Uint8Array) {
        let current = 0;
        binary.u8[binary.byteOffset] |= u8[current];
        for (current = 1, length = u8.length; current < length; current++) {
            binary.u8[++binary.byteOffset] = u8[current];
        }
    }

    abstract _setRawValue(rawValue: number): void;

    read(binary: Binary): void {
        this._readControlValue(binary);
        this._readRawValue(binary);
    }

    _readControlValue(binary: Binary): void {
        if (this._readIsNull(binary)) {
            return;
        }
        if (0 < this._controlBitLength) {
            this._controlValue = this._readValue(binary,
                this._controlBitLength);
            this._valueBitLength = this._controlValue;
        }
    }

    _readRawValue(binary: Binary): void {
        const rawValue = this._readValue(binary, this._valueBitLength);
        this._setRawValue(rawValue);
    }

    _readIsNull(binary: Binary): boolean {
        if (!this._nullable) {
            return false;
        }

        return !this._readBit(binary);
    }

    _readValue(binary: Binary, bitLength: number): number {
        // instance                     bitOffset bitLength total 8-(total)%8 (total)/8
        // "xooxxxxx"                   1         2         3     5           0
        // "xxxooooo ooxxxxxx"          3         7         10    6           1
        // "xxxxxxoo oooooooo ooooooox" 6         17        23    1           2
        const total = binary.bitOffset + bitLength;
        const left = (total % 8);
        const right = 8 - left;
        let value = 0;
        for (let i = Math.ceil(total / 8) - 1; 0 <= i; i--) {
            const byteIndex = binary.byteOffset + i;
            value |= binary.u8[byteIndex] >>> right;
            if (0 < i) {
                value |= (binary.u8[byteIndex - 1] << left) & 0xFF;
                value = value << 8;
            } else {
                value &= (0xFF >>> left);
            }
        }
        this._forwardBits(binary, bitLength);
        return value;
    }

    _readBit(binary: Binary): number {
        const right = 7 - binary.bitOffset;
        const bit = (binary.u8[binary.byteOffset] >>> right) & 0x1;
        this._forwardBits(binary, 1);
        return bit;
    }

    _forwardBits(binary: Binary, bitLength: number): void {
        const bitOffset = binary.bitOffset + bitLength;
        binary.bitOffset = bitOffset % 8;
        binary.byteOffset += (bitOffset / 8) | 0; // To integer
    }

}

export default Bits;
