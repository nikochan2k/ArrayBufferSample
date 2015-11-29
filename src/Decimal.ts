import Number from "./Number";

class Decimal extends Number {
    private static LOG2 = Math.log(2);
    private static POW_2_53 = Math.pow(2, 53);

    static toBuffer(value: number, byteLength: number): Uint8Array {
        const buffer = new ArrayBuffer(byteLength);
        const u8 = new Uint8Array(buffer);
        for (let i = u8.byteLength - 1; 0 <= i; i--) {
            const byteValue = value & 0xFF;
            u8[i] = byteValue;
            value = value >> 8;
        }
        return u8;
    }

    static toValue(u8: Uint8Array): number {
        let rawValue = 0;
        for (let bitShift = 0; bitShift < u8.byteLength; bitShift++) {
            const idx = u8.byteLength - bitShift - 1;
            const value = u8[idx] << (bitShift * 8);
            rawValue += value;
        }
        return rawValue;
    }

    min: number;
    max: number;
    step: number;
    rawMax: number;

    constructor(min: number, max: number, step: number = 1) {
        if (max < min) {
            throw new RangeError("max: " + max + " < min: " + min);
        }
        if (step <= 0) {
            throw new RangeError("step: " + step + " should be greater than 0.");
        }
        const difference = max - min;
        this.rawMax = difference / step;
        if (this.rawMax.toString().indexOf(".") !== -1) {
            throw new RangeError(
                "Invalid step: " + step + ", the maximum value of the step should be "
                + Math.floor(this.rawMax) * step + min + "."
            );
        }
        this.min = min;
        this.max = max;
        this.step = step;
        let bitLength = Math.floor(Math.log(this.rawMax) / Decimal.LOG2) + 1;
        if (this.rawMax < Decimal.POW_2_53) {
            if (53 < bitLength) {
                bitLength = 53;
            }
        } else {
            throw new RangeError("bitsMax: " + this.rawMax
                + " sould be less than " + Decimal.POW_2_53 + ".");
        }
        super(bitLength);
    }

    setValue(value: number) {
        if (value < this.min) {
            throw new RangeError("value is less than minimum value \"" + this.min + "\".");
        }
        if (this.max < value) {
            throw new RangeError("value is greater than maximum value \"" + this.max + "\".");
        }
        this._value = value;
        this._u8 = this.valueToUint8Array(value);
    }

    valueToUint8Array(value: number): Uint8Array {
        const rawValue = this.valueToRawValue();
        return Decimal.toBuffer(rawValue, this._byteLength);
    }

    valueToRawValue(): number {
        return Math.floor((this._value - this.min) / this.step);
    }

    setBuffer(buffer: ArrayBuffer) {
        this._u8 = new Uint8Array(buffer);
        this._value = this.uint8ArrayToValue();
    }

    uint8ArrayToValue(): number {
        const rawValue = this.uint8ArrayToRawValue();
        if (this.rawMax < rawValue) {
            throw new RangeError("bitsValue should be less equal than "
                + this.rawMax + ".");
        }
        return rawValue * this.step + this.min;
    }

    uint8ArrayToRawValue(): number {
        return Decimal.toValue(this._u8);
    }
}

export default Decimal;
