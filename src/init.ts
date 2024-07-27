#!/usr/bin/env node

import minimist from 'minimist';
import { Args } from '@/feature/args';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { cleanUp } from '@/feature/cleanUp';
import { createConfigFile } from '@/feature/createConfigFile';
import { ConfigType, getConfig } from '@/feature/defaultConfig';
import { debugFunction } from '@/util/debugFunction';
import { downloadConfig } from '@/util/downloadConfig';
import { isFileExists } from '@/util/isFileExists';
import { prepareBaseSnpFileMap } from '@/util/prepareBaseFile';
import { prepareExtraFile } from '@/util/prepareExtraFile';

export const init = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  if ((await isFileExists(config.snpFileMapConfig)) && (await isFileExists(config.snpConfigFile))) {
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
