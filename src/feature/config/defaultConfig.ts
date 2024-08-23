import { format } from 'url';
import { Args, setArgs } from '@/feature/args/args';
import { defaultConfig } from '@/feature/config/const';
import { ConfigType, LocalConfigType, PartialConfig } from '@/feature/config/types';
import { createPath } from '@/util/createPath';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { readPackageVersion } from '@/util/readVersionPackage';

const regenerateConfig = async (config: ConfigType): Promise<ConfigType> => {
  const regeneratedConfig = { ...config };

  if (regeneratedConfig.projectCatalog) {
    regeneratedConfig.snpCatalog = createPath([regeneratedConfig.projectCatalog, '.snp/'], true);
    regeneratedConfig.temporaryFolder = createPath([regeneratedConfig.snpCatalog, 'temporary/'], true);
    regeneratedConfig.sUpdaterVersion = await readPackageVersion(
      createPath([regeneratedConfig.projectCatalog, 'package.json'])
    );
    regeneratedConfig.snpFileMapConfig = createPath([
      regeneratedConfig.snpCatalog,
      regeneratedConfig.REPOSITORY_MAP_FILE_NAME,
    ]);
    if (regeneratedConfig.snpConfigFileName) {
      regeneratedConfig.snpConfigFile = createPath([regeneratedConfig.snpCatalog, regeneratedConfig.snpConfigFileName]);
    }

    if (regeneratedConfig.remoteRepository) {
      regeneratedConfig.repositoryUrl = format(`${regeneratedConfig.remoteRepository}`);
    }
  }

  return regeneratedConfig;
};

const updateDefaultConfig = async (config: ConfigType, keyToUpdate: PartialConfig<ConfigType>): Promise<ConfigType> => {
  const keyName = Object.keys(keyToUpdate)[0];
  const folderKey = ['snpCatalog', 'projectCatalog', 'temporaryFolder'];
  const fileKey = ['snpConfigFileName', 'snpConfigFile'];
  const isFolder = folderKey.includes(keyName);
  const isFile = fileKey.includes(keyName);
  let value = keyToUpdate[keyName];

  if (isFolder || isFile) {
    value = createPath(value, isFolder);
  }

  const valueToUpdate = { [keyName]: value };

  const updatedConfig = { ...config, ...valueToUpdate };

  return await regenerateConfig(updatedConfig);
};

export const getConfig = async (args: Args): Promise<ConfigType> => {
  let config = { ...defaultConfig };
  let localConfigFile: LocalConfigType<ConfigType> = {};

  const argsObject = setArgs(args);

  config = await updateDefaultConfig(config, { isDebug: argsObject.isDebug || config.isDebug });
  config = await updateDefaultConfig(config, { projectCatalog: argsObject.projectCatalog || config.projectCatalog });
  config = await updateDefaultConfig(config, { snpCatalog: argsObject.snpCatalog || config.snpCatalog });
  config = await updateDefaultConfig(config, { snpConfigFile: argsObject.snpConfigFile || config.snpConfigFile });
  config = await updateDefaultConfig(config, {
    snpConfigFileName: argsObject.snpConfigFileName || config.snpConfigFileName,
  });

  const dataLocalConfigFile: string | ConfigType | object = parseJSON(await readFile(config.snpConfigFile));

  if (dataLocalConfigFile !== '' && typeof dataLocalConfigFile === 'object') {
    localConfigFile = dataLocalConfigFile;
    config = { ...config, ...localConfigFile };
  }

  config = await updateDefaultConfig(config, {
    isDebug: argsObject.isDebug || localConfigFile.isDebug || config.isDebug,
  });
  config = await updateDefaultConfig(config, {
    projectCatalog: argsObject.projectCatalog || localConfigFile.projectCatalog || config.projectCatalog,
  });
  config = await updateDefaultConfig(config, {
    snpCatalog: argsObject.snpCatalog || localConfigFile.snpCatalog || config.snpCatalog,
  });
  config = await updateDefaultConfig(config, {
    snpConfigFile: argsObject.snpConfigFile || localConfigFile.snpConfigFile || config.snpConfigFile,
  });
  config = await updateDefaultConfig(config, {
    snpConfigFileName: argsObject.snpConfigFileName || localConfigFile.snpConfigFileName || config.snpConfigFileName,
  });
  config = await updateDefaultConfig(config, {
    remoteRepository: argsObject.remoteRepository || localConfigFile.remoteRepository || config.remoteRepository,
  });
  return regenerateConfig(config);
};
