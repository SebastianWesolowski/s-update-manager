import { BuildConfig, ConfigType } from '@/feature/defaultConfig';
import { debugFunction } from '@/util/debugFunction';
import { downloadConfig } from '@/util/downloadConfig';

export const updateFromRemote = async (config: ConfigType): Promise<ConfigType> => {
  const { fileMap, templateVersion }: BuildConfig = await downloadConfig(config);

  debugFunction(config.isDebug, { fileMap, templateVersion }, '[INIT] download form remote repo');

  return { ...config, templateVersion, fileMap };
};
