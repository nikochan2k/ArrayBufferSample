import Num from "./Num";
import Decimal from "./Decimal";

class StatDecimal extends Num {
    _mean: number;
    _sigma: number;
    _difference: number;
    _sigmaValue: number;

    constructor(optional: boolean, mean: number, sigma: number, step: number = 0) {
        const tempBitLength = Decimal._computeBitLength(sigma);
        super(optional, tempBitLength);
        this._mean = mean;
        this._sigma = sigma;
    }

    setValue(value: number): void {
        this._value = value;
        this._difference = value - this._mean;
        this._sigmaValue = Math.floor(this._difference / this._sigma);
        if (3 < Math.abs(this._sigmaValue)) {
            this._sigmaValue = 3;
        }
    }

    setBuffer(buffer: ArrayBuffer): void {

    }
}

export default StatDecimal;
