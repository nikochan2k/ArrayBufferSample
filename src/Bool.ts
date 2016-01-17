import Bits from "./Bits";

class Bool extends Bits<boolean> {
    constructor(nullable: boolean) {
        super(nullable, 0);
        this._valueBitLength = 1;
    }

    _getRawValue() {
        return this.getValue() ? 1 : 0;
    }

    _setRawValue(rawValue: number) {
        this.setValue(rawValue === 1);
    }

}

export default Bool;
