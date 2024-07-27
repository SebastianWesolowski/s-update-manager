import { ConfigType } from '@/feature/defaultConfig';
import { deletePath } from '@/util/deletePath';

export const cleanUp = async (config: ConfigType): Promise<ConfigType> => {
  try {
    await deletePath(config.temporaryFolder, true);
    return config;
  } catch (error) {
    console.error(`Error isnt exist: ${(error as Error).message}`);
    return config;
  }
};
