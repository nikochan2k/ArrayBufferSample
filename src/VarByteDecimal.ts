import VarDecimal from "./VarDecimal";

class VarByteDecimal extends VarDecimal {

    constructor(optional: boolean, min: number, max: number, step: number = 0) {
        super(optional, min, max, step);
        if (this._bitLength <= 8) {
            throw new RangeError(
                "It's effective to use VarBitDecimal for less or equal than 8bit."
                + "(" + this._bitLength + "bits at present.)"
            );
        }
        this._varBitLength = this._byteLength;
    }

}

export default VarByteDecimal;
