import BitsType from "./BitsType";

class NumberRange {
    private min: number;
    private max: number;
    private step: number;
    private bitsMax: number;
    private numOfBits: number;
    private type: BitsType;
    private value: number;
    private bitsValue: number;

    constructor(min: number, max: number, step: number = 1) {
        if (step <= 0) {
            throw new RangeError("step: " + step + " should be greater than 0.");
        }
        const tempMax = max - min;
        if ((tempMax / step).toString().indexOf(".") !== -1) {
            throw new RangeError("Invalid step: " + step);
        }
        this.min = min;
        this.max = max;
        this.step = step;
        this.value = this.min;
        this.bitsMax = tempMax / this.step;
        this.numOfBits = Math.floor(Math.log(this.bitsMax) / Math.log(2)) + 1;
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

    public get BitsMax(): number {
        return this.bitsMax;
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

    public get BitsValue(): number {
        return this.bitsValue;
    }
}

export default NumberRange;
