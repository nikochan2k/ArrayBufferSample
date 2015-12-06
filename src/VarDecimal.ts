import Decimal from "./Decimal";

abstract class VarDecimal extends Decimal {
    _varBitLength: number;

    constructor(optional: boolean, min: number, max: number, step: number = 0) {
        super(optional, min, max, step);
    }

    _valueToBuffer(): void {
        this._setBitLength(Decimal._computeBitLength(this._intValue));
        this._u8 = Decimal._toBuffer(this._intValue, this._byteLength);
    }

    getVarBitLength(): number {
        return this._varBitLength;
    }
}

export default VarDecimal;
