import Str from "./Str";
import BitsType from "./BitsType";

class UTF16Str extends Str {
    constructor() {
        super();
        this.bitsType = BitsType.utf16string;
    }

    public get Text() {
        return this.Text;
    }

    public set Text(text: String) {
        this.Text = text;
    }
}

export default UTF16Str;
