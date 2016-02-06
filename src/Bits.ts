import Particle from "./Particle";
import Binary from "./Binary";

abstract class Bits<T> extends Particle<T> {
    _controlBitLength: number;
    _controlValue: number;
    _valueBitLength: number;
    _rawValue: number;

    constructor(nullable: boolean) {
        super(nullable);
        this._rawValue = 0;
        this._controlValue = 0;
        this._constructBitLength();
    }

    abstract _constructBitLength(): void;

    _rawValueToU8(rawValue: number, bitLength: number): Uint8Array {
        const byteLength = Math.ceil(bitLength / 8);
        const buffer = new ArrayBuffer(byteLength);
        const u8 = new Uint8Array(buffer);

        for (let i = byteLength - 1; 0 <= i; i--) {
            const byteValue = rawValue % 256;
            u8[i] = byteValue;
            rawValue = Math.floor(rawValue / 256);
        }
        return u8;
    }

    write(binary: Binary): void {
        this._writePreamble(binary);
        if (!this._nullable || this.getValue() != null) {
            this._writeRawValue(binary);
        }
    }

    _writePreamble(binary: Binary): void {
        let preambleBitLength = 0, preambleValue = 0;
        if (this._nullable) {
            preambleBitLength = 1;
            if (this.getValue() != null) {
                preambleValue = 1;
            }
        }
        if (0 < this._controlBitLength) {
            preambleBitLength += this._controlBitLength;
            preambleValue = (preambleValue << this._controlBitLength) | this._controlValue;
        }
        if (0 < preambleBitLength) {
            const u8 = this._rawValueToU8(preambleValue, preambleBitLength);
            binary.writeU8(u8, preambleBitLength);
        }
    }

    _writeRawValue(binary: Binary): void {
        const u8 = this._rawValueToU8(this._rawValue, this._valueBitLength);
        binary.writeU8(u8, this._valueBitLength);
    }

    abstract _setRawValue(rawValue: number): void;

    read(binary: Binary): void {
        if (this._readPreambleValue(binary)) {
            this._readRawValue(binary);
        }
    }

    _readPreambleValue(binary: Binary): boolean {
        if (this._readIsNull(binary)) {
            return false;
        }
        if (0 < this._controlBitLength) {
            const u8 = binary.readU8(this._controlBitLength);
            const byteLength = Math.ceil(this._controlBitLength / 8);
            this._controlValue = this._u8ToRawValue(u8, byteLength);
        }
        return true;
    }

    _readRawValue(binary: Binary): void {
        const u8 = binary.readU8(this._valueBitLength);
        const byteLength = Math.ceil(this._valueBitLength / 8);
        const rawValue = this._u8ToValue(u8, byteLength);
        this._setRawValue(rawValue);
    }

    _readIsNull(binary: Binary): boolean {
        if (!this._nullable) {
            return false;
        }

        return !binary.readBit();
    }

    _u8ToValue(u8: Uint8Array, byteLength: number): number {
        return this._u8ToRawValue(u8, byteLength);
    }

    _u8ToRawValue(u8: Uint8Array, byteLength: number): number {
        let value = 0;
        for (let i = 0; i < u8.byteLength; i++) {
            value *= 256;
            value += u8[i];
        }
        return value;
    }

}

export default Bits;
