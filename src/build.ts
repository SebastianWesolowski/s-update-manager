#!/usr/bin/env node

import minimist from 'minimist';
import { getConfig } from './feature/config/defaultConfig';
import { Args } from '@/feature/args/args';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { cleanUp } from '@/feature/cleanUp';
import { ConfigType } from '@/feature/config/types';
import { scanExtraFile } from '@/feature/scanExtraFile';
import { debugFunction } from '@/util/debugFunction';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';

export const build = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  if (
    !(await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.snpFileMapConfig })) &&
    !(await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.snpConfigFile }))
  ) {
    if (process.env.SDEBUG !== 'true') {
      throw new Error('Config files (snpFileMapConfig or snpConfigFile)  not exists, use init script');
    }
  }

  debugFunction(config.isDebug, '=== Start SNP BUILD ===');

  return config;
};

const args: Args = minimist(process.argv.slice(2));

let finalConfig = {
  isDebug: false,
};

build(args)
  .then((config) => {
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
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[BUILD] final config');
    debugFunction(finalConfig?.isDebug, '=== final SNP BUILD ===');
  });
