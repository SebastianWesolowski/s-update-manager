#!/usr/bin/env node
import * as path from 'path';
import { createFile } from '@/util/createFile';
import { isFolderExist } from '@/util/isFolderExist';

// const dir = path.dirname('./');
const rootCatalog = path.join('./snp/test');

const configTemplate = ['README.md', '.github/PULL_REQUEST_TEMPLATE.md'];

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

export const init = async ({
  files = configTemplate[0],
  rootCatalog,
}: {
  files: string[] | string;
  rootCatalog?: string;
}) => {
  const rootDir = rootCatalog ? rootCatalog : path.dirname('./');
  const snpRootFolder = path.join(rootDir, 'snp');

  await isFolderExist({
    folderPath: snpRootFolder,
    createFolder: true,
  });

  await createFile({
    filePath: `${snpRootFolder}/snp.config.json`,
    content: JSON.stringify({ version: '2.0.0', template: 'node' }),
  });
};

init({ files: configTemplate[0], rootCatalog }).then((r) => console.log('init'));
