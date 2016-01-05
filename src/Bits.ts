import Particle from "./Particle";
import Binary from "./Binary";

abstract class Bits extends Particle {
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
        this._writeRawValue(binary);
    }

    _writeControlValue(binary: Binary): void {
        let bitLength = 0, value = 0;
        if (this._nullable) {
            bitLength = 1;
            value = (this._isNull ? 1 : 0);
        }
        if (0 < this._controlBitLength) {
            bitLength += this._controlBitLength;
            value = (value << this._controlBitLength) & this._controlValue;
        }
        if (0 < bitLength) {
            const u8 = this._valueToU8(bitLength, value);
            this._writeU8(binary, u8, bitLength);
        }
    }

    _writeRawValue(binary: Binary): void {
        const u8 = this._valueToU8(this._valueBitLength, this._getRawValue());
        this._writeU8(binary, u8, this._valueBitLength);
    }

    _writeU8(binary: Binary, u8: Uint8Array, bitLength: number): void {
        // bitOffset     used          sum shift result             next
        // 1"10000000" - 7"01111111" = 8   0     11111111
        // 1"10000000" - 5"00011111" = 6   -2    11111100           6
        // 3"11100000" - 7"01111111" = 10  2     11111111 11000000  2
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
            this._valueBitLength = this._computeValueBitLength();
        }
    }

    _computeValueBitLength(): number {
        return this._controlValue;
    }

    _readRawValue(binary: Binary): void {
        const rawValue = this._readValue(binary, this._valueBitLength);
        this._setRawValue(rawValue);
    }

    abstract _setRawValue(rawValue: number): void;

    _readIsNull(binary: Binary): boolean {
        if (!this._nullable) {
            return false;
        }

        const bit = this._readBit(binary);
        return !bit;
    }

    _readValue(binary: Binary, bitLength: number): number {
        // instance                     bitOffset bitLength bo+bl 8-(bo+bl)%8 (bo+bl)/8
        // "xooxxxxx"                   1         2         3     5           0
        // "xxxooooo ooxxxxxx"          3         7         10    6           1
        // "xxxxxxoo oooooooo ooooooox" 6         17        23    1           2
        const total = binary.bitOffset + bitLength;
        const left = (total % 8);
        const right = 8 - left;
        let value = 0;
        for (let i = Math.ceil(total / 8) - 1; 0 <= i; i--) {
            value = value << 8;
            const byteIndex = binary.byteOffset + i;
            value |= binary.u8[byteIndex] >>> right;
            if (0 < i) {
                value |= (binary.u8[byteIndex - 1] << left) & 0xFF;
            } else {
                value &= (0xFF >>> left);
            }
        }
        this._forwardBit(binary, bitLength);
        return value;
    }

    _readBit(binary: Binary): number {
        const right = 7 - binary.bitOffset;
        const bit = (binary.u8[binary.byteOffset] >>> right) & 0x1;
        this._forwardBit(binary, 1);
        return bit;
    }

    _forwardBit(binary: Binary, bitLength: number): void {
        const bitOffset = binary.bitOffset + bitLength;
        binary.bitOffset = bitOffset % 8;
        binary.byteOffset += (bitOffset / 8) | 0; // To integer
    }

}

export default Bits;
