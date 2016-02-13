import Num from "./Num";
import Binary from "./Binary";

class StatDecimal extends Num {
    _mean: number;
    _sigma: number;
    _precision: number;
    _bitGroupLength: number;
    _bitGroupMax: number;
    _baseValueBitLength: number;

    constructor(nullable: boolean, mean: number, sigma: number,
        precision: number, bitGroupLength = 2) {
        if (sigma <= 0) {
            throw new RangeError("sigma: " + sigma + " must be greater than 0.");
        }
        if (precision <= 0) {
            throw new RangeError("precision: " + precision
                + " should be greater than 0.");
        }
        if (bitGroupLength < 2) {
            throw new RangeError("bitGroupLength: " + bitGroupLength
                + " should be greater or equal than 2.");
        }
        this._mean = mean;
        this._sigma = sigma;
        this._precision = precision;
        this._bitGroupLength = bitGroupLength;
        this._bitGroupMax = Math.pow(2, this._bitGroupLength) - 1;
        super(nullable);
    }

    _constructBitLength(): void {
        this._baseValueBitLength = Math.floor(Math.log(this._sigma + 1) / Math.LN2) - 1;
        if (this._baseValueBitLength === 0) {
            this._baseValueBitLength = 1;
        }
        this._valueBitLength = this._baseValueBitLength;
        this._controlBitLength = 3; // variable control bits and sign bit
    }

    write(binary: Binary): void {
        this._controlBitLength = 0;
        this._controlValue = 0;

        // nullable
        if (this._nullable) {
            this._controlBitLength = 1;
            if (this.value != null) {
                this._controlValue = 2; // 1 << 1
            }
        }

        const difference = this.value - this._mean;

        // value
        const absDifference = Math.abs(difference);
        const value = absDifference / this._precision;
        this._valueBitLength = this._computeBitLength(value + 1);

        // control value and bit length
        let variableBitLength = this._bitGroupLength;
        let variableBitValue = 0;
        if (this._baseValueBitLength < this._valueBitLength) {
            const bitLengthDifference = this._valueBitLength - this._baseValueBitLength;
            const bitGroupCount = Math.floor(bitLengthDifference / this._bitGroupMax) + 1;
            variableBitLength = bitGroupCount * this._bitGroupLength;
            variableBitValue = Math.pow(2, variableBitLength) - 1
                - this._bitGroupMax + (bitLengthDifference % this._bitGroupMax);
        } else {
            this._valueBitLength = this._baseValueBitLength;
        }
        this._controlBitLength += variableBitLength;
        this._controlValue = this._controlValue << variableBitLength;
        this._controlValue += variableBitValue;

        // sign bit;
        this._controlBitLength++;
        this._controlValue *= 2;
        if (difference < 0) {
            this._controlValue += 1;
        }

        // write control value
        const u8Control = this._rawValueToU8(this._controlValue, this._controlBitLength);
        binary.writeU8(u8Control, this._controlBitLength);

        // write value
        const u8Value = this._rawValueToU8(value, this._valueBitLength);
        binary.writeU8(u8Value, this._valueBitLength);
    }

    read(binary: Binary): void {
        if (this._readIsNull(binary)) {
            return;
        }

        this._valueBitLength = this._baseValueBitLength;
        let variableBitValue: number;
        do {
            const u8 = binary.readU8(this._bitGroupLength);
            variableBitValue = this._u8ToRawValue(u8);
            this._valueBitLength += variableBitValue;
        } while (variableBitValue === this._bitGroupMax);

        const signBit = binary.readBit();
        const sign = signBit ? -1 : 1;

        const u8 = binary.readU8(this._valueBitLength);
        this._rawValue = sign * this._u8ToRawValue(u8);
        const difference = this._rawValue * this._precision;
        const value = difference + this._mean;
        this.value = value;
    }

    _setRawValue(rawValue: number): void {
        // No implementation
    }
}

export default StatDecimal;
