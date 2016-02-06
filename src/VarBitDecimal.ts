import Decimal from "./Decimal";

class VarBitDecimal extends Decimal {

    constructor(nullable: boolean, min: number, max: number, precision: number = 0) {
        super(nullable, min, max, precision);
        this._controlBitLength = this._computeBitLength(this._valueBitLength);
    }

    _setRawValue(rawValue: number): void {
        super._setRawValue(rawValue);
        this._computeControlValue();
    }

    setValue(value: number): void {
        super.setValue(value);
        this._computeControlValue();
    }

    _computeControlValue() {
        this._valueBitLength = this._computeBitLength(this._rawValue + 1);
        this._controlValue = this._computeBitLength(this._valueBitLength);
    }

}

export default VarBitDecimal;
