import assert from "power-assert";

describe("Benchmark", () => {

    interface Action {
        (): void;
    }

    function benchmark(description: string, action: Action): void {
        const start = new Date();
        for (let i = 0; i < 10000000; i++) {
            action();
        }
        const end = new Date();
        console.log(description + ": " + (end.getTime() - start.getTime()) + "ms");
    }

    context("bitshift", () => {

        it("divide and shift", () => {
            benchmark("divide", () => {
                Math.floor(39 / 8);
            });

            benchmark("arithmetic shift", () => {
                39 >>> 3;
            });

            benchmark("logical shift", () => {
                39 >> 3;
            });
        });

        it("mod and mask", () => {
            benchmark("mod", () => {
                10 % 8;
            });

            benchmark("mask", () => {
                10 & 0x7;
            });
        });

        it("multiply and shift", () => {
            benchmark("multiply", () => {
                10 * 8;
            });

            benchmark("shift", () => {
                10 << 3;
            });
        });

    });

});
