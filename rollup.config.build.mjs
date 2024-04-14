import typescript from 'rollup-plugin-typescript2';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {glob} from 'glob';
import json from "@rollup/plugin-json";

const files = glob.sync('src/**/*.ts', { nodir: true });

export default {
    input: files,
    output: {
        format: 'esm',
        dir: 'lib',
        preserveModules: true,
    },
    plugins: [
        json(),
        nodeResolve(),
        commonjs(),
        typescript({
            tsconfig: 'tsconfig.json',
        }),
    ],
};
