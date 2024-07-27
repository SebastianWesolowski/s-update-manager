#!/usr/bin/env node

import minimist from 'minimist';
import { Args } from '@/feature/args';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { cleanUp } from '@/feature/cleanUp';
import { ConfigType, getConfig } from '@/feature/defaultConfig';
import { debugFunction } from '@/util/debugFunction';
import { isFileExists } from '@/util/isFileExists';

export const build = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  if (!(await isFileExists(config.snpFileMapConfig)) && (await isFileExists(config.snpConfigFile))) {
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
    return buildFromConfig(config);
  })
  .then((config) => {
    finalConfig = config;
    return cleanUp(config);
  })
  .finally(() => {
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[BUILD] final config');
    debugFunction(finalConfig?.isDebug, '=== final SNP BUILD ===');
  });
