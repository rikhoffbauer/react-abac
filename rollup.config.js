import commonjs from "rollup-plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import sourcemaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import url from "rollup-plugin-url";

import pkg from "./package.json" assert { type: "json" };

export default {
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            exports: "named",
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: "es",
            exports: "named",
            sourcemap: true,
        },
    ],
    plugins: [
        external(),
        url(),
        resolve(),
        typescript({
            clean: true,
            exclude: ["*.d.ts", "**/*.d.ts"],
        }),
        commonjs(),
        sourcemaps(),
        terser(),
    ],
};
