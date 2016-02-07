import VarDecimal from "./VarDecimal";

class VarByteDecimal extends VarDecimal {

    constructor(nullable: boolean, min: number, max: number, precision: number = 0) {
        super(nullable, min, max, precision);
    }

    _computeControlValue(): void {
        const valueBitLength = this._computeBitLength(this._rawValue + 1);
        const controlValue = Math.ceil(valueBitLength / 8)
        this._valueBitLength = controlValue * 8;
        this._controlValue = controlValue - 1;
    }

    _controlValueToValueBitLength(): void {
        this._valueBitLength = (this._controlValue + 1) * 8;
    }

}

export default VarByteDecimal;
