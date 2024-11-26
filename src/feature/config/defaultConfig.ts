import { Args, setArgs } from '@/feature/args/args';
import { defaultConfig } from '@/feature/config/const';
import { ConfigType, LocalConfigType, PartialConfig } from '@/feature/config/types';
import { createPath } from '@/util/createPath';
import { buildURL } from '@/util/formatterRepositoryFileNameUrl';
import { getRemoteFileMapURL } from '@/util/getRemoteURL/getRemoteFileMapURL';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { readPackageVersion } from '@/util/readVersionPackage';

export const regenerateConfig = async (config: ConfigType): Promise<ConfigType> => {
  const regeneratedConfig = { ...config };

  if (regeneratedConfig.projectCatalog) {
    regeneratedConfig.sumCatalog = createPath([regeneratedConfig.projectCatalog, '.sum/'], true);
    regeneratedConfig.temporaryFolder = createPath([regeneratedConfig.sumCatalog, 'temporary/'], true);
    regeneratedConfig.sUpdaterVersion = await readPackageVersion(
      createPath([regeneratedConfig.projectCatalog, 'package.json'])
    );
    regeneratedConfig.sumFileMapConfig = createPath([
      regeneratedConfig.sumCatalog,
      regeneratedConfig.sumFileMapConfigFileName,
    ]);
    if (regeneratedConfig.sumConfigFileName) {
      regeneratedConfig.sumConfigFilePath = createPath([
        regeneratedConfig.projectCatalog,
        regeneratedConfig.sumConfigFileName,
      ]);
      regeneratedConfig.sumIgnoreFilePath = createPath([
        regeneratedConfig.projectCatalog,
        regeneratedConfig.sumIgnoreFileName,
      ]);
    }

    if (regeneratedConfig.remoteRepository) {
      regeneratedConfig.remoteRepository = regeneratedConfig.remoteRepository.replace(/\/$/, '');
    }

    if (regeneratedConfig.remoteRepository && regeneratedConfig.sumFileMapConfigFileName) {
      let repositoryURL = regeneratedConfig.remoteRepository;
      const fileName = regeneratedConfig.sumFileMapConfigFileName;
      const templateCatalogName = regeneratedConfig.templateCatalogName;

      if (repositoryURL.endsWith(fileName)) {
        repositoryURL = repositoryURL.replace(fileName, '');
        repositoryURL = repositoryURL.replace(/\/$/, '');
      }

      if (repositoryURL.endsWith(templateCatalogName)) {
        repositoryURL = repositoryURL.replace(templateCatalogName, '');
        repositoryURL = repositoryURL.replace(/\/$/, '');
      }

      repositoryURL = buildURL({
        baseURL: repositoryURL,
        relativePaths: [],
      });

      if (repositoryURL.includes('github.com')) {
        repositoryURL = repositoryURL.replace(/\/$/, '');
        regeneratedConfig.remoteRootRepositoryUrl = repositoryURL
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/')
          .replace('/tree/', '/');
      } else {
        // If it's already a raw URL, leave it unchanged
        regeneratedConfig.remoteRootRepositoryUrl = repositoryURL.replace(/\/$/, '');
      }
    }

    if (regeneratedConfig.remoteRepository && regeneratedConfig.sumFileMapConfigFileName) {
      regeneratedConfig.remoteFileMapURL = getRemoteFileMapURL(regeneratedConfig);
    }
  }

  return regeneratedConfig;
};

export const updateDefaultConfig = async (
  config: ConfigType,
  keyToUpdate: PartialConfig<ConfigType>
): Promise<ConfigType> => {
  const keyName = Object.keys(keyToUpdate)[0];
  const folderKey = ['sumCatalog', 'projectCatalog', 'temporaryFolder'];
  const fileKey = ['sumConfigFileName', 'sumConfigFilePath'];
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
  config = await updateDefaultConfig(config, { sumCatalog: argsObject.sumCatalog || config.sumCatalog });
  config = await updateDefaultConfig(config, {
    sumConfigFilePath: argsObject.sumConfigFilePath || config.sumConfigFilePath,
  });
  config = await updateDefaultConfig(config, {
    sumConfigFileName: argsObject.sumConfigFileName || config.sumConfigFileName,
  });

  const dataLocalConfigFile: string | ConfigType | object = parseJSON(await readFile(config.sumConfigFilePath));

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
    sumCatalog: argsObject.sumCatalog || localConfigFile.sumCatalog || config.sumCatalog,
  });
  config = await updateDefaultConfig(config, {
    sumConfigFilePath: argsObject.sumConfigFilePath || localConfigFile.sumConfigFilePath || config.sumConfigFilePath,
  });
  config = await updateDefaultConfig(config, {
    sumConfigFileName: argsObject.sumConfigFileName || localConfigFile.sumConfigFileName || config.sumConfigFileName,
  });
  config = await updateDefaultConfig(config, {
    remoteRepository: argsObject.remoteRepository || localConfigFile.remoteRepository || config.remoteRepository,
  });
  return await regenerateConfig(config);
};
