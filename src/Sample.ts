class Sample {
    private buffer: ArrayBuffer;

    constructor() {
        this.buffer = new ArrayBuffer(16);
    }

    getUint8(pos: number): number {
        const view = new Uint8Array(this.buffer, pos);
        return view[0];
    }

    setUint8(pos: number, value: number): void {
        const view = new Uint8Array(this.buffer, pos);
        view[0] = value;
    }

    getInt8(pos: number): number {
        const view = new Int8Array(this.buffer, pos);
        return view[0];
    }

    setInt8(pos: number, value: number): void {
        const view = new Int8Array(this.buffer, pos);
        view[0] = value;
    }

    getUint16(pos: number): number {
        const view = new Uint16Array(this.buffer, pos);
        return view[0];
    }

    setUint16(pos: number, value: number): void {
        const view = new Uint16Array(this.buffer, pos);
        view[0] = value;
    }

    getInt16(pos: number): number {
        const view = new Int16Array(this.buffer, pos);
        return view[0];
    }

    setInt16(pos: number, value: number): void {
        const view = new Int16Array(this.buffer, pos);
        view[0] = value;
    }

    getUint32(pos: number): number {
        const view = new Uint32Array(this.buffer, pos);
        return view[0];
    }

    setUint32(pos: number, value: number): void {
        const view = new Uint32Array(this.buffer, pos);
        view[0] = value;
    }

    getInt32(pos: number): number {
        const view = new Int32Array(this.buffer, pos);
        return view[0];
    }

    setInt32(pos: number, value: number): void {
        const view = new Int32Array(this.buffer, pos);
        view[0] = value;
    }

    getFloat32(pos: number): number {
        const view = new Float32Array(this.buffer, pos);
        return view[0];
    }

    setFloat32(pos: number, value: number): void {
        const view = new Float32Array(this.buffer, pos);
        view[0] = value;
    }

    getFloat64(pos: number): number {
        const view = new Float64Array(this.buffer, pos);
        return view[0];
    }

    setFloat64(pos: number, value: number): void {
        const view = new Float64Array(this.buffer, pos);
        view[0] = value;
    }
}

export default Sample;
