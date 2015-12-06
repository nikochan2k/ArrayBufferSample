import Decimal from "./Decimal";

class VarByteDecimal extends Decimal {
    _varBitLength: number;
    _varBitValue: number;

    constructor(optional: boolean, min: number, max: number, step: number = 0) {
        super(optional, min, max, step);
        const temp = Math.floor(Math.log(this._intMax) / Math.LN2) + 1;
        if (temp <= 8) {
            throw new RangeError(
                "It's effective to use VarBitDecimal for less or equal than 8bit."
                + "(" + temp + "bits at present.)"
            );
        }
        this._varBitLength = Math.ceil(temp / 8.0);
    }

    _valueToBuffer() {
        const temp = Math.floor(Math.log(this._intValue) / Math.LN2) + 1;
        this._varBitValue = Math.ceil(temp / 8.0);
        this._u8 = Decimal._toBuffer(this._intValue, this._varBitValue);
    }

    getVarBitLength() {
        return this._varBitLength;
    }
}

export default VarByteDecimal;
