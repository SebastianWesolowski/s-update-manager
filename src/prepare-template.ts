#!/usr/bin/env node

import minimist from 'minimist';
import { ArgsTemplate } from '@/feature/args/argsTemplate';
import { defaultRepositoryMapFileConfig } from '@/feature/config/const';
import { getTemplateConfig } from '@/feature/config/defaultTemplateConfig';
import { ConfigTemplateType } from '@/feature/config/types';
import { bumpVersion } from '@/feature/prepareTemplate/bumpVersion';
import { cleanUpTemplate } from '@/feature/prepareTemplate/cleanUpTemplate';
import { prepareFileList } from '@/feature/prepareTemplate/prepareFileList';
import { scanProjectFolder } from '@/feature/prepareTemplate/scanProjectFolder';
import { updateTemplateConfig } from '@/feature/prepareTemplate/updateTemplateConfig';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { formatJsonWithPrettier } from '@/util/formatPrettier';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';

export const prepareTemplate = async (args: ArgsTemplate): Promise<ConfigTemplateType> => {
  const config: ConfigTemplateType = await getTemplateConfig(args);

  debugFunction(config.isDebug, '=== Start prepare template ===', '[PrepareTemplate]');

  if (!(await isFileOrFolderExists(config.templateCatalogPath)) || process.env.SDEBUG !== 'true') {
    await createCatalog(config.templateCatalogPath);
  }
  if (
    ((await isFileOrFolderExists(config.templateCatalogPath)) &&
      !(await isFileOrFolderExists(config.repositoryMapFilePath))) ||
    process.env.SDEBUG !== 'true'
  ) {
    debugFunction(config.isDebug, `isFileOrFolderExists ${config.repositoryMapFilePath}`, '[PrepareTemplate]');
    debugFunction(config.isDebug, config, '[PrepareTemplate]');
    await createFile({
      filePath: config.repositoryMapFilePath,
      content: JSON.stringify(defaultRepositoryMapFileConfig),
      isDebug: config.isDebug,
      options: {
        overwriteFile: true,
      },
    });
    config.bumpVersion = false;
  }

  debugFunction(config.isDebug, config, '[PrepareTemplate] END init');
  return config;
};

const args: ArgsTemplate = minimist(process.argv.slice(2));

let finalConfig = {
  isDebug: false,
};

prepareTemplate(args)
  .then((config) => {
    finalConfig = config;
    return bumpVersion(config);
  })
  .then((config) => {
    finalConfig = config;
    return cleanUpTemplate(config);
  })
  .then((config) => {
    finalConfig = config;
    return scanProjectFolder(config);
  })
  .then(({ config, templateFileList }) => {
    finalConfig = config;
    return prepareFileList({ config, templateFileList });
  })
  .then(({ config, templateFileList, fileList, rootPathFileList }) => {
    finalConfig = config;
    return updateTemplateConfig({ config, fileList, templateFileList, rootPathFileList });
  })
  .then(async ({ config }) => {
    await formatJsonWithPrettier(config.repositoryMapFilePath);
  })
  .finally(() => {
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[PrepareTemplate] final config');
    debugFunction(finalConfig?.isDebug, '=== Final prepare template ===', '[PrepareTemplate]');
  });
