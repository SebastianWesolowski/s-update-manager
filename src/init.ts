#!/usr/bin/env node

import minimist from 'minimist';
import { Args } from '@/feature/args';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { cleanUp } from '@/feature/cleanUp';
import { ConfigType, getConfig } from '@/feature/defaultConfig';
import { prepareExtraFileFromConfig } from '@/feature/prepareExtraFileFromConfig';
import { updateFromRemote } from '@/feature/updateFromRemote';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { isFileExists } from '@/util/isFileExists';
import { isFolderExist } from '@/util/isFolderExist';
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

  if ((await isFileExists(config.snpFileMapConfig)) && (await isFileExists(config.snpConfigFile))) {
    if (process.env.SDEBUG !== 'true') {
      throw new Error('Config file exists, use build script or update');
    }
  }

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

const args: Args = minimist(process.argv.slice(2));

let finalConfig = {
  isDebug: false,
};

init(args)
  .then((config) => {
    finalConfig = config;
    return createConfigFile(config);
  })
  .then((config) => {
    finalConfig = config;
    return updateFromRemote(config);
  })
  .then((config) => {
    finalConfig = config;
    return buildFromConfig(config);
  })
  .then((config) => {
    finalConfig = config;
    return prepareExtraFileFromConfig(config);
  })
  .then((config) => {
    finalConfig = config;
    return cleanUp(config);
  })
  .finally(() => {
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[INIT] final config');
    debugFunction(finalConfig?.isDebug, '=== final SNP INIT ===');
  });
