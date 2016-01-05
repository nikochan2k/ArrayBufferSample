import VarDecimal from "./VarDecimal";

class VarByteDecimal extends VarDecimal {

    constructor(nullable: boolean, min: number, max: number, precision: number = 0) {
        super(nullable, min, max, precision);
    }

    _getRawValue(): number {
        const rawValue = super._getRawValue();
        const valueBitLength = this._computeBitLength(rawValue);
        this._controlValue = Math.ceil(valueBitLength / 8);
        this._valueBitLength = this._controlValue * 8;
        return rawValue;
    }

}

export default VarByteDecimal;
