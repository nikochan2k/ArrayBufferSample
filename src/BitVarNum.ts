import Num from "./Num";

abstract class BitVarNum extends Num {
    _controlBitLength: number;

    constructor(optional: boolean, bitLength: number) {
        super(optional, bitLength);
        this._controlBitLength = Math.floor(Math.log(bitLength) / Math.LN2) + 1;
    }
}
