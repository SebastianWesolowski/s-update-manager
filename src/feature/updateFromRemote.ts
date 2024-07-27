import { ConfigType } from '@/feature/defaultConfig';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { downloadConfig } from '@/util/downloadConfig';

export const updateFromRemote = async (config: ConfigType): Promise<ConfigType> => {
  const snpFileMapConfig: FileMapConfig = await downloadConfig(config);

  return { ...config, templateVersion: snpFileMapConfig.templateVersion };
};
