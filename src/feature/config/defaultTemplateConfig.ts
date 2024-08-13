import { ArgsTemplate, setArgsTemplate } from '@/feature/args/argsTemplate';
import { defaultTemplateConfig } from '@/feature/config/const';
import { ConfigTemplateType, PartialConfig } from '@/feature/config/types';
import { createPath } from '@/util/createPath';

const regenerateConfig = (config: ConfigTemplateType): ConfigTemplateType => {
  const regeneratedConfig = { ...config };

  if (regeneratedConfig.projectCatalog) {
    regeneratedConfig.repositoryMapFilePath = createPath([
      regeneratedConfig.projectCatalog,
      regeneratedConfig.repositoryMapFileName,
    ]);
  }

  return regeneratedConfig;
};

const updateTemplateConfig = (
  config: ConfigTemplateType,
  keyToUpdate: PartialConfig<ConfigTemplateType>
): ConfigTemplateType => {
  const keyName = Object.keys(keyToUpdate)[0];
  const value = keyToUpdate[keyName];
  const valueToUpdate = { [keyName]: value };
  const updatedConfig = { ...config, ...valueToUpdate };

  return regenerateConfig(updatedConfig);
};

export const getTemplateConfig = async (args: ArgsTemplate): Promise<ConfigTemplateType> => {
  let config = { ...defaultTemplateConfig };

  const argsObject: ArgsTemplate = setArgsTemplate(args);

  config = updateTemplateConfig(config, {
    isDebug: argsObject.isDebug || config.isDebug,
  });
  config = updateTemplateConfig(config, {
    projectCatalog: argsObject.projectCatalog || config.projectCatalog,
  });

  return regenerateConfig(config);
};
