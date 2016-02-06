import Binary from "./Binary";
import Num from "./Num";

class Float extends Num {
    _byteLength: number;

    constructor(nullable: boolean, isDouble: boolean = true) {
        super(nullable);
        this._valueBitLength = (isDouble ? 64 : 32);
        this._byteLength = Math.floor(this._valueBitLength / 8);
    }

    _writeRawValue(binary: Binary): void {
        const buffer = new ArrayBuffer(this._byteLength);
        const f = this._byteLength === 8
            ? new Float64Array(buffer) : new Float32Array(buffer);
        f[0] = this.getValue();
        const u8 = new Uint8Array(buffer);
        this._swap(u8);
        binary.writeU8(u8, this._valueBitLength);
    }

    _readRawValue(binary: Binary): void {
        const u8 = binary.readU8(this._valueBitLength);
        this._swap(u8);
        const f = (this._byteLength === 8)
            ? new Float64Array(u8.buffer) : new Float32Array(u8.buffer);
        super.setValue(f[0]);
    }

    _setRawValue(rawValue: number)  {

    }

    _swap(u8: Uint8Array): void {
        if (Num._isBigEndian) {
            return;
        }

        const end = this._byteLength / 2;
        for (let lhs = 0; lhs < end; lhs++) {
            const rhs = this._byteLength - lhs - 1;
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
