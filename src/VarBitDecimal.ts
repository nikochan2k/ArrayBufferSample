import Decimal from "./Decimal";

class VarBitDecimal extends Decimal {

    constructor(nullable: boolean, min: number, max: number, precision: number = 0) {
        super(nullable, min, max, precision);
        this._controlBitLength = this._computeBitLength(this._valueBitLength);
    }

    _setRawValue(rawValue: number): void {
        this._valueBitLength = this._computeBitLength(rawValue);
        this._controlValue = this._computeBitLength(this._valueBitLength);
        super._setRawValue(rawValue);
    }

}

export default VarBitDecimal;
