import Num from "./Num";

class Decimal extends Num {
    static _POW_2_53 = Math.pow(2, 53);

    _min: number;
    _max: number;
    _precision: number;
    _rawMax: number;

    constructor(nullable: boolean, min: number, max: number, precision: number = 0) {
        super(nullable, 0);
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
        this._rawMax = Math.floor(difference / this._precision);
        let valueBitLength = this._computeBitLength(this._rawMax);
        if (this._rawMax < Decimal._POW_2_53) {
            if (53 < valueBitLength) {
                valueBitLength = 53;
            }
        } else {
            throw new RangeError("bitsMax: " + this._rawMax
                + " sould be less than " + Decimal._POW_2_53 + ".");
        }
        this._valueBitLength = valueBitLength;
    }

    _computePrecision(): number {
        const minLen = this._decimalLen(this._min);
        const maxLen = this._decimalLen(this._max);
        const len = minLen < maxLen ? maxLen : minLen;
        return Math.pow(10, -len);
    }

    setValue(value: number): void {
        if (value < this._min) {
            throw new RangeError("\"" + value + "\" is less than minimum value \"" + this._min + "\".");
        }
        if (this._max < value) {
            throw new RangeError("\"" + value + "\" is greater than maximum value \"" + this._max + "\".");
        }
        super.setValue(value);
    }

    _getRawValue(): number {
        return Math.floor((this.getValue() - this._min) / this._precision);
    }

    _setRawValue(rawValue: number): void {
        const value = rawValue * this._precision + this._min;
        this.setValue(value);
    }
}

export default Decimal;
