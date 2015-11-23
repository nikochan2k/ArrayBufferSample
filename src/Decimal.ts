import Number from "./Number";

class Decimal extends Number {
    private static LOG2 = Math.log(2);
    private static POW_2_53 = Math.pow(2, 53);

    public min: number;
    public max: number;
    public step: number;
    protected _bitsMax: number;

    constructor(min: number, max: number, step: number = 1) {
        super();
        if (max < min) {
            throw new RangeError("max: " + max + " < min: " + min);
        }
        if (step <= 0) {
            throw new RangeError("step: " + step + " should be greater than 0.");
        }
        const difference = max - min;
        this._bitsMax = difference / step;
        if (this._bitsMax.toString().indexOf(".") !== -1) {
            throw new RangeError(
                "Invalid step: " + step + ", the maximum value of the step should be "
                + Math.floor(this._bitsMax) * step + min + "."
                );
        }
        this.min = min;
        this.max = max;
        this.step = step;
        this.bitLength = Math.floor(Math.log(this._bitsMax) / Decimal.LOG2) + 1;
        if (this._bitsMax < Decimal.POW_2_53) {
            if (53 < this.bitLength) {
                this.bitLength = 53;
            }
        } else {
            throw new RangeError("bitsMax: " + this._bitsMax
                + " sould be less than " + Decimal.POW_2_53 + ".");
        }
        this.byteLength = Math.ceil(this.bitLength / 8);
    }

    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        if (value < this.min) {
            throw new RangeError("value is less than minimum value \"" + this.min + "\".");
        }
        if (this.max < value) {
            throw new RangeError("value is greater than maximum value \"" + this.max + "\".");
        }
        this._value = value;
        this._bitsValue = Math.floor((value - this.min) / this.step);
    }

    public get bitsValue(): number {
        return this._bitsValue;
    }

    public set bitsValue(bitsValue: number) {
        if (bitsValue < 0) {
            throw new RangeError("bitsValue should be greater equal than 0.");
        }
        if (this._bitsMax < bitsValue) {
            throw new RangeError("bitsValue should be less equal than "
                + this._bitsMax + ".");
        }
        this._bitsValue = bitsValue;
        this._value = bitsValue * this.step + this.min;
    }
}

export default Decimal;
