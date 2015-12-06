import VarDecimal from "./VarDecimal";

class VarBitDecimal extends VarDecimal {

    constructor(optional: boolean, min: number, max: number, step: number = 0) {
        super(optional, min, max, step);
        if (8 < this._bitLength) {
            throw new RangeError(
                "It's effective to use VarByteDecimal for greater than 8bit."
                + "(" + this._bitLength + "bits at present.)"
            );
        }
        this._varBitLength = this._bitLength;
    }

}

export default VarBitDecimal;
