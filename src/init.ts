#!/usr/bin/env node

import minimist from 'minimist';
import { Args } from '@/feature/args';
import { BuildConfig, ConfigType, createPath, getConfig } from '@/feature/defaultConfig';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { deleteCatalog } from '@/util/deleteCatalog';
import { downloadConfig } from '@/util/downloadConfig';
import { isFolderExist } from '@/util/isFolderExist';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
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

export const init = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  debugFunction(config.isDebug, '=== Start SNP INIT ===', '[INIT]');

  return await createCatalog(config.temporaryFolder).then(() => {
    return { ...config };
  });
};

export const createConfigFile = async (config: ConfigType): Promise<ConfigType> => {
  debugFunction(config.isDebug, { config }, '[INIT] debugFunction');
  const { snpCatalog, template, sUpdaterVersion } = config;

  await isFolderExist({
    folderPath: snpCatalog,
    createFolder: true,
  });

  await createFile({
    filePath: config.snpConfigFile,
    content: JSON.stringify(config),
    isDebug: config.isDebug,
  });

  debugFunction(config.isDebug, { sUpdaterVersion, template }, '[INIT] created snp config file');

  return config;
};

export const downloadRemoteConfig = async (config: ConfigType): Promise<ConfigType> => {
  const { fileMap, templateVersion }: BuildConfig = await downloadConfig(config);

  debugFunction(config.isDebug, { fileMap, templateVersion }, '[INIT] download form remote repo');

  return { ...config, templateVersion, fileMap };
};
export const buildConfig = async (config: ConfigType): Promise<ConfigType> => {
  const newConfig: ConfigType = await readFile(config.snpConfigFile).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );
  newConfig.fileMap = config.fileMap;

  if (newConfig?.fileMap) {
    newConfig.fileMap.snpFiles = {};
  }

  const buildFile = async (config: ConfigType) => {
    const files = config?.fileMap?.files;

    if (files) {
      const arrayFileNames = Object.keys(files);
      for (const fileName of arrayFileNames) {
        const defaultFilePath = files[fileName].find((element) => element.includes('-default.md')) || '';
        const instructionsFilePath = files[fileName].find((element) => element.includes('-instructions.md')) || '';
        const customFilePath = defaultFilePath.replace('-default.md', '-custom.md');
        const extendFilePath = defaultFilePath.replace('-default.md', '-extend.md');

        const contentDefaultFile = await readFile(defaultFilePath);
        await createFile({
          filePath: createPath([config.projectCatalog, fileName]),
          content: contentDefaultFile,
          isDebug: config.isDebug,
        });

        await createFile({
          filePath: customFilePath,
          content: '',
          isDebug: config.isDebug,
        });

        await createFile({
          filePath: extendFilePath,
          content: '',
          isDebug: config.isDebug,
        });

        if (newConfig?.fileMap && newConfig.fileMap.snpFiles) {
          newConfig.fileMap.snpFiles[fileName] = {
            defaultFile: defaultFilePath,
            instructionsFile: instructionsFilePath,
            customFile: customFilePath,
            extendFile: extendFilePath,
          };
        }
      }
    }

    await updateJson({
      filePath: config.snpConfigFile,
      newContent: newConfig,
      replace: true,
    });
  };
  await buildFile(config);
  return config;
};

export const cleanUp = async (config: ConfigType): Promise<void> => {
  debugFunction(config.isDebug, { config }, '[INIT] final config');
  await deleteCatalog(config.temporaryFolder, config.isDebug);

  debugFunction(config.isDebug, '=== final SNP INIT ===');
};

const args: Args = minimist(process.argv.slice(2));

init(args)
  .then((config) => createConfigFile(config))
  .then((config) => downloadRemoteConfig(config))
  .then((config) => buildConfig(config))
  .then((config) => cleanUp(config));
