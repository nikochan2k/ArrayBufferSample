import BitsType from "./BitsType";

class NumberRange {
    private static LOG2: number = Math.log(2);

    private min: number;
    private max: number;
    private step: number;
    private bitsMax: number;
    private numOfBits: number;
    private type: BitsType;
    private value: number;
    private bitsValue: number;

    constructor(min: number, max: number, step: number = 1) {
        if (max < min) {
            throw new RangeError("max: " + max + " < min: " + min);
        }
        if (step <= 0) {
            throw new RangeError("step: " + step + " should be greater than 0.");
        }
        const difference = max - min;
        const divided = difference / step;
        if (divided.toString().indexOf(".") !== -1) {
            throw new RangeError(
                "Invalid step: " + step + ", the maximum value of the step is "
                + Math.floor(divided) * step + min + "."
                );
        }
        this.min = min;
        this.max = max;
        this.step = step;
        this.value = min;
        this.bitsMax = difference / step;
        this.numOfBits = Math.floor(Math.log(this.bitsMax) / NumberRange.LOG2) + 1;
        if (this.numOfBits <= 8) {
            this.type = BitsType.uint8;
        } else if (this.numOfBits <= 16) {
            this.type = BitsType.uint16;
        } else if (this.numOfBits <= 32) {
            this.type = BitsType.uint32;
        } else {
            this.type = BitsType.float64;
        }
        this.bitsValue = 0;
    }

    public get Min(): number {
        return this.min;
    }

    public get Max(): number {
        return this.max;
    }

    public get NumOfBits(): number {
        return this.numOfBits;
    }

    public get Type(): BitsType {
        return this.type;
    }

    public set Value(value: number) {
        if (value < this.min) {
            throw new RangeError("value is less than minimum value \"" + this.min + "\".");
        }
        if (this.max < value) {
            throw new RangeError("value is greater than maximum value \"" + this.max + "\".");
        }
        this.value = value;
        this.bitsValue = Math.floor((value - this.min) / this.step);
    }

    public get Value(): number {
        return this.value;
    }

    public set BitsValue(bitsValue: number) {
        if (bitsValue < 0) {
            throw new RangeError("bitsValue should be greater equal than 0.");
        }
        if (this.bitsMax < bitsValue) {
            throw new RangeError("bitsValue should be less equal than "
                + this.bitsMax + ".");
        }
        this.bitsValue = bitsValue;
        this.value = bitsValue * this.step + this.min;
    }

    public get BitsValue(): number {
        return this.bitsValue;
    }
}

export default NumberRange;
