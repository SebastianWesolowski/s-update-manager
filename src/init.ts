#!/usr/bin/env node

import minimist from 'minimist';
import { cleanUpSinglePath } from './feature/__tests__/cleanForTests';
import { Args } from '@/feature/args/args';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { cleanUp } from '@/feature/cleanUp';
import { getConfig } from '@/feature/config/defaultConfig';
import { ConfigType } from '@/feature/config/types';
import { createConfigFile } from '@/feature/createConfigFile';
import { downloadConfig } from '@/feature/downloadConfig';
import { prepareBaseSumFileMap } from '@/feature/prepareBaseFile';
import { scanExtraFile } from '@/feature/scanExtraFile';
import { debugFunction } from '@/util/debugFunction';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';

export const init = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  if (
    (await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.sumFileMapConfig })) &&
    (await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.sumConfigFile }))
  ) {
    if (process.env.SDEBUG !== 'true') {
      throw new Error('Config file exists, use build script or update');
    }
  }

  if (process.env.SDEBUG === 'true') {
    await cleanUpSinglePath({
      path: config.sumCatalog,
      isDebug: config.isDebug,
    });
  }

  debugFunction(config.isDebug, '=== Start SUM INIT ===', '[INIT]');

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
    return prepareBaseSumFileMap(config);
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
    debugFunction(finalConfig?.isDebug, '=== final SUM INIT ===');
  });
