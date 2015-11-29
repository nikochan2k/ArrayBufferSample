import Bits from "./Bits";

abstract class Text extends Bits {
    _text: string;

    abstract setText(text: string): void;

    getText(): string {
        return this._text;
    }
}

export default Text;
