import Bits from "./Bits";

abstract class Number extends Bits {
    protected numOfBits: number;
    protected value: number;
    protected bitsValue: number;

    public get NumOfBits(): number {
        return this.numOfBits;
    }
}

export default Number;
