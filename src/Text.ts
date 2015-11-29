import Particle from "./Particle";

abstract class Text extends Particle {
    _byteLength: number;
    _text: string;

    abstract setText(text: string): void;

    getText(): string {
        return this._text;
    }
}

export default Text;
