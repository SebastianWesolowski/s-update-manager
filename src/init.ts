#!/usr/bin/env node

import minimist from 'minimist';
import * as path from 'path';
import { Args } from '@/feature/args';
import { defaultConfig, defaultConfigType } from '@/feature/defaultConfig';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { deleteCatalog } from '@/util/deleteCatalog';
import { downloadConfig } from '@/util/downloadConfig';
import { isFolderExist } from '@/util/isFolderExist';
import { redFile } from '@/util/readFile';
import { updateJson } from '@/util/updateJson';
//
// type PackageConfig = {
//   instructions: string;
//   default: string;
//   extends: string;
//   custom: string;
// };
//
// type Config = Record<
//   string,
//   {
//     name: string;
//     filePackage: PackageConfig;
//     sequence: string[];
//   }
// >;
//
// const config: Config = {
//   'README.md': {
//     name: 'README.md',
//     filePackage: {
//       instructions: 'README.md-instructions.md',
//       default: 'README.md-default.md',
//       extends: 'README.md-extends.md',
//       custom: 'README.md-custom.md',
//     },
//     sequence: ['default', 'extends', 'custom'],
//   },
// };

export type buildConfig = defaultConfigType & {
  fileMap: { fileMap: string[]; files: Record<string, string[]> };
  templateVersion: string;
};

export const init = async (args: Args): Promise<defaultConfigType> => {
  const config = await defaultConfig(args);

  debugFunction(config.isDebug, '=== Start SNP INIT ===');
  debugFunction(config.isDebug, { args });

  return await createCatalog(config.temporaryFolder).then(() => {
    return { ...config };
  });
};

export const createConfigFile = async (config: defaultConfigType): Promise<defaultConfigType> => {
  debugFunction(config.isDebug, { config });
  const { snpCatalog, template, sUpdaterVersion, snpConfigFileName } = config;

  config.snpConfigFile = path.join(snpCatalog, snpConfigFileName);
  await isFolderExist({
    folderPath: snpCatalog,
    createFolder: true,
  });

  await createFile({
    filePath: config.snpConfigFile,
    content: JSON.stringify({ sUpdaterVersion, template }),
    isDebug: config.isDebug,
  });

  debugFunction(config.isDebug, { sUpdaterVersion, template }, 'created snp config file');

  return config;
};

export const downloadRemoteConfig = async (config: defaultConfigType): Promise<buildConfig> => {
  const { fileMap, templateVersion } = await downloadConfig(config);

  debugFunction(config.isDebug, { fileMap, templateVersion }, 'download form remote repo');
  const organizeFileMap = (fileMap: string[]) => {
    const files = {};

    fileMap.forEach((file) => {
      const fileName = file.substring(0, file.lastIndexOf('-'));

      if (!files[fileName]) {
        files[fileName] = [];
      }
      files[fileName].push(path.join(config.snpCatalog, file));
    });

    return { fileMap, files };
  };
  return { ...config, templateVersion, fileMap: organizeFileMap(fileMap) };
};
export const buildConfig = async (config: buildConfig): Promise<buildConfig> => {
  const { fileMap, ...newConfigContent } = { ...config };
  await updateJson({ filePath: config.snpConfigFile, newContent: { ...newConfigContent } });
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
      const customFile = defaultFile.replace('-default.md', '-custom.md');
      const extendFile = defaultFile.replace('-default.md', '-extend.md');
      const contentFile = await redFile(defaultFile);
      await createFile({
        filePath: path.join(config.projectCatalog, fileName),
        content: contentFile,
        isDebug: config.isDebug,
      });

      await createFile({
        filePath: customFile,
        content: '',
        isDebug: config.isDebug,
      });
      await createFile({
        filePath: extendFile,
        content: '',
        isDebug: config.isDebug,
      });
    }
  };
  await buildFile(config);
  return config;
};

export const cleanUp = async (config: buildConfig): Promise<any> => {
  debugFunction(config.isDebug, { config }, 'final config');
  await deleteCatalog(config.temporaryFolder, config.isDebug);

  debugFunction(config.isDebug, '=== final SNP INIT ===');
};

const args: Args = minimist(process.argv.slice(2));

init(args)
  .then((config) => createConfigFile(config))
  .then((config) => downloadRemoteConfig(config))
  .then((config) => buildConfig(config))
  .then((config) => cleanUp(config));
