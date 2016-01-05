import Num from "./Num";
import Binary from "./Binary";

class Float extends Num {
    _byteLength: number;

    constructor(nullable: boolean, isDouble: boolean = true) {
        super(nullable, 0);
        this._valueBitLength = (isDouble ? 64 : 32);
        this._byteLength = (this._valueBitLength / 8) | 0;
    }

    _writeRawValue(binary: Binary): void {
        const platform = new ArrayBuffer(this._byteLength);
        const f = this._byteLength === 8
            ? new Float64Array(platform) : new Float32Array(platform);
        f[0] = this.getValue();
        const u8 = new Uint8Array(platform);
        this._changeNetworkByteOrder(u8);
        this._writeU8(binary, u8, this._valueBitLength);
    }

    _getRawValue(): number {
        // override _writeRawValue method, so this method is no sence.
        return undefined;
    }

    _readRawValue(binary: Binary): void {
        const bitLength = this._valueBitLength;
        const platform = new ArrayBuffer(this._byteLength);
        const f = (this._byteLength === 8)
            ? new Float64Array(platform) : new Float32Array(platform);
        const u8 = new Uint8Array(platform);

        // instance                     bitOffset bitLength bo+bl 8-(bo+bl)%8 (bo+bl)/8
        // "xooxxxxx"                   1         2         3     5           0
        // "xxxooooo ooxxxxxx"          3         7         10    6           1
        // "xxxxxxoo oooooooo ooooooox" 6         17        23    1           2
        const total = binary.bitOffset + bitLength;
        const left = (total % 8);
        const right = 8 - left;
        for (let i = Math.ceil(total / 8) - 1; 0 <= i; i--) {
            const byteIndex = binary.byteOffset + i;
            u8[i] = binary.u8[byteIndex] >>> right;
            if (0 < i) {
                u8[i] |= (binary.u8[byteIndex - 1] << left) & 0xFF;
            } else {
                u8[i] &= (0xFF >>> left);
            }
        }
        this._forwardBit(binary, bitLength);

        this._changeNetworkByteOrder(u8);
        this.setValue(f[0]);
    }

    _setRawValue(rawValue: number): void {
        // override _readRawValue method, so this method is no sence.
    }

    protected _changeNetworkByteOrder(u8: Uint8Array): void {
        if (Num._isBigEndian) {
            return;
        }

        const end = this._byteLength / 2;
        for (let lhs = 0; lhs < end; lhs++) {
            const rhs = this._byteLength - lhs - 1;
            this._swap(u8, lhs, rhs);
        }
    }

    protected _swap(u8platform: Uint8Array, lhs: number, rhs: number): void {
        const temp = u8platform[lhs];
        u8platform[lhs] = u8platform[rhs];
        u8platform[rhs] = temp;
    }
}

export default Float;
