import typescript from 'rollup-plugin-typescript2';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {glob} from 'glob';
import json from "@rollup/plugin-json";
import fs from 'fs-extra'; // Importuj fs-extra do manipulacji plikami
import babel from "@rollup/plugin-babel";

const files = glob.sync('src/**/*.ts', { nodir: true });
console.log(files)

export default {
    input: [
        'src/init.ts',
        'src/index.ts',
        'src/util/wget.ts',
        'src/util/toCreateFile.ts',
        'src/util/readVersionPackage.ts',
        'src/util/isFolderExist.ts',
        'src/util/isFileExists.ts',
        'src/util/downloadConfig.ts',
        'src/util/createFile.ts'
    ]    ,
    output: {
        format: 'esm',
        dir: 'lib',
        preserveModules: true,
        entryFileNames: '[name].mjs', // Nazwa pliku głównego
        chunkFileNames: '[name]-[hash].mjs', // Nazwa pliku chunka
    },
    plugins: [
        json(),
        nodeResolve(),
        babel({ // Konwersja składni
            babelHelpers: 'bundled',
            exclude: 'node_modules/**', // Wyłączanie konwersji dla plików w node_modules
        }),
        commonjs(),
        typescript({
            tsconfig: 'tsconfig.json',
        }),
        {
            name: 'add-module-type',
            generateBundle() {
                // Dodaj pole "type": "module" do package.json po wygenerowaniu plików
                const packageJsonPath = 'dist/package/package.json';
                const packageJson = fs.readJsonSync(packageJsonPath);
                packageJson.type = 'module';
                fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
            },
        },
    ],

};


