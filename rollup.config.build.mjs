import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { glob } from 'glob';
import typescript from 'rollup-plugin-typescript2';

const files = glob.sync('src/**/*.ts', { nodir: true });

export default {
  input: files,
  output: {
    format: 'esm',
    dir: 'lib',
    preserveModules: true,
    entryFileNames: '[name].mjs', // Main file name
    chunkFileNames: '[name]-[hash].mjs', // Chunk file name
  },
  plugins: [
    json(),
    nodeResolve(),
    babel({
      // Syntax conversion
      babelHelpers: 'bundled',
      exclude: 'node_modules/**', // Excluding conversion for files in node_modules
    }),
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
  ],
};
