#!/usr/bin/env node

import minimist from 'minimist';
import { Args } from '@/feature/args';
import { ConfigType, createPath, getConfig } from '@/feature/defaultConfig';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { deleteCatalog } from '@/util/deleteCatalog';
import { readFile } from '@/util/readFile';

export const build = async (args: Args): Promise<ConfigType> => {
  const config = await getConfig(args);

  debugFunction(config.isDebug, '=== Start SNP BUILD ===');

  return await createCatalog(config.temporaryFolder).then(() => {
    return { ...config };
  });
};

export const buildSNP = async (config: ConfigType): Promise<ConfigType> => {
  // if (config && config.fileMap && config.fileMap.snpFiles) {
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
      console.log(getContnetToBuild());
    }
  }
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
