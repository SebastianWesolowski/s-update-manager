#!/usr/bin/env node

import minimist from 'minimist';
import { Args } from '@/feature/args/args';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { cleanUp } from '@/feature/cleanUp';
import { getConfig } from '@/feature/config/defaultConfig';
import { ConfigType } from '@/feature/config/types';
import { createConfigFile } from '@/feature/createConfigFile';
import { debugFunction } from '@/util/debugFunction';
import { downloadConfig } from '@/util/downloadConfig';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { prepareBaseSnpFileMap } from '@/util/prepareBaseFile';
import { prepareExtraFile } from '@/util/prepareExtraFile';

export const init = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  if ((await isFileOrFolderExists(config.snpFileMapConfig)) && (await isFileOrFolderExists(config.snpConfigFile))) {
    if (process.env.SDEBUG !== 'true') {
      throw new Error('Config file exists, use build script or update');
    }
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
  .then((config) => {
    finalConfig = config;
    return downloadConfig(config);
  })
  .then((config) => {
    finalConfig = config;
    return prepareBaseSnpFileMap(config);
  })
  .then((config) => {
    finalConfig = config;
    return prepareExtraFile(config);
  })
  .then((config) => {
    finalConfig = config;
    return buildFromConfig(config);
  })
  .then((config) => {
    finalConfig = config;
    return cleanUp(config);
  })

  .finally(() => {
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[INIT] final config');
    debugFunction(finalConfig?.isDebug, '=== final SNP INIT ===');
  });
