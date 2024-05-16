#!/usr/bin/env node

import minimist from 'minimist';
import { Args } from '@/feature/args';
import { ConfigType, getConfig } from '@/feature/defaultConfig';
import { createCatalog } from '@/util/createCatalog';
import { debugFunction } from '@/util/debugFunction';
import { deleteCatalog } from '@/util/deleteCatalog';

export const build = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  debugFunction(config.isDebug, '=== Start SNP BUILD ===');

  return await createCatalog(config.temporaryFolder).then(() => {
    return { ...config };
  });
};

export const buildSNP = async (config: ConfigType): Promise<ConfigType> => {
  // budowanie z plikow
  // default
  // extend
  // custom
  //

  return config;
};

export const cleanUp = async (config: ConfigType): Promise<any> => {
  debugFunction(config.isDebug, { config }, 'final config');
  await deleteCatalog(config.temporaryFolder, config.isDebug);

  debugFunction(config.isDebug, '=== final SNP BUILD ===');
};

const args: Args = minimist(process.argv.slice(2));

build(args)
  .then((config) => buildSNP(config))
  .then((config) => cleanUp(config));
