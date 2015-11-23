import Number from "./Number";

class Float extends Number {

    constructor(double: boolean = true) {
        super();
        this.numOfBytes = double ? 8 : 4;
        this.numOfBits = this.numOfBytes * 8;
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
