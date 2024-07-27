import path from 'path';
import { format } from 'url';
import { Args, setArgs } from '@/feature/args';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { readPackageVersion } from '@/util/readVersionPackage';

export type availableTemplate = 'node' | string;

export type SNPKeySuffixTypes = AvailableSNPKeySuffixTypes & '_';
export type AvailableSNPKeySuffixTypes = 'defaultFile' | 'instructionsFile' | 'customFile' | 'extendFile';
export type AvailableSNPSuffixTypes = '-default.md' | '-instructions.md' | '-custom.md' | '-extend.md';
export interface StableConfig {
  template: availableTemplate | string;
  projectCatalog: string;
  availableSNPSuffix: AvailableSNPSuffixTypes[];
  availableSNPKeySuffix: AvailableSNPKeySuffixTypes[];
  REPOSITORY_MAP_FILE_NAME: string;
  snpConfigFileName: string;
  remoteRepository: string;
  isDebug: boolean;
}
export interface GeneratedConfig {
  snpCatalog: string;
  sUpdaterVersion?: string;
  templateVersion?: string;
  temporaryFolder: string;
  snpConfigFile: string;
  snpFileMapConfig: string;
  repositoryUrl: string;
}

export interface ConfigType extends StableConfig, GeneratedConfig {
  _: any[];
}
type PartialConfig = {
  [K in keyof ConfigType]?: any;
};

const defaultConfig: ConfigType = {
  snpCatalog: './.snp',
  template: 'node',
  sUpdaterVersion: undefined,
  availableSNPSuffix: ['-default.md', '-instructions.md', '-custom.md', '-extend.md'],
  availableSNPKeySuffix: ['defaultFile', 'instructionsFile', 'customFile', 'extendFile'],
  templateVersion: undefined,
  REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json', // TODO zmienic nazwę na snpFileMapConfig
  snpFileMapConfig: './.snp/repositoryMap.json',
  projectCatalog: './',
  temporaryFolder: './.snp/temporary/',
  snpConfigFileName: 'snp.config.json',
  snpConfigFile: './.snp/snp.config.json',
  remoteRepository: 'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/template/', // TODO Change to main branch before release 1.00
  // remoteRepository: 'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/main/template/',
  repositoryUrl: 'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/template/node',
  isDebug: false,
  _: [],
};

type OptionalKeys<T> = { [K in keyof T]?: T[K] };
type LocalConfigType = OptionalKeys<ConfigType>;

export const createPath = function (parts: string[] | string, isFolder = false) {
  let joinedPath: string | string[];
  let includeRoot = false;
  const rootRegex = /^\.\/.*$/;
  if (typeof parts === 'string') {
    joinedPath = parts;

    if (rootRegex.test(parts)) {
      includeRoot = true;
    }
  } else {
    if (rootRegex.test(parts.join(''))) {
      includeRoot = true;
    }

    joinedPath = path.join(...parts);
  }

  if (isFolder) {
    joinedPath = path.normalize(joinedPath + path.sep);
  }

  if (includeRoot && joinedPath !== './') {
    joinedPath = './' + path.normalize(joinedPath);
  }

  return joinedPath;
};

const regenerateConfig = async (config: ConfigType) => {
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

    if (regeneratedConfig.remoteRepository && regeneratedConfig.template) {
      regeneratedConfig.repositoryUrl = format(`${regeneratedConfig.remoteRepository}${regeneratedConfig.template}`);
    }
  }

  return regeneratedConfig;
};

const updateConfig = async (config: ConfigType, keyToUpdate: PartialConfig) => {
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
  let localConfigFile: LocalConfigType = {};

  const argsObject = setArgs(args);

  config = await updateConfig(config, { isDebug: argsObject.isDebug || config.isDebug });
  config = await updateConfig(config, { projectCatalog: argsObject.projectCatalog || config.projectCatalog });
  config = await updateConfig(config, { snpCatalog: argsObject.snpCatalog || config.snpCatalog });
  config = await updateConfig(config, { snpConfigFile: argsObject.snpConfigFile || config.snpConfigFile });
  config = await updateConfig(config, { snpConfigFileName: argsObject.snpConfigFileName || config.snpConfigFileName });

  const dataLocalConfigFile: string | ConfigType | object = parseJSON(await readFile(config.snpConfigFile));

  if (dataLocalConfigFile !== '' && typeof dataLocalConfigFile === 'object') {
    localConfigFile = dataLocalConfigFile;
    config = { ...config, ...localConfigFile };
  }

  config = await updateConfig(config, { isDebug: argsObject.isDebug || localConfigFile.isDebug || config.isDebug });
  config = await updateConfig(config, {
    projectCatalog: argsObject.projectCatalog || localConfigFile.projectCatalog || config.projectCatalog,
  });
  config = await updateConfig(config, {
    snpCatalog: argsObject.snpCatalog || localConfigFile.snpCatalog || config.snpCatalog,
  });
  config = await updateConfig(config, {
    snpConfigFile: argsObject.snpConfigFile || localConfigFile.snpConfigFile || config.snpConfigFile,
  });
  config = await updateConfig(config, {
    snpConfigFileName: argsObject.snpConfigFileName || localConfigFile.snpConfigFileName || config.snpConfigFileName,
  });
  config = await updateConfig(config, {
    remoteRepository: argsObject.remoteRepository || localConfigFile.remoteRepository || config.remoteRepository,
  });
  config = await updateConfig(config, { template: argsObject.template || localConfigFile.template || config.template });
  return regenerateConfig(config);
};
