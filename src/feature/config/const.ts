import { ConfigTemplateType, ConfigType, RepositoryMapFileConfigType } from '@/feature/config/types';

export const defaultConfig: ConfigType = {
  templateCatalogName: 'templateCatalog',
  sumCatalog: './.sum',
  sUpdaterVersion: undefined,
  availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
  availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
  templateVersion: undefined,
  sumFileMapConfigFileName: 'repositoryMap.json', // TODO [SC-83] change name to sumFileMapConfig
  sumIgnoreFilePath: './.sumignore',
  sumIgnoreFileName: '.sumignore',
  sumFileMapConfig: './.sum/repositoryMap.json',
  projectCatalog: './',
  temporaryFolder: './.sum/temporary/',
  sumConfigFileName: '.sum.config.json',
  sumConfigFilePath: './.sum.config.json',
  remoteRootRepositoryUrl:
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
  remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
  remoteFileMapURL:
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
  isDebug: false,
  _: [],
};

export const defaultTemplateConfig: ConfigTemplateType = {
  projectCatalog: './',
  templateCatalogName: 'templateCatalog',
  templateCatalogPath: './templateCatalog',
  repositoryMapFileName: 'repositoryMap.json',
  repositoryMapFilePath: './templateCatalog/repositoryMap.json',
  bumpVersion: true,
  isDebug: false,
  _: [],
};

export const defaultRepositoryMapFileConfig: RepositoryMapFileConfigType = {
  ...defaultTemplateConfig,
  templateVersion: '1.0.0',
  fileMap: [],
  templateFileList: [],
  rootPathFileList: [],
  redOnlyFileList: [],
};
