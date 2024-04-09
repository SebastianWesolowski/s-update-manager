#!/usr/bin/env node
import dotenv from 'dotenv';
import * as path from 'path';
import { createFile } from '@/util/createFile';
import { downloadConfig } from '@/util/downloadConfig';
import { isFolderExist } from '@/util/isFolderExist';
import { readPackageVersion } from '@/util/readVersionPackage';

dotenv.config();
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
type downloadRemoteConfig = { filePath: string; template: availableTemplate | string; sUpdaterVersion: string };

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

  return { filePath, template, sUpdaterVersion };
};

export const downloadRemoteConfig = async (config: downloadRemoteConfig) => {
  await downloadConfig(config.template);

  //ENDWORK HERE
  // stowrozny fn do pobierania congigu z repo trzeba przetestoać i przygotować szablon na zdalnyum repo
  return;
};

let args = process.argv.slice(2);

if (Boolean(process.env.SDEBUG)) {
  args = [path.join('./.snp'), 'node'];
}
init(args)
  .then((config) => createConfigFile(config))
  .then((config) => downloadRemoteConfig(config))
  .then((args) => console.log('zbudowanie plików na podstawie configu'));
