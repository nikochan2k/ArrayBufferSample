import Number from "./Number";

class Decimal extends Number {
    private static LOG2 = Math.log(2);
    private static POW_2_53 = Math.pow(2, 53);

    public static fromRawValueToBufferBy(rawValue: number, byteLength: number): ArrayBuffer {
        const buffer = new ArrayBuffer(byteLength);
        const u8 = new Uint8Array(buffer);
        for (let i = byteLength - 1; 0 <= i; i--) {
            const byteValue = rawValue & 0xFF;
            u8[i] = byteValue;
            rawValue = rawValue >> 8;
            if (rawValue === 0) {
                break;
            }
        }
        return buffer;
    }

    public static fromBufferToRawValueBy(buffer: ArrayBuffer, byteLength: number): number {
        const u8 = new Uint8Array(buffer);
        let rawValue = 0;
        for (let i = 0; i < byteLength; i++) {
            const j = byteLength - i - 1;
            const value = u8[j] << (i * 8);
            rawValue += value;
        }
        return rawValue;
    }

    public min: number;
    public max: number;
    public step: number;
    private rawMax: number;

    constructor(min: number, max: number, step: number = 1) {
        super();
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
        this.bitLength = Math.floor(Math.log(this.rawMax) / Decimal.LOG2) + 1;
        if (this.rawMax < Decimal.POW_2_53) {
            if (53 < this.bitLength) {
                this.bitLength = 53;
            }
        } else {
            throw new RangeError("bitsMax: " + this.rawMax
                + " sould be less than " + Decimal.POW_2_53 + ".");
        }
        this.byteLength = Math.ceil(this.bitLength / 8);
        this.buffer = new ArrayBuffer(this.byteLength);
    }

    public setValue(value: number) {
        if (value < this.min) {
            throw new RangeError("value is less than minimum value \"" + this.min + "\".");
        }
        if (this.max < value) {
            throw new RangeError("value is greater than maximum value \"" + this.max + "\".");
        }
        this.value = value;
        this.buffer = this.fromValueToBuffer();
    }

    public fromValueToBuffer(): ArrayBuffer {
        const rawValue = this.fromValueToRawValue();
        return Decimal.fromRawValueToBufferBy(rawValue, this.byteLength);
    }

    public fromValueToRawValue(): number {
        return Math.floor((this.value - this.min) / this.step);
    }

    public setBuffer(buffer: ArrayBuffer) {
        this.buffer = buffer;
        this.value = this.fromBufferToValue();
    }

    public fromBufferToValue(): number {
        const rawValue = this.fromBufferToRawValue();
        if (this.rawMax < rawValue) {
            throw new RangeError("bitsValue should be less equal than "
                + this.rawMax + ".");
        }
        return rawValue * this.step + this.min;
    }

    public fromBufferToRawValue(): number {
        if (this.byteLength < this.buffer.byteLength) {
            throw new RangeError("buffer.byteLength should be less equal than "
                + this.byteLength + ".");
        }
        return Decimal.fromBufferToRawValueBy(this.buffer, this.byteLength);
    }
}

export default Decimal;
