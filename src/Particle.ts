import Binary from "./Binary";

abstract class Particle<T> {
    _value: T;
    _nullable: boolean;

    constructor(nullable: boolean) {
        this._nullable = nullable;
    }

    setValue(value: T): void {
        this._value = value;
    }

    getValue(): T {
        return this._value;
    }

    abstract read(binary: Binary): void;

    abstract write(binary: Binary): void;

}

export default Particle;
