import Bits from "./Bits";

abstract class Text extends Bits {
    private text: string;

    public getText(): string {
        return this.text;
    }

    public setText(text: string): void {
        this.text = text;
    }
}

export default Text;
