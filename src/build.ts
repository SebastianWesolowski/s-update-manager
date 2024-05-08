#!/usr/bin/env node

import minimist from 'minimist';
import { Args } from '@/feature/args';
import { defaultConfig, defaultConfigType } from '@/feature/defaultConfig';
import { debugFunction } from '@/util/debugFunction';
import { deleteCatalog } from '@/util/deleteCatalog';

export const build = async (args: Args): Promise<defaultConfigType> => {
  const config = await defaultConfig(args);

  debugFunction(config.isDebug, '=== Start SNP BUILD ===');

  return { ...config };
};

export const buildSNP = async (config: defaultConfigType): Promise<defaultConfigType> => {
  //   const { fileMap, ...newConfigContent } = { ...config };
  //   await updateJson({ filePath: config.snpConfigFile, newContent: { ...newConfigContent } });
  //   const buildFile = async ({
  //     fileMap,
  //   }: {
  //     fileMap: {
  //       fileMap: string[];
  //       files: Record<string, string[]>;
  //     };
  //   }) => {
  //     const files = fileMap.files;
  //     const contentFile = Object.keys(files);
  //
  //     for (const fileName of contentFile) {
  //       const defaultFile = files[fileName].find((element) => element.includes('-default.md')) || '';
  //       const customFile = defaultFile.replace('-default.md', '-custom.md');
  //       const extendFile = defaultFile.replace('-default.md', '-extend.md');
  //       const contentFile = await redFile(defaultFile);
  //       await createFile({
  //         filePath: path.join(config.projectCatalog, fileName),
  //         content: contentFile,
  //         isDebug: config.isDebug,
  //       });
  //
  //       await createFile({
  //         filePath: customFile,
  //         content: '',
  //         isDebug: config.isDebug,
  //       });
  //       await createFile({
  //         filePath: extendFile,
  //         content: '',
  //         isDebug: config.isDebug,
  //       });
  //     }
  //   };
  //   await buildFile(config);
  return config;
};

export const cleanUp = async (config: defaultConfigType): Promise<any> => {
  debugFunction(config.isDebug, { config }, 'final config');
  await deleteCatalog(config.temporaryFolder, config.isDebug);

  debugFunction(config.isDebug, '=== final SNP BUILD ===');
};

const args: Args = minimist(process.argv.slice(2));

build(args)
  .then((config) => buildSNP(config))
  .then((config) => cleanUp(config));
