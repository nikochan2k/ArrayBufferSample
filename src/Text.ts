import Bits from "./Bits";

abstract class Text extends Bits {
    _byteLength: number;
    _text: string;

    abstract setText(text: string): void;

    getText(): string {
        return this._text;
    }
}

export default Text;
