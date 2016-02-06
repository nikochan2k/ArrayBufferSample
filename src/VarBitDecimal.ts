import VarDecimal from "./VarDecimal";

class VarBitDecimal extends VarDecimal {

    constructor(nullable: boolean, min: number, max: number, precision: number = 0) {
        super(nullable, min, max, precision);
    }

    _computeControlValue(): void {
        this._valueBitLength = this._computeBitLength(this._rawValue + 1);
        this._controlValue = this._valueBitLength;
    }

}

export default VarBitDecimal;
