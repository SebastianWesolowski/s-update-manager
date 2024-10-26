#!/usr/bin/env node

import minimist from 'minimist';
import { cleanUpSinglePath } from './feature/__tests__/cleanForTests';
import { createPath } from './util/createPath';
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

export const initPrepareTemplate = async (templateConfig: ConfigTemplateType): Promise<void> => {
  await cleanUpSinglePath({
    path: createPath([templateConfig.projectCatalog, 'tools']),
    isDebug: templateConfig.isDebug,
  });
  await createFile({
    filePath: createPath([templateConfig.projectCatalog, 'tools', 'test.sh']),
    options: {
      createFolder: true,
    },
    content: 'lorem ipsum dolor sit amet, consectetur adipis',
  });

  if (process.env.STYPE === 'template') {
    await cleanUpSinglePath({
      path: templateConfig.templateCatalogPath,
      isDebug: templateConfig.isDebug,
    });
  }

  if (process.env.STYPE === 'templateRebuild') {
    await createFile({
      filePath: createPath([templateConfig.projectCatalog, 'tools', 'test-new.sh']),
      options: {
        createFolder: true,
      },
      content: 'lorem ipsum dolor sit amet, consectetur adipis new SH',
    });
  }

  return;
};

export const init = async (args: ArgsTemplate): Promise<{ templateConfig: ConfigTemplateType }> => {
  const templateConfig: ConfigTemplateType = getTemplateConfig(args);
  const { isDebug, templateCatalogPath, repositoryMapFilePath } = templateConfig;
  debugFunction(isDebug, '=== Start prepare template ===', '[PrepareTemplate]');

  if (process.env.SDEBUG === 'true') {
    await initPrepareTemplate(templateConfig);
  }

  await createCatalog(templateCatalogPath);

  if (
    !(await isFileOrFolderExists({
      isDebug,
      filePath: repositoryMapFilePath,
    }))
  ) {
    debugFunction(isDebug, { fileExist: repositoryMapFilePath, templateConfig }, '[PrepareTemplate]');

    await createFile({
      filePath: repositoryMapFilePath,
      content: JSON.stringify({
        ...defaultRepositoryMapFileConfig,
        ...templateConfig,
      }),
      isDebug,
      options: {
        overwriteFile: true,
      },
    });
    templateConfig.bumpVersion = false;
  }

  debugFunction(isDebug, templateConfig, '[PrepareTemplate] END init');
  return { templateConfig };
};

const args: ArgsTemplate = minimist(process.argv.slice(2));

let finalConfig = {
  isDebug: false,
};

init(args)
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
  .then(({ redOnlyFileList, templateConfig, templateFileList, fileList, rootPathFileList }) => {
    finalConfig = templateConfig;
    return updateTemplateConfig({
      templateConfig,
      fileList,
      templateFileList,
      rootPathFileList,
      redOnlyFileList,
    });
  })
  .then(async ({ templateConfig }) => {
    await formatJsonWithPrettier(templateConfig.repositoryMapFilePath);
  })
  .finally(() => {
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[PrepareTemplate] final config');
    debugFunction(finalConfig?.isDebug, '=== Final prepare template ===', '[PrepareTemplate]');
  });
