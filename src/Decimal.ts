import Num from "./Num";

class Decimal extends Num {
    static _DECIMAL_MAX = 9007199254740991;

    _min: number;
    _max: number;
    _precision: number;
    _rawMax: number;

    constructor(nullable: boolean, min: number, max: number, precision = 0) {
        super(nullable);
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
        let valueBitLength = this._computeBitLength(this._rawMax + 1);
        if (53 < valueBitLength) {
            throw new RangeError("bitsMax: " + this._rawMax
                + " sould be less than " + Decimal._DECIMAL_MAX + ".");
        }
        this._valueBitLength = valueBitLength;
    }

    _computePrecision(): number {
        const minLen = this._decimalLen(this._min);
        const maxLen = this._decimalLen(this._max);
        const len = minLen < maxLen ? maxLen : minLen;
        return Math.pow(10, -len);
    }

    _setRawValue(rawValue: number): void {
        this._rawValue = rawValue;
        const value = rawValue * this._precision + this._min;
        this._validateValue(value);
        super.setValue(value);
    }

    setValue(value: number): void {
        this._validateValue(value);
        super.setValue(value);
        this._rawValue = Math.floor((value - this._min) / this._precision);
    }

    _validateValue(value: number): void {
        if (value < this._min) {
            throw new RangeError("\"" + value + "\" is less than minimum value \"" + this._min + "\".");
        }
        if (this._max < value) {
            throw new RangeError("\"" + value + "\" is greater than maximum value \"" + this._max + "\".");
        }
    }

}

export default Decimal;
