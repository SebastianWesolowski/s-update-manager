import { ConfigType } from '@/feature/config/types';
import { deletePath } from '@/util/deletePath';
import { formatJsonWithPrettier } from '@/util/formatPrettier';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';

export const cleanUp = async (config: ConfigType): Promise<{ config: ConfigType }> => {
  try {
    await formatJsonWithPrettier(config.snpFileMapConfig, config.snpFileMapConfig, config.isDebug);
    await formatJsonWithPrettier(config.snpConfigFile, config.snpConfigFile, config.isDebug);
    if (await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.temporaryFolder })) {
      await deletePath(config.temporaryFolder, config.isDebug);
    }
    return { config };
  } catch (error) {
    if (config.isDebug) {
      console.error(`Error isnt exist: ${(error as Error).message}`);
    }
    return { config };
  }
};
