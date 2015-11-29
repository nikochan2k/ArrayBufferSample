import Particle from "./Particle";

abstract class Bits extends Particle {
    _bitLength: number;

    constructor(optional: boolean, bitLength: number) {
        super(optional);
        this._bitLength = bitLength;
    }
}

export default Bits;
