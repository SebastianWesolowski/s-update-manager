import { ConfigType } from '@/feature/config/types';
import { createCatalog } from '@/util/createCatalog';
import { formatJsonWithPrettier } from '@/util/formatPrettier';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';

export const cleanUp = async (config: ConfigType): Promise<ConfigType> => {
  try {
    await formatJsonWithPrettier(config.snpFileMapConfig);
    await formatJsonWithPrettier(config.snpConfigFile);
    if (!(await isFileOrFolderExists(config.temporaryFolder))) {
      await createCatalog(config.temporaryFolder);
    }
    return config;
  } catch (error) {
    console.error(`Error isnt exist: ${(error as Error).message}`);
    return config;
  }
};
