import Bits from "./Bits";

abstract class Text extends Bits {
    text: string;

    abstract setText(text: string): void;
}

export default Text;
