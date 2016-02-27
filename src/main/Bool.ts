import Bits from "./Bits";

class Bool extends Bits<boolean> {
    constructor(nullable: boolean) {
        super(nullable);
        this._valueBitLength = 1;
        this._controlBitLength = 0;
    }

    _setRawValue(rawValue: number) {
        this._rawValue = rawValue;
        super._setValue(rawValue === 1);
    }

    setValue(value: boolean) {
        super._setValue(value);
        this._rawValue = value ? 1 : 0;
    }

}

export default Bool;
