import Bits from "./Bits";

abstract class Text extends Bits {
    public text: string;

    public abstract setText(text: string): void;
}

export default Text;
