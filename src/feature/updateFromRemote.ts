import { ConfigType } from '@/feature/defaultConfig';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { debugFunction } from '@/util/debugFunction';
import { downloadConfig } from '@/util/downloadConfig';

export const updateFromRemote = async (config: ConfigType): Promise<ConfigType> => {
  const fileMapConfig: FileMapConfig = await downloadConfig(config);

  debugFunction(config.isDebug, { fileMapConfig }, '[INIT] download form remote repo');

  return { ...config, templateVersion: fileMapConfig.templateVersion };
};
