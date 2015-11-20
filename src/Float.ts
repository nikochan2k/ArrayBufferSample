import Number from "./Number";
import BitsType from "./BitsType";

class Float extends Number {

    constructor(double: boolean = true) {
        super();
        this.bitsType = double ? BitsType.float64 : BitsType.float32;
        this.numOfBits = double ? 64 : 32;
    }

    public get Value(): number {
        return this.value;
    }

    public set Value(value: number) {
        this.value = value;
        this.bitsValue = value;
    }

    public get BitsValue(): number {
        return this.bitsValue;
    }

    public set BitsValue(bitsValue: number) {
        this.value = bitsValue;
        this.bitsValue = bitsValue;
    }
}

export default Float;
