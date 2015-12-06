import Particle from "./Particle";

abstract class Bits extends Particle {
    _bitLength: number;

    constructor(optional: boolean, bitLength: number) {
        super(optional);
        this._setBitLength(bitLength);
    }

    _setBitLength(bitLength: number): void {
        this._bitLength = bitLength;
    }
}

export default Bits;
