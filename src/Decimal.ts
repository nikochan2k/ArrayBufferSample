import Num from "./Num";

class Decimal extends Num {
    static _LOG2 = Math.log(2);
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

    _min: number;
    _max: number;
    _step: number;
    _rawMax: number;

    constructor(optional: boolean, min: number, max: number, step: number = 1) {
        if (max < min) {
            throw new RangeError("max: " + max + " < min: " + min);
        }
        if (step <= 0) {
            throw new RangeError("step: " + step + " should be greater than 0.");
        }
        const difference = max - min;
        this._rawMax = difference / step;
        if (this._rawMax.toString().indexOf(".") !== -1) {
            throw new RangeError(
                "Invalid step: " + step + ", the maximum value of the step should be "
                + Math.floor(this._rawMax) * step + min + "."
            );
        }
        this._min = min;
        this._max = max;
        this._step = step;
        let bitLength = Math.floor(Math.log(this._rawMax) / Decimal._LOG2) + 1;
        if (this._rawMax < Decimal._POW_2_53) {
            if (53 < bitLength) {
                bitLength = 53;
            }
        } else {
            throw new RangeError("bitsMax: " + this._rawMax
                + " sould be less than " + Decimal._POW_2_53 + ".");
        }
        super(optional, bitLength);
    }

    setValue(value: number) {
        if (value < this._min) {
            throw new RangeError("value is less than minimum value \"" + this._min + "\".");
        }
        if (this._max < value) {
            throw new RangeError("value is greater than maximum value \"" + this._max + "\".");
        }
        this._value = value;
        this._u8 = this._valueToU8(value);
    }

    _valueToU8(value: number): Uint8Array {
        const rawValue = this._valueToRawValue();
        return Decimal._toBuffer(rawValue, this._byteLength);
    }

    _valueToRawValue(): number {
        return Math.floor((this._value - this._min) / this._step);
    }

    setBuffer(buffer: ArrayBuffer) {
        this._u8 = new Uint8Array(buffer);
        this._value = this._u8ToValue();
    }

    _u8ToValue(): number {
        const rawValue = this._u8ToRawValue();
        if (this._rawMax < rawValue) {
            throw new RangeError("bitsValue should be less equal than "
                + this._rawMax + ".");
        }
        return rawValue * this._step + this._min;
    }

    _u8ToRawValue(): number {
        return Decimal._toValue(this._u8);
    }
}

export default Decimal;
