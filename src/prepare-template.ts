#!/usr/bin/env node

import minimist from 'minimist';
import { ArgsTemplate } from '@/feature/args/argsTemplate';
import { getTemplateConfig } from '@/feature/config/defaultTemplateConfig';
import { ConfigTemplateType, RepositoryMapFileConfigType } from '@/feature/config/types';
import { bumpVersion } from '@/feature/prepareTemplate/bumpVersion';
import { prepareTemplateFile } from '@/feature/prepareTemplate/prepareTemplateFile';
import { scanProjectFolder } from '@/feature/prepareTemplate/scanProjectFolder';
import { updateTemplateConfig } from '@/feature/prepareTemplate/updateTemplateConfig';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { isFileExists } from '@/util/isFileExists';

export const defaultRepositoryMapFileConfig: RepositoryMapFileConfigType = {
  templateVersion: '1.0.0',
  fileMap: [],
};
export const prepareTemplate = async (args: ArgsTemplate): Promise<ConfigTemplateType> => {
  const config: ConfigTemplateType = await getTemplateConfig(args);

  debugFunction(config.isDebug, '=== Start prepare template ===', '[PrepareTemplate]');

  if (!(await isFileExists(config.repositoryMapFilePath)) || process.env.SDEBUG !== 'true') {
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
    return scanProjectFolder(config);
  })
  .then(({ config, fileList }) => {
    finalConfig = config;
    return prepareTemplateFile({ config, fileList });
  })
  .then(({ config, templateFileList }) => {
    finalConfig = config;
    return updateTemplateConfig({ config, templateFileList });
  })
  //coś linkin się popsuly w repomap.json jest przyklad
  .finally(() => {
    debugFunction(finalConfig?.isDebug, { finalConfig }, '[PrepareTemplate] final config');
    debugFunction(finalConfig?.isDebug, '=== Final prepare template ===', '[PrepareTemplate]');
  });
