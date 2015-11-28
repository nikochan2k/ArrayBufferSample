import Number from "./Number";

class Float extends Number {
    private isDouble: boolean;

    constructor(isDouble: boolean = true) {
        super();
        this.isDouble = isDouble;
        this.byteLength = isDouble ? 8 : 4;
        this.bitLength = this.byteLength * 8;
    }

    public setValue(value: number) {
        this.value = value;
        const buffer = new ArrayBuffer(this.byteLength);
        const f = this.isDouble ? new Float64Array(buffer) : new Float32Array(buffer);
        f[0] = value;
        this.swap(buffer);
        this.buffer = buffer;
    }

    public setBuffer(buffer: ArrayBuffer) {
        this.swap(buffer);
        const f = this.isDouble ? new Float64Array(buffer) : new Float32Array(buffer);
        this.value = f[0];
    }

    protected swap(buffer: ArrayBuffer): void {
        if (Number.isBigEndian) {
            return;
        }

        const byteLength = buffer.byteLength;
        const end = byteLength / 2;
        for (let lhs = 0; lhs < end; lhs++) {
            const rhs = byteLength - lhs - 1;
            this.swapByte(buffer, lhs, rhs);
        }
    }

    private swapByte(buffer: ArrayBuffer, lhs: number, rhs: number): void {
        const u8 = new Uint8Array(buffer);
        const temp = u8[lhs];
        u8[lhs] = u8[rhs];
        u8[rhs] = temp;
    }
}

export default Float;
