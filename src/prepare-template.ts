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

export const prepareTemplate = async (args: ArgsTemplate): Promise<{ templateConfig: ConfigTemplateType }> => {
  const templateConfig: ConfigTemplateType = getTemplateConfig(args);

  debugFunction(templateConfig.isDebug, '=== Start prepare template ===', '[PrepareTemplate]');

  if (!(await isFileOrFolderExists(templateConfig.templateCatalogPath)) || process.env.SDEBUG !== 'true') {
    await createCatalog(templateConfig.templateCatalogPath);
  }
  if (
    ((await isFileOrFolderExists(templateConfig.templateCatalogPath)) &&
      !(await isFileOrFolderExists(templateConfig.repositoryMapFilePath))) ||
    process.env.SDEBUG !== 'true'
  ) {
    debugFunction(
      templateConfig.isDebug,
      `isFileOrFolderExists ${templateConfig.repositoryMapFilePath}`,
      '[PrepareTemplate]'
    );
    debugFunction(templateConfig.isDebug, templateConfig, '[PrepareTemplate]');
    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(defaultRepositoryMapFileConfig),
      isDebug: templateConfig.isDebug,
      options: {
        overwriteFile: true,
      },
    });
    templateConfig.bumpVersion = false;
  }

  debugFunction(templateConfig.isDebug, templateConfig, '[PrepareTemplate] END init');
  return { templateConfig };
};

const args: ArgsTemplate = minimist(process.argv.slice(2));

let finalConfig = {
  isDebug: false,
};

prepareTemplate(args)
  .then(({ templateConfig }) => {
    finalConfig = templateConfig;
    return bumpVersion(templateConfig);
  })
  .then(({ templateConfig }) => {
    finalConfig = templateConfig;
    return cleanUpTemplate(templateConfig);
  })
  .then(({ templateConfig }) => {
    finalConfig = templateConfig;
    return scanProjectFolder(templateConfig);
  })
  .then(({ templateConfig, templateFileList }) => {
    finalConfig = templateConfig;
    return prepareFileList({ templateConfig, templateFileList });
  })
  .then(({ templateConfig, templateFileList, fileList, rootPathFileList }) => {
    finalConfig = templateConfig;
    return updateTemplateConfig({ config: templateConfig, fileList, templateFileList, rootPathFileList });
  })
  .then(async ({ templateConfig }) => {
    await formatJsonWithPrettier(templateConfig.repositoryMapFilePath);
  })
  .finally(() => {
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[PrepareTemplate] final config');
    debugFunction(finalConfig?.isDebug, '=== Final prepare template ===', '[PrepareTemplate]');
  });
