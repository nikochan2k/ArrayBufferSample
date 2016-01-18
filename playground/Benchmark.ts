
interface Action {
    (): void;
}

function benchmark(description: string, action: Action): void {
    'use strict';
    const start = new Date();
    for (let i = 0; i < 10000000; i++) {
        action();
    }
    const end = new Date();
    console.log(description + ": " + (end.getTime() - start.getTime()) + "ms");
}

benchmark("divide", () => {
    Math.floor(39 / 8);
});
benchmark("arithmetic shift", () => {
    39 >>> 3;
});
benchmark("logical shift", () => {
    39 >> 3;
});

benchmark("mod", () => {
    10 % 8;
});
benchmark("mask", () => {
    10 & 0x7;
});

benchmark("multiply", () => {
    10 * 8;
});
benchmark("shift", () => {
    10 << 3;
});
