import { ConfigTemplateType, ConfigType, RepositoryMapFileConfigType } from '@/feature/config/types';

export const defaultConfig: ConfigType = {
  templateCatalogName: 'templateCatalog',
  snpCatalog: './.snp',
  sUpdaterVersion: undefined,
  availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
  availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
  templateVersion: undefined,
  REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json', // TODO zmienic nazwę na snpFileMapConfig
  snpFileMapConfig: './.snp/repositoryMap.json',
  projectCatalog: './',
  temporaryFolder: './.snp/temporary/',
  snpConfigFileName: 'snp.config.json',
  snpConfigFile: './.snp/snp.config.json',
  remoteRootRepositoryUrl: 'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node',
  remoteRepository:
    'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalog/repositoryMap.json', // TODO Change to main branch before release 1.00
  remoteFileMapURL:
    'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalog/repositoryMap.json', // TODO Change to main node template branch before release 1.00
  isDebug: false,
  _: [],
};

export const defaultTemplateConfig: ConfigTemplateType = {
  projectCatalog: './',
  templateCatalogName: 'templateCatalog',
  templateCatalogPath: './templateCatalog',
  repositoryMapFileName: 'repositoryMap.json',
  repositoryMapFilePath: './repositoryMap.json',
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
};
