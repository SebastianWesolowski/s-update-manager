import { ConfigType } from '@/feature/defaultConfig';
import { deletePath } from '@/util/deletePath';

export const cleanUp = async (config: ConfigType): Promise<void> => {
  await deletePath(config.temporaryFolder, config.isDebug);
};
