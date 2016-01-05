import Bits from "./Bits";

class Bool extends Bits {
    _value: boolean;

    constructor(nullable: boolean) {
        super(nullable, 0);
        this._valueBitLength = 1;
    }

    setValue(value: boolean): void {
        this._value = value;
    }

    _getRawValue() {
        return this._value ? 1 : 0;
    }

    _setRawValue(rawValue: number) {
        this._value = (rawValue === 1);
    }

}

export default Bool;
