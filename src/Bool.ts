import Bits from "./Bits";

class Bool extends Bits {
    _value: boolean;

    constructor(optional: boolean) {
        super(optional, 1);
    }

    setValue(value: boolean): void {
        this._value = value;
        const buffer = new ArrayBuffer(1);
        this._u8 = new Uint8Array(buffer);
        this._u8[0] = value ? 1 : 0;
    }

    getValue(): boolean {
        return this._value;
    }

    setBuffer(buffer: ArrayBuffer): void {
        if (buffer.byteLength !== 1) {
            throw new RangeError("Byte length should be 1.");
        }
        this._u8 = new Uint8Array(buffer);
        this._value = this._u8[0] !== 0;
    }
}

export default Bool;
