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
            value = value / 8;
        }
        return u8;
    }

    abstract _getRawValue(): number;

    write(binary: Binary): void {
        this._writePreamble(binary);
        if (this.getValue() != null) {
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
            preambleValue = (preambleValue << this._controlBitLength) & this._controlValue;
        }
        if (0 < preambleBitLength) {
            const u8 = this._valueToU8(preambleBitLength, preambleValue);
            binary.writeU8(u8, preambleBitLength);
        }
    }

    _writeRawValue(binary: Binary): void {
        const u8 = this._valueToU8(this._valueBitLength, this._getRawValue());
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
            this._controlValue = binary.readValue(this._controlBitLength);
            this._valueBitLength = this._controlValue;
        }
        return true;
    }

    _readRawValue(binary: Binary): void {
        const rawValue = binary.readValue(this._valueBitLength);
        this._setRawValue(rawValue);
    }

    _readIsNull(binary: Binary): boolean {
        if (!this._nullable) {
            return false;
        }

        return !binary.readBit();
    }

}

export default Bits;
