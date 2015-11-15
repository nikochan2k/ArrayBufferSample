/// <reference path="../typings/tsd.d.ts" />

import assert from "power-assert";
import Sample from "../src/Sample";

describe("Sample", () => {
    context("Int8", () => {
        it("Set and Get Uint8", () => {
            const sample = new Sample();
            sample.setUint8(0, 24);
            assert.deepEqual(24, sample.getUint8(0));
        });

        it("Set Uint8 and Get Int8", () => {
            const sample = new Sample();
            sample.setUint8(0, 255);
            assert.deepEqual(-1, sample.getInt8(0));
        });
    });

    context("Int16", () => {
        it("Set Uint16 and Get Int16", () => {
            const sample = new Sample();
            sample.setUint16(0, 65535);
            assert.deepEqual(-1, sample.getInt16(0));
        });

        it("Set Uint16 and Get Int8", () => {
            const sample = new Sample();
            sample.setUint16(0, 65535);
            assert.deepEqual(255, sample.getUint8(0));
            assert.deepEqual(-1, sample.getInt8(1));
        });
    });

    context("Int32", () => {
        it("Set Uint32 and Get Int32", () => {
            const sample = new Sample();
            sample.setUint32(0, 4294967295);
            assert.deepEqual(-1, sample.getInt32(0));
        });

        it("Set Uint32, and Get Int8, Int16", () => {
            const sample = new Sample();
            sample.setUint32(0, 4294967295);
            assert.deepEqual(255, sample.getUint8(0));
            assert.deepEqual(-1, sample.getInt8(1));
            assert.deepEqual(-1, sample.getInt16(2));
        });
    });

    context("Float32", () => {
        it("Set Float32 and Get Float32", () => {
            const sample = new Sample();
            sample.setFloat32(0, 123.4567);
            assert.deepEqual(123.4567, sample.getFloat32(0).toFixed(4));
        });

        it("Set Float32 and Get Float32, Expect error", () => {
            const sample = new Sample();
            sample.setFloat32(0, 123.456789);
            assert.notDeepEqual(123.456789, sample.getFloat32(0).toFixed(6));
        });
    });

    context("Float64", () => {
        it("Set Float64 and Get Float64", () => {
            const sample = new Sample();
            sample.setFloat64(0, 123456789.012345);
            assert.deepEqual(123456789.012345, sample.getFloat64(0).toFixed(6));
        });

        it("Set Float64 and Get Float64, Exceed limit", () => {
            const sample = new Sample();
            sample.setFloat64(0, 123456789.0123456789);
            assert.deepEqual(123456789.0123456789, sample.getFloat64(0));
        });
    });

});
