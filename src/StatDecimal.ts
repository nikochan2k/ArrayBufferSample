import Num from "./Num";
import Binary from "./Binary";

class StatDecimal extends Num {
    _mean: number;
    _sigma: number;
    _precision: number;
    _bitGroupLength: number;

    constructor(nullable: boolean, mean: number, sigma: number,
        precision: number, bitGroupLength = 2) {
        super(nullable);
        if (sigma <= 0) {
            throw new RangeError("sigma: " + sigma + " must be greater than 0.");
        }
        if (precision <= 0) {
            throw new RangeError("precision: " + precision
                + " should be greater than 0.");
        }
        if (bitGroupLength < 2) {
            throw new RangeError("bitGroupLength: " + bitGroupLength
                + " must be greater or equal than 2.");
        }
        this._mean = mean;
        this._sigma = sigma;
        this._precision = precision;
        this._bitGroupLength = bitGroupLength;
    }

    _constructBitLength(): void  {
        this._valueBitLength = 1;
        this._controlBitLength = 3;
    }

    write(binary: Binary): void {
        let controlBitLength = 0, controlValue = 0;

        // nullable
        if (this._nullable) {
            controlBitLength = 1;
            if (this.getValue() != null) {
                controlValue = 1;
            }
        }

        const difference = this.getValue() - this._mean;

        // sign bit;
        controlBitLength++;
        if (difference < 0) {
            controlValue++;
        }

        // value
        const absDifference = Math.abs(difference);
        const value = Math.round(absDifference / this._sigma / this._precision);
        const valueBitLength = this._computeBitLength(value + 1);

        // control value and bit length
        const threshold = (1 << this._bitGroupLength) - 1;
        const bitGroupCount = Math.floor(valueBitLength / threshold) + 1;
        const tempBitLength = bitGroupCount * this._bitGroupLength;
        controlBitLength += tempBitLength;
        const tempValue = (((1 << tempBitLength) - 1) ^ threshold) | (value % threshold);
        controlValue += tempValue;

        // write control value
        const u8Control = this._rawValueToU8(controlValue, controlBitLength);
        binary.writeU8(u8Control, controlBitLength);

        // write value
        const u8Value = this._rawValueToU8(value, valueBitLength);
        binary.writeU8(u8Value, this._valueBitLength);
    }

    _read(binary: Binary): void {
        if (this._readIsNull(binary)) {
            return;
        }

        const signBit = binary.readBit();

        const threshold = (1 << this._bitGroupLength) - 1;
        let valueBitLength = 0;
        let temp: number;
        do {
            const u8 = binary.readU8(this._bitGroupLength);
            temp = this._u8ToRawValue(u8);
            valueBitLength += temp;
        } while (temp === threshold);

        const sign = signBit ? -1 : 1;
        const u8 = binary.readU8(valueBitLength);
        const rawValue = this._u8ToRawValue(u8);
        const difference = sign * rawValue * this._sigma * this._precision;
        const value = difference + this._mean;
        this.setValue(value);
    }

    _setRawValue(rawValue: number): void {
        // No implementation
    }
}

export default StatDecimal;
