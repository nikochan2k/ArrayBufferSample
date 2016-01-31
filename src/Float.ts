import Num from "./Num";

class Float extends Num {
    _byteLength: number;

    constructor(nullable: boolean, isDouble: boolean = true) {
        super(nullable);
        this._valueBitLength = (isDouble ? 64 : 32);
        this._byteLength = Math.floor(this._valueBitLength / 8);
    }

    _valueToU8(value: number, bitLength: number): Uint8Array {
        const buffer = new ArrayBuffer(this._byteLength);
        const f = this._byteLength === 8
            ? new Float64Array(buffer) : new Float32Array(buffer);
        f[0] = value;
        const u8 = new Uint8Array(buffer);
        this._toNetworkByteOrder(u8);
        return u8;
    }

    _getRawValue(): number {
        return this.getValue();
    }

    _u8ToValue(u8: Uint8Array, byteLength: number): number {
        this._toNetworkByteOrder(u8);
        const f = (byteLength === 8)
            ? new Float64Array(u8.buffer) : new Float32Array(u8.buffer);
        return f[0];
    }

    _setRawValue(rawValue: number): void {
        this.setValue(rawValue);
    }

    _toNetworkByteOrder(u8: Uint8Array): void {
        if (Num._isBigEndian) {
            return;
        }

        const end = this._byteLength / 2;
        for (let lhs = 0; lhs < end; lhs++) {
            const rhs = this._byteLength - lhs - 1;
            this._swap(u8, lhs, rhs);
        }
    }

    _swap(u8platform: Uint8Array, lhs: number, rhs: number): void {
        const temp = u8platform[lhs];
        u8platform[lhs] = u8platform[rhs];
        u8platform[rhs] = temp;
    }
}

export default Float;
