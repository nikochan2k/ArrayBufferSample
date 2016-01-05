import Binary from "./Binary";

abstract class Particle {
    _nullable: boolean;
    _isNull: boolean;

    constructor(nullable: boolean) {
        this._nullable = nullable;
        this._isNull = (nullable ? true : false);
    }

    abstract read(binary: Binary): void;

    abstract write(binary: Binary): void;

}

export default Particle;
