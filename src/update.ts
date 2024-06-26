#!/usr/bin/env node

import minimist from 'minimist';
import { Args } from '@/feature/args';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { cleanUp } from '@/feature/cleanUp';
import { ConfigType, createPath, getConfig } from '@/feature/defaultConfig';
import { updateFromRemote } from '@/feature/updateFromRemote';
import { createCatalog } from '@/util/createCatalog';
import { debugFunction } from '@/util/debugFunction';
import { deletePath } from '@/util/deletePath';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJson } from '@/util/updateJson';

export const update = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  if (!config.fileMap) {
    throw new Error('Config file not exists, use init script');
  }

  debugFunction(config.isDebug, '=== Start SNP UPDATE ===');

  return await createCatalog(config.temporaryFolder).then(() => {
    return { ...config };
  });
};

export const cleanUpBeforeUpdate = async (config: ConfigType): Promise<ConfigType> => {
  const snpFiles = config.fileMap?.snpFiles;
  for (const fileName in snpFiles) {
    if (snpFiles.hasOwnProperty(fileName)) {
      const snpFile = snpFiles[fileName];

      const snpTypeFile = ['defaultFile', 'instructionsFile'];
      const contentFile = {};
      for (const fileType of snpTypeFile) {
        contentFile[fileType] = await readFile(snpFile[fileType]);
      }

      await deletePath(createPath([config.projectCatalog, fileName]), config.isDebug);
    }
  }
  await readFile(createPath([config.projectCatalog, config.REPOSITORY_MAP_FILE_NAME]))
    .then(async (bufferData) => {
      const fileMap: { fileMap: string[]; templateVersion: string } = parseJSON(bufferData.toString()).fileMap;

      for (const file in fileMap) {
        await deletePath(createPath([config.projectCatalog, file]), config.isDebug);
      }
    })
    .then(async () => {
      await deletePath(createPath([config.projectCatalog, config.REPOSITORY_MAP_FILE_NAME]), config.isDebug);
    });

  const newConfig = { ...config };

  delete newConfig.fileMap;

  await updateJson({
    filePath: config.snpConfigFile,
    newContent: newConfig,
    replace: true,
  });
  return config;
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
    return updateFromRemote(config);
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
    debugFunction(finalConfig?.isDebug, '=== final SNP UPDATE ===');
  });
