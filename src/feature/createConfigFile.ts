import { ConfigType } from '@/feature/config/types';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { isFolderExist } from '@/util/isFolderExist';

export const createConfigFile = async (config: ConfigType): Promise<{ config: ConfigType; configFilePath: string }> => {
  // TODO [SC-26] create config in root directory
  debugFunction(config.isDebug, { config }, '[INIT] debugFunction');
  const { sumCatalog, sUpdaterVersion, remoteRepository } = config;

  await isFolderExist({
    folderPath: sumCatalog,
    createFolder: true,
  });

  const configFilePath = await createFile({
    filePath: config.sumConfigFile,
    content: JSON.stringify(config),
    isDebug: config.isDebug,
  });

  debugFunction(config.isDebug, { sUpdaterVersion, remoteRepository }, '[INIT] created sum config file');

  return { config, configFilePath };
};
