import Decimal from "./Decimal";

abstract class VarDecimal extends Decimal {

    constructor(nullable: boolean, min: number, max: number, precision: number = 0) {
        super(nullable, min, max, precision);
        this._controlBitLength = this._computeBitLength(this._rawMax);
    }

}

export default VarDecimal;
