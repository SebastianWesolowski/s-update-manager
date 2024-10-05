#!/usr/bin/env node

import minimist from 'minimist';
import { cleanUpSinglePath, cleanUpSpecificFiles } from './feature/__tests__/cleanForTests';
import { searchFilesInDirectory } from './feature/__tests__/searchFilesInDirectory';
import { Args } from '@/feature/args/args';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { cleanUp } from '@/feature/cleanUp';
import { getConfig } from '@/feature/config/defaultConfig';
import { ConfigType } from '@/feature/config/types';
import { createConfigFile } from '@/feature/createConfigFile';
import { downloadConfig } from '@/feature/downloadConfig';
import { prepareBaseSnpFileMap } from '@/feature/prepareBaseFile';
import { scanExtraFile } from '@/feature/scanExtraFile';
import { debugFunction } from '@/util/debugFunction';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';

export const init = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  if (
    (await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.snpFileMapConfig })) &&
    (await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.snpConfigFile }))
  ) {
    if (process.env.SDEBUG !== 'true') {
      throw new Error('Config file exists, use build script or update');
    }
  }

  if (process.env.SDEBUG === 'true') {
    await cleanUpSinglePath({
      path: config.snpCatalog,
      isDebug: config.isDebug,
    });
  }

  debugFunction(config.isDebug, '=== Start SNP INIT ===', '[INIT]');

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
  .then(({ config }) => {
    finalConfig = config;
    return downloadConfig(config);
  })
  .then(({ config }) => {
    finalConfig = config;
    return prepareBaseSnpFileMap(config);
  })
  .then(({ config }) => {
    finalConfig = config;
    return scanExtraFile(config);
  })
  .then(({ config }) => {
    finalConfig = config;
    return buildFromConfig(config);
  })
  .then(({ config }) => {
    finalConfig = config;
    return cleanUp(config);
  })

  .finally(() => {
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[INIT] final config');
    debugFunction(finalConfig?.isDebug, '=== final SNP INIT ===');
  });
