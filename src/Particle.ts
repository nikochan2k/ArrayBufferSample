import Binary from "./Binary";

abstract class Particle<T> {
    _value: T;
    _nullable: boolean;

    constructor(nullable: boolean) {
        this._nullable = nullable;
    }

    get value(): T {
        return this._getValue();
    }

    set value(v: T) {
        this._setValue(v);
    }

    _setValue(value: T): void {
        this._value = value;
    }

    _getValue(): T {
        return this._value;
    }

    abstract read(binary: Binary): void;

    abstract write(binary: Binary): void;

}

export default Particle;
