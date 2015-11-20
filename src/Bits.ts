import BitsType from "./BitsType";

abstract class Bits {
    protected bitsType: BitsType;

    public get BitsType(): BitsType {
        return this.bitsType;
    }

}

export default Bits;
