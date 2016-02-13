import Decimal from "./Decimal";

abstract class VarDecimal extends Decimal {

    constructor(nullable: boolean, min: number, max: number, precision: number = 0) {
        super(nullable, min, max, precision);
    }

    _constructBitLength(): void {
        const maxBitLength = this._computeBitLength(this._rawMax + 1);
        this._controlBitLength = this._computeBitLength(maxBitLength);
        this._computeControlValue();
    }

    _setRawValue(rawValue: number): void {
        super._setRawValue(rawValue);
        this._computeControlValue();
    }

    setValue(value: number): void {
        super._setValue(value);
        this._computeControlValue();
    }

    abstract _computeControlValue(): void;

}

export default VarDecimal;
