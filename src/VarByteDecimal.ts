import Decimal from "./Decimal";

class VarByteDecimal extends Decimal {

    constructor(nullable: boolean, min: number, max: number, precision: number = 0) {
        super(nullable, min, max, precision);
        const temp = this._computeBitLength(this._valueBitLength);
        this._controlBitLength = Math.ceil(temp / 8);
    }

    _setRawValue(rawValue: number): void {
        this._valueBitLength = this._computeBitLength(rawValue);
        const temp = this._computeBitLength(this._valueBitLength);
        this._controlValue = Math.ceil(temp / 8);
        super._setRawValue(rawValue);
    }

}

export default VarByteDecimal;
