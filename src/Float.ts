import Binary from "./Binary";
import Num from "./Num";

class Float extends Num {
    _double: boolean;
    _valueByteLength: number;

    constructor(nullable: boolean, double: boolean = true) {
        this._double = double;
        super(nullable);
    }

    _constructBitLength(): void {
        this._valueBitLength = (this._double ? 64 : 32);
        this._valueByteLength = (this._double ? 8 : 4);
        this._controlBitLength = 0;
    }

    _writeRawValue(binary: Binary): void {
        const buffer = new ArrayBuffer(this._valueByteLength);
        const f = this._valueByteLength === 8
            ? new Float64Array(buffer) : new Float32Array(buffer);
        f[0] = this.getValue();
        const u8 = new Uint8Array(buffer);
        this._swap(u8);
        binary.writeU8(u8, this._valueBitLength);
    }

    _readRawValue(binary: Binary): void {
        const u8 = binary.readU8(this._valueBitLength);
        this._swap(u8);
        const f = (this._valueByteLength === 8)
            ? new Float64Array(u8.buffer) : new Float32Array(u8.buffer);
        super.setValue(f[0]);
    }

    _setRawValue(rawValue: number) {

    }

    _swap(u8: Uint8Array): void {
        if (Num._isBigEndian) {
            return;
        }

        const end = this._valueByteLength / 2;
        for (let lhs = 0; lhs < end; lhs++) {
            const rhs = this._valueByteLength - lhs - 1;
            this._swapByte(u8, lhs, rhs);
        }
    }

    _swapByte(u8platform: Uint8Array, lhs: number, rhs: number): void {
        const temp = u8platform[lhs];
        u8platform[lhs] = u8platform[rhs];
        u8platform[rhs] = temp;
    }
}

export default Float;
