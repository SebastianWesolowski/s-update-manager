#!/usr/bin/env node

import minimist from 'minimist';
import { Args } from '@/feature/args';
import { cleanUp } from '@/feature/cleanUp';
import { ConfigType, createPath, getConfig } from '@/feature/defaultConfig';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { readFile } from '@/util/readFile';

export const build = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  if (!config.fileMap) {
    throw new Error('Config file not exists, use init script');
  }

  debugFunction(config.isDebug, '=== Start SNP BUILD ===');

  return await createCatalog(config.temporaryFolder).then(() => {
    return { ...config };
  });
};

export const buildSNP = async (config: ConfigType): Promise<ConfigType> => {
  const snpFiles = config.fileMap?.snpFiles;
  for (const fileName in snpFiles) {
    if (snpFiles.hasOwnProperty(fileName)) {
      const snpFile = snpFiles[fileName];

      const snpTypeFile = ['defaultFile', 'instructionsFile', 'customFile', 'extendFile'];
      const contentFile = {};
      for (const fileType of snpTypeFile) {
        contentFile[fileType] = await readFile(snpFile[fileType]);
      }

      const getContnetToBuild = () => {
        if (contentFile['customFile']) {
          return contentFile['customFile'];
        }

        if (contentFile['extendFile']) {
          return contentFile['defaultFile'] + '\n' + contentFile['extendFile'];
        }

        return contentFile['defaultFile'];
      };

      await createFile({
        filePath: createPath([config.projectCatalog, fileName]),
        content: getContnetToBuild(),
        isDebug: config.isDebug,
      });
    }
  }
  return config;
};

const args: Args = minimist(process.argv.slice(2));

let finalConfig = {
  isDebug: false,
};

build(args)
  .then((config) => {
    finalConfig = config;
    return buildSNP(config);
  })
  .then((config) => {
    finalConfig = config;
    return cleanUp(config);
  })
  .finally(() => {
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[INIT] final config');
    debugFunction(finalConfig?.isDebug, '=== final SNP BUILD ===');
  });
