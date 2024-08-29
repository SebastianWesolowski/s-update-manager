import { ConfigType } from '@/feature/config/types';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { isFolderExist } from '@/util/isFolderExist';

export const createConfigFile = async (config: ConfigType): Promise<{ config: ConfigType; configFilePath: string }> => {
  debugFunction(config.isDebug, { config }, '[INIT] debugFunction');
  const { snpCatalog, sUpdaterVersion, remoteRepository } = config;

  await isFolderExist({
    folderPath: snpCatalog,
    createFolder: true,
  });

  const configFilePath = await createFile({
    filePath: config.snpConfigFile,
    content: JSON.stringify(config),
    isDebug: config.isDebug,
  });

  debugFunction(config.isDebug, { sUpdaterVersion, remoteRepository }, '[INIT] created snp config file');

  return { config, configFilePath };
};
