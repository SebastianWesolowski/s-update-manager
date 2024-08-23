export interface ConfigTemplateType {
  projectCatalog: string;
  templateCatalogName: string;
  templateCatalogPath: string;
  repositoryMapFileName: string;
  repositoryMapFilePath: string;
  bumpVersion: boolean;
  isDebug: boolean;
  _: any[];
}

export interface GeneratedConfig {
  snpCatalog: string;
  sUpdaterVersion?: string;
  templateVersion?: string;
  temporaryFolder: string;
  snpConfigFile: string;
  snpFileMapConfig: string;
  remoteFileMapURL: string;
  remoteRootRepositoryUrl: string;
}
export interface ConfigType extends StableConfig, GeneratedConfig {
  _: any[];
}

export type OptionalKeys<T> = { [K in keyof T]?: T[K] };
export type LocalConfigType<T> = OptionalKeys<T>;

export interface StableConfig {
  templateCatalogName: string;
  projectCatalog: string;
  availableSNPSuffix: AvailableSNPSuffixTypes[];
  availableSNPKeySuffix: AvailableSNPKeySuffixTypes[];
  REPOSITORY_MAP_FILE_NAME: string;
  snpConfigFileName: string;
  remoteRepository: string;
  isDebug: boolean;
}

export type SNPKeySuffixTypes = AvailableSNPKeySuffixTypes & '_';
export type AvailableSNPKeySuffixTypes = 'defaultFile' | 'customFile' | 'extendFile';
export type AvailableSNPSuffixTypes = '-default.md' | '-custom.md' | '-extend.md';

export type PartialConfig<T> = {
  [K in keyof T]?: any;
};

export interface RepositoryMapFileConfigType {
  templateVersion: string;
  fileMap: string[];
  templateFileList: string[];
  rootPathFileList: string[];
}
