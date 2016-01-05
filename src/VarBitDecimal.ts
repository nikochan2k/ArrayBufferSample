import VarDecimal from "./VarDecimal";

class VarBitDecimal extends VarDecimal {

    constructor(nullable: boolean, min: number, max: number, precision: number = 0) {
        super(nullable, min, max, precision);
    }

    _getRawValue(): number {
        const rawValue = super._getRawValue();
        this._controlValue = this._computeBitLength(rawValue);
        this._valueBitLength = this._controlValue;
        return rawValue;
    }

}

export default VarBitDecimal;
