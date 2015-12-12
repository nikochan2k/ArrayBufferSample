import Num from "./Num";

class Decimal extends Num {
    static _POW_2_53 = Math.pow(2, 53);

    static _toBuffer(value: number, byteLength: number): Uint8Array {
        const buffer = new ArrayBuffer(byteLength);
        const u8 = new Uint8Array(buffer);
        for (let i = u8.byteLength - 1; 0 <= i; i--) {
            const byteValue = value & 0xFF;
            u8[i] = byteValue;
            value = value >> 8;
        }
        return u8;
    }

    static _toValue(u8: Uint8Array): number {
        let rawValue = 0;
        for (let bitShift = 0; bitShift < u8.byteLength; bitShift++) {
            const idx = u8.byteLength - bitShift - 1;
            const value = u8[idx] << (bitShift * 8);
            rawValue += value;
        }
        return rawValue;
    }

    static _computeBitLength(value: number): number {
        return Math.floor(Math.log(value) / Math.LN2) + 1;
    }

    _min: number;
    _max: number;
    _precision: number;
    _intValue: number;
    _intMax: number;

    constructor(optional: boolean, min: number, max: number, precision: number = 0) {
        if (max < min) {
            throw new RangeError("max: " + max + " < min: " + min);
        }
        if (precision < 0) {
            throw new RangeError("step: " + precision + " should be greater than 0.");
        }
        this._min = min;
        this._max = max;
        this._precision = precision ? precision : this._computePrecision();
        const difference = max - min;
        this._intMax = Math.floor(difference / this._precision);
        let bitLength = Decimal._computeBitLength(this._intMax);
        if (this._intMax < Decimal._POW_2_53) {
            if (53 < bitLength) {
                bitLength = 53;
            }
        } else {
            throw new RangeError("bitsMax: " + this._intMax
                + " sould be less than " + Decimal._POW_2_53 + ".");
        }
        super(optional, bitLength);
    }

    _decimalLen(value: number): number {
        const str = value.toString();
        const index = str.indexOf(".");
        if (index === -1) {
            return 0;
        }
        return str.length - index - 1;
    }

    _computePrecision(): number {
        const minLen = this._decimalLen(this._min);
        const maxLen = this._decimalLen(this._max);
        const len = minLen < maxLen ? maxLen : minLen;
        return Math.pow(10, -len);
    }

    setValue(value: number): void {
        if (value < this._min) {
            throw new RangeError("value is less than minimum value \"" + this._min + "\".");
        }
        if (this._max < value) {
            throw new RangeError("value is greater than maximum value \"" + this._max + "\".");
        }
        this._value = value;
        this._intValue = Math.floor((this._value - this._min) / this._precision);
        this._valueToBuffer();
    }

    _valueToBuffer(): void {
        this._u8 = Decimal._toBuffer(this._intValue, this._byteLength);
    }

    setBuffer(buffer: ArrayBuffer): void {
        this._u8 = new Uint8Array(buffer);
        this._intValue = Decimal._toValue(this._u8);
        if (this._intMax < this._intValue) {
            throw new RangeError("bitsValue should be less equal than "
                + this._intMax + ".");
        }
        this._value = this._intValue * this._precision + this._min;
    }
}

export default Decimal;
