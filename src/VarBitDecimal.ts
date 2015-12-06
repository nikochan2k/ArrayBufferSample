import Decimal from "./Decimal";

class VarBitDecimal extends Decimal {
    _varBitLength: number;
    _varBitValue: number;

    constructor(optional: boolean, min: number, max: number, step: number = 0) {
        super(optional, min, max, step);
        this._varBitLength = Math.floor(Math.log(this._intMax) / Math.LN2) + 1;
    }

    _valueToBuffer() {
        this._varBitValue = Math.floor(Math.log(this._intValue) / Math.LN2) + 1;
        const byteLength = Math.ceil(this._varBitValue / 8.0);
        this._u8 = Decimal._toBuffer(this._intValue, byteLength);
    }

    getVarBitLength() {
        return this._varBitLength;
    }
}

export default VarBitDecimal;
