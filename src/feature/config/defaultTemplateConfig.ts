import { ArgsTemplate, setArgsTemplate } from '@/feature/args/argsTemplate';
import { defaultTemplateConfig } from '@/feature/config/const';
import { ConfigTemplateType, PartialConfig } from '@/feature/config/types';
import { createPath } from '@/util/createPath';

export const regenerateTemplateConfig = (config: ConfigTemplateType): ConfigTemplateType => {
  const regeneratedConfig = { ...config };

  if (regeneratedConfig.templateCatalogName) {
    regeneratedConfig.templateCatalogPath = createPath([
      regeneratedConfig.projectCatalog,
      regeneratedConfig.templateCatalogName,
    ]);
  }

  if (regeneratedConfig.projectCatalog && regeneratedConfig.templateCatalogName) {
    regeneratedConfig.repositoryMapFilePath = createPath([
      regeneratedConfig.projectCatalog,
      regeneratedConfig.templateCatalogName,
      regeneratedConfig.repositoryMapFileName,
    ]);
  }

  return regeneratedConfig;
};

export const updateTemplateKeyConfig = (
  config: ConfigTemplateType,
  keyToUpdate: PartialConfig<ConfigTemplateType>
): ConfigTemplateType => {
  const keyName = Object.keys(keyToUpdate)[0];
  const value = keyToUpdate[keyName];
  const valueToUpdate = { [keyName]: value };
  const updatedConfig = { ...config, ...valueToUpdate };

  return regenerateTemplateConfig(updatedConfig);
};

export const getTemplateConfig = (args: ArgsTemplate): ConfigTemplateType => {
  let config = { ...defaultTemplateConfig };

  const argsObject: ArgsTemplate = setArgsTemplate(args);

  config = updateTemplateKeyConfig(config, {
    isDebug: argsObject.isDebug || config.isDebug,
  });
  config = updateTemplateKeyConfig(config, {
    projectCatalog: argsObject.projectCatalog || config.projectCatalog,
  });

  return regenerateTemplateConfig(config);
};
