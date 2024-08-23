import { ConfigType } from '@/feature/config/types';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { isFolderExist } from '@/util/isFolderExist';

export const createConfigFile = async (config: ConfigType): Promise<ConfigType> => {
  debugFunction(config.isDebug, { config }, '[INIT] debugFunction');
  const { snpCatalog, sUpdaterVersion, repositoryUrl } = config;

  await isFolderExist({
    folderPath: snpCatalog,
    createFolder: true,
  });

  await createFile({
    filePath: config.snpConfigFile,
    content: JSON.stringify(config),
    isDebug: config.isDebug,
  });

  debugFunction(config.isDebug, { sUpdaterVersion, repositoryUrl }, '[INIT] created snp config file');

  return config;
};
