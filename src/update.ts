#!/usr/bin/env node

import minimist from 'minimist';
import { Args } from '@/feature/args/args';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { cleanUp } from '@/feature/cleanUp';
import { cleanUpBeforeUpdate } from '@/feature/cleanUpBeforeUpdate';
import { cleanUpFileTree } from '@/feature/cleanUpFileTree';
import { getConfig } from '@/feature/config/defaultConfig';
import { ConfigType } from '@/feature/config/types';
import { downloadConfig } from '@/feature/downloadConfig';
import { createCatalog } from '@/util/createCatalog';
import { debugFunction } from '@/util/debugFunction';
import { prepareBaseSnpFileMap } from '@/util/prepareBaseFile';
import { scanExtraFile } from '@/util/scanExtraFile';

export const update = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  if (!config.snpFileMapConfig) {
    throw new Error('Config file not exists, use init script');
  }

  debugFunction(config.isDebug, '=== Start SNP UPDATE ===');

  return await createCatalog(config.temporaryFolder).then(() => {
    return { ...config };
  });
};

const args: Args = minimist(process.argv.slice(2));

let finalConfig = {
  isDebug: false,
};

update(args)
  .then((config) => {
    finalConfig = config;
    return cleanUpBeforeUpdate(config);
  })
  .then((config) => {
    finalConfig = config;
    return downloadConfig(config);
  })
  .then(({ config }) => {
    finalConfig = config;
    return cleanUpFileTree(config);
  })
  .then((config) => {
    finalConfig = config;
    return prepareBaseSnpFileMap(config);
  })
  .then((config) => {
    finalConfig = config;
    return scanExtraFile(config);
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
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[UPDATE] final config');
    debugFunction(finalConfig?.isDebug, '=== final SNP UPDATE ===');
  });
