import { ConfigType } from '@/feature/config/types';
import { deletePath } from '@/util/deletePath';
import { formatJsonWithPrettier } from '@/util/formatPrettier';

export const cleanUp = async (config: ConfigType): Promise<ConfigType> => {
  try {
    await formatJsonWithPrettier(config.snpFileMapConfig);
    await formatJsonWithPrettier(config.snpConfigFile);
    await deletePath(config.temporaryFolder, true);
    return config;
  } catch (error) {
    console.error(`Error isnt exist: ${(error as Error).message}`);
    return config;
  }
};
