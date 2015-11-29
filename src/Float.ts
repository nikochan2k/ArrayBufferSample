import Number from "./Number";

class Float extends Number {
    constructor(optional: boolean, isDouble: boolean = true) {
        super(optional, isDouble ? 64 : 32);
    }

    setValue(value: number) {
        this._value = value;
        const platform = new ArrayBuffer(this._byteLength);
        const f = this._byteLength === 8
            ? new Float64Array(platform) : new Float32Array(platform);
        f[0] = value;
        const u8platform = new Uint8Array(platform);
        this._u8 = this._toNetworkByteOrder(u8platform);
    }

    setBuffer(buffer: ArrayBuffer) {
        this._u8 = new Uint8Array(buffer);
        const u8platform = this._toNetworkByteOrder(this._u8);
        const f = this._byteLength === 8
            ? new Float64Array(u8platform.buffer) : new Float32Array(u8platform.buffer);
        this._value = f[0];
    }

    protected _toNetworkByteOrder(u8platform: Uint8Array): Uint8Array {
        if (Number._isBigEndian) {
            return u8platform;
        }

        const end = this._byteLength / 2;
        for (let lhs = 0; lhs < end; lhs++) {
            const rhs = this._byteLength - lhs - 1;
            this._swap(u8platform, lhs, rhs);
        }
        return u8platform;
    }

    protected _swap(u8platform: Uint8Array, lhs: number, rhs: number): void {
        const temp = u8platform[lhs];
        u8platform[lhs] = u8platform[rhs];
        u8platform[rhs] = temp;
    }
}

export default Float;
