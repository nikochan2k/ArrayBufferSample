import Num from "./Num";
import Decimal from "./Decimal";

class StatDecimal extends Num {
    _mean: number;
    _sigma: number;
    _sigma2: number;
    _difference: number;
    _sigmaValue: number;

    constructor(optional: boolean, mean: number, sigma: number, step: number = 0) {
        const temp = Decimal._computeBitLength(sigma);
        super(optional, temp);
        this._mean = mean;
        this._sigma = sigma;
        this._sigma2 = sigma * 2;
    }

    setValue(value: number): void {
        this._value = value;
        this._difference = value - this._mean;
        const absDifference = Math.abs(this._difference);
        this._sigmaValue = Math.ceil(absDifference / this._sigma);
        if (2 < this._sigmaValue) {
            this._sigmaValue = 3;
        }
    }

    setBuffer(buffer: ArrayBuffer): void {

    }
}

export default StatDecimal;
