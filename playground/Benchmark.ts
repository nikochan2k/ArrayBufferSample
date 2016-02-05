interface Action {
    (): void;
}

function benchmark(description: string, action: Action): void {
    'use strict';
    action();
    const start = new Date();
    for (let i = 0; i < 10000000; i++) {
        action();
    }
    const end = new Date();
    if(description){
        console.log(description + ": " + (end.getTime() - start.getTime()) + "ms");
    }
}

function divideOrRightShift() {
    'use strict';
    benchmark("logical shift", () => {
        39 >> 3;
    });
    benchmark("arithmetic shift", () => {
        39 >>> 3;
    });
    benchmark("divide", () => {
        Math.floor(39 / 8);
    });
}

function modOrMask() {
    'use strict';
    benchmark("mask", () => {
        10 & 0x7;
    });
    benchmark("mod", () => {
        10 % 8;
    });
}

function multiplyOrLeftShift() {
    'use strict';
    benchmark("shift", () => {
        10 << 3;
    });
    benchmark("multiply", () => {
        10 * 8;
    });
}

function log2OrNlz(){
    'use strict';
    const buffer = new ArrayBuffer(8);
    const f64 = new Float64Array(buffer);
    const u32 = new Uint32Array(buffer);

    benchmark("nlz", () => {
        f64[0] = 9007199254740991;
        (u32[1] >> 20) - 1022;
    });
    benchmark("log2ByLN2", () => {
        Math.log(1024) / Math.LN2;
    });
    benchmark("log2ByLog2E", () => {
        Math.log(1024) * Math.LOG2E;
    });
}

benchmark(null, () => {});
log2OrNlz();
modOrMask();
divideOrRightShift();
multiplyOrLeftShift();
