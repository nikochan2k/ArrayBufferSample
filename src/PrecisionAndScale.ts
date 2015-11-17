class PrecisionAndScale {
    private precision: number;
    private scale: number;
    constructor(value: number) {
        const str = value.toString();
        const length = str.length;
        const index = str.indexOf(".");
        if (index === -1) {
            this.precision = length;
            this.scale = 0;
        } else {
            this.precision = length - 1;
            this.scale = length - index - 1;
        }
    }
    public get Precision() {
        return this.precision;
    }
    public get Scale() {
        return this.scale;
    }
}

export default PrecisionAndScale;
