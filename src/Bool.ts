import Bits from "./Bits";

class Bool extends Bits<boolean> {
    constructor(nullable: boolean) {
        super(nullable);
        this._controlBitLength = 0;
        this._valueBitLength = 1;
    }

    _setRawValue(rawValue: number) {
        this._rawValue = rawValue;
        super.setValue(rawValue === 1);
    }

    setValue(value: boolean)  {
        super.setValue(value);
        this._rawValue = value ? 1 : 0;
    }

}

export default Bool;
