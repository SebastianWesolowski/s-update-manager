#!/usr/bin/env node

import * as path from 'path';
import { createFile } from '@/util/createFile';
import { downloadConfig } from '@/util/downloadConfig';
import { isFolderExist } from '@/util/isFolderExist';
import { readPackageVersion } from '@/util/readVersionPackage';

// const dir = path.dirname('./');
// const rootCatalog = path.join('./.snp');

// const configTemplate = ['README.md', '.github/PULL_REQUEST_TEMPLATE.md'];

type PackageConfig = {
  instructions: string;
  default: string;
  extends: string;
  custom: string;
};

type Config = Record<
  string,
  {
    name: string;
    filePackage: PackageConfig;
    sequence: string[];
  }
>;

const config: Config = {
  'README.md': {
    name: 'README.md',
    filePackage: {
      instructions: 'README.md-instructions.md',
      default: 'README.md-default.md',
      extends: 'README.md-extends.md',
      custom: 'README.md-custom.md',
    },
    sequence: ['default', 'extends', 'custom'],
  },
};

export type availableTemplate = 'node' | string;

type initConfig = { rootCatalog: string; template: availableTemplate; sUpdaterVersion: string };
type downloadRemoteConfig = { rootCatalog: string; template: availableTemplate | string; sUpdaterVersion: string };
type buildConfig = {
  rootCatalog: string;
  template: availableTemplate | string;
  sUpdaterVersion: string;
  fileMap: { fileMap: string[]; files: Record<string, string[]> };
};

export const init = async (args: string[]): Promise<initConfig> => {
  const [argRootCatalog, argTemplate] = args;
  const version = await readPackageVersion('./package.json');
  const rootCatalog = argRootCatalog ? argRootCatalog : './snp';
  const template = argTemplate ? argTemplate : 'node';

  return { rootCatalog, template, sUpdaterVersion: version };
};

export const createConfigFile = async (config: initConfig): Promise<downloadRemoteConfig> => {
  const { rootCatalog, template, sUpdaterVersion } = config;

  const filePath = `${rootCatalog}/snp.config.json`;

  await isFolderExist({
    folderPath: rootCatalog,
    createFolder: true,
  });

  await createFile({
    filePath,
    content: JSON.stringify({ sUpdaterVersion, template }),
  });

  return { rootCatalog, template, sUpdaterVersion };
};

export const downloadRemoteConfig = async (config: downloadRemoteConfig): Promise<buildConfig> => {
  const fileMap = await downloadConfig(config.template, config.rootCatalog);

  const organizeFileMap = (fileMap: string[]) => {
    const files = {};

    fileMap.forEach((file) => {
      const fileName = file.substring(0, file.lastIndexOf('-'));

      if (!files[fileName]) {
        files[fileName] = [];
      }
      files[fileName].push(file);
    });

    return { fileMap, files };
  };
  return { ...config, fileMap: organizeFileMap(fileMap) };
};
export const buildConfig = async (config: buildConfig): Promise<any> => {
  console.log(config);

  const buildFile = ({ fileMap, content, path }) => {
    console.log('b');
  };
  //END WORK HERE
};

let args = process.argv.slice(2);

if (Boolean(process.env.SDEBUG)) {
  args = [path.join('./.snp'), 'node'];
}
init(args)
  .then((config) => createConfigFile(config))
  .then((config) => downloadRemoteConfig(config))
  .then((config) => buildConfig(config));

// fileMap: {
//   fileMap: [ 'README.md-default.md', 'README.md-instructions.md', 'ab.js-default.md' ],
//       files: { 'README.md': [ 'README.md-default.md', 'README.md-instructions.md' ],  'ab.js': [ 'ab.js-default.md'] }
// }
