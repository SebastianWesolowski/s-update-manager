#!/usr/bin/env node

import * as path from 'path';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { deleteCatalog } from '@/util/deleteCatalog';
import { downloadConfig } from '@/util/downloadConfig';
import { isFolderExist } from '@/util/isFolderExist';
import { redFile } from '@/util/readFile';
import { readPackageVersion } from '@/util/readVersionPackage';

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

type initConfig = {
  snpCatalog: string;
  template: availableTemplate | string;
  sUpdaterVersion: string;
  projectCatalog: string;
  temporaryFolder: string;
};

type buildConfig = initConfig & {
  fileMap: { fileMap: string[]; files: Record<string, string[]> };
};

export const init = async (args: string[]): Promise<initConfig> => {
  console.log({ args });
  const [argSnpCatalog, argTemplate, argProjectCatalog] = args;
  const version = await readPackageVersion('./package.json');
  const projectCatalog = argProjectCatalog ? argProjectCatalog : './';
  const snpCatalog = argSnpCatalog ? `${projectCatalog}/${argSnpCatalog}` : `${projectCatalog}./snp`;
  const template = argTemplate ? argTemplate : 'node';
  const temporaryFolder = `${projectCatalog}temporary/`;

  return await createCatalog(temporaryFolder).then(() => {
    console.log({ snpCatalog, template, sUpdaterVersion: version, projectCatalog, temporaryFolder });
    return { snpCatalog, template, sUpdaterVersion: version, projectCatalog, temporaryFolder };
  });
};

export const createConfigFile = async (config: initConfig): Promise<initConfig> => {
  const { snpCatalog, template, sUpdaterVersion } = config;

  const filePath = `${snpCatalog}/snp.config.json`;

  await isFolderExist({
    folderPath: snpCatalog,
    createFolder: true,
  });

  await createFile({
    filePath,
    content: JSON.stringify({ sUpdaterVersion, template }),
  });

  return config;
};

export const downloadRemoteConfig = async (config: initConfig): Promise<buildConfig> => {
  const fileMap = await downloadConfig(config.template, config.snpCatalog, config.temporaryFolder);

  const organizeFileMap = (fileMap: string[]) => {
    const files = {};

    fileMap.forEach((file) => {
      const fileName = file.substring(0, file.lastIndexOf('-'));

      if (!files[fileName]) {
        files[fileName] = [];
      }
      files[fileName].push(`${config.snpCatalog}/${file}`);
    });

    return { fileMap, files };
  };
  return { ...config, fileMap: organizeFileMap(fileMap) };
};
export const buildConfig = async (config: buildConfig): Promise<buildConfig> => {
  const buildFile = async ({
    fileMap,
  }: {
    fileMap: {
      fileMap: string[];
      files: Record<string, string[]>;
    };
  }) => {
    const files = fileMap.files;
    const contentFile = Object.keys(files);

    for (const fileName of contentFile) {
      const defaultFile = files[fileName].find((element) => element.includes('-default.md')) || '';
      const contentFile = await redFile(defaultFile);
      await createFile({
        filePath: `${config.projectCatalog}/${fileName}`,
        content: contentFile,
      });
    }
  };

  await buildFile(config);
  return config;
};

export const cleanUp = async (config: buildConfig): Promise<any> => {
  console.log({ endConfig: config });
  deleteCatalog(config.temporaryFolder);
};

let args = process.argv.slice(3);

if (String(process.env.SDEBUG) === 'true') {
  // argSnpCatalog - snp catalog
  // argTemplate - template remote github
  // argProjectCatalog - project catalog
  args = [path.join('./.snp'), 'node', './test/fakeProjectRootfolder'];
  console.log({ args });
}
init(args)
  .then((config) => createConfigFile(config))
  .then((config) => downloadRemoteConfig(config))
  .then((config) => buildConfig(config))
  .then((config) => cleanUp(config));
