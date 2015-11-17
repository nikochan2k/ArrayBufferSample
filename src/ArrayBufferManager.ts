class ArrayBufferManager {
    private buffer: ArrayBuffer;

    constructor() {
        this.buffer = new ArrayBuffer(16);
    }

    getUint8(byteOffset: number): number {
        const view = new Uint8Array(this.buffer, byteOffset);
        return view[0];
    }

    setUint8(byteOffset: number, value: number): void {
        const view = new Uint8Array(this.buffer, byteOffset);
        view[0] = value;
    }

    getInt8(byteOffset: number): number {
        const view = new Int8Array(this.buffer, byteOffset);
        return view[0];
    }

    setInt8(byteOffset: number, value: number): void {
        const view = new Int8Array(this.buffer, byteOffset);
        view[0] = value;
    }

    getUint16(byteOffset: number): number {
        const view = new Uint16Array(this.buffer, byteOffset);
        return view[0];
    }

    setUint16(byteOffset: number, value: number): void {
        const view = new Uint16Array(this.buffer, byteOffset);
        view[0] = value;
    }

    getInt16(byteOffset: number): number {
        const view = new Int16Array(this.buffer, byteOffset);
        return view[0];
    }

    setInt16(byteOffset: number, value: number): void {
        const view = new Int16Array(this.buffer, byteOffset);
        view[0] = value;
    }

    getUint32(byteOffset: number): number {
        const view = new Uint32Array(this.buffer, byteOffset);
        return view[0];
    }

    setUint32(byteOffset: number, value: number): void {
        const view = new Uint32Array(this.buffer, byteOffset);
        view[0] = value;
    }

    getInt32(byteOffset: number): number {
        const view = new Int32Array(this.buffer, byteOffset);
        return view[0];
    }

    setInt32(byteOffset: number, value: number): void {
        const view = new Int32Array(this.buffer, byteOffset);
        view[0] = value;
    }

    getFloat32(byteOffset: number): number {
        const view = new Float32Array(this.buffer, byteOffset);
        return view[0];
    }

    setFloat32(byteOffset: number, value: number): void {
        const view = new Float32Array(this.buffer, byteOffset);
        view[0] = value;
    }

    getFloat64(byteOffset: number): number {
        const view = new Float64Array(this.buffer, byteOffset);
        return view[0];
    }

    setFloat64(byteOffset: number, value: number): void {
        const view = new Float64Array(this.buffer, byteOffset);
        view[0] = value;
    }
}

export default ArrayBufferManager;
