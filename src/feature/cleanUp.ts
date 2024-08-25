import { ConfigType } from '@/feature/config/types';
import { deletePath } from '@/util/deletePath';
import { formatJsonWithPrettier } from '@/util/formatPrettier';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';

export const cleanUp = async (config: ConfigType): Promise<ConfigType> => {
  try {
    await formatJsonWithPrettier(config.snpFileMapConfig);
    await formatJsonWithPrettier(config.snpConfigFile);
    if (await isFileOrFolderExists(config.temporaryFolder)) {
      await deletePath(config.temporaryFolder, config.isDebug);
    }
    return config;
  } catch (error) {
    console.error(`Error isnt exist: ${(error as Error).message}`);
    return config;
  }
};
