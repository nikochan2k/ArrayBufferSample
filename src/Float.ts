import Number from "./Number";

class Float extends Number {
    constructor(isDouble: boolean = true) {
        super(isDouble ? 64 : 32);
    }

    public setValue(value: number) {
        this.value = value;
        const platform = new ArrayBuffer(this.byteLength);
        const f = this.byteLength === 8
            ? new Float64Array(platform) : new Float32Array(platform);
        f[0] = value;
        const u8platform = new Uint8Array(platform);
        this.u8 = this.swap(u8platform);
    }

    public setBuffer(buffer: ArrayBuffer) {
        this.u8 = new Uint8Array(buffer);
        const u8platform = this.swap(this.u8);
        const f = this.byteLength === 8
            ? new Float64Array(u8platform.buffer) : new Float32Array(u8platform.buffer);
        this.value = f[0];
    }

    protected swap(u8platform: Uint8Array): Uint8Array {
        if (Number.isBigEndian) {
            return u8platform;
        }

        const end = this.byteLength / 2;
        for (let lhs = 0; lhs < end; lhs++) {
            const rhs = this.byteLength - lhs - 1;
            this.swapByte(u8platform, lhs, rhs);
        }
        return u8platform;
    }

    private swapByte(u8platform: Uint8Array, lhs: number, rhs: number): void {
        const temp = u8platform[lhs];
        u8platform[lhs] = u8platform[rhs];
        u8platform[rhs] = temp;
    }
}

export default Float;
