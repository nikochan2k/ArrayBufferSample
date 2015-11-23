import Number from "./Number";

class Float extends Number {

    constructor(double: boolean = true) {
        super();
        this.byteLength = double ? 8 : 4;
        this.bitLength = this.byteLength * 8;
    }

    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this._value = value;
        this._bitsValue = value;
    }

    public get bitsValue(): number {
        return this._bitsValue;
    }

    public set bitsValue(bitsValue: number) {
        this._value = bitsValue;
        this._bitsValue = bitsValue;
    }
}

export default Float;
