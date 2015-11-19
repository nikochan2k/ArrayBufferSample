import BitsType from "./BitsType";

abstract class Bits {
    protected numOfBits: number;
    protected bitsType: BitsType;
    protected value: number;
    protected bitsValue: number;

    public get NumOfBits(): number {
        return this.numOfBits;
    }

    public get BitsType(): BitsType {
        return this.bitsType;
    }

}

export default Bits;
