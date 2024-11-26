export interface ConfigTemplateType {
  projectCatalog: string;
  templateCatalogName: string;
  templateCatalogPath: string;
  repositoryMapFileName: string;
  repositoryMapFilePath: string;
  templateVersion?: string;
  bumpVersion: boolean;
  isDebug: boolean;
  _: any[];
}

export interface GeneratedConfig {
  sumCatalog: string;
  sUpdaterVersion?: string;
  templateVersion?: string;
  temporaryFolder: string;
  sumConfigFilePath: string;
  sumIgnoreFilePath: string;
  sumIgnoreFileName: string;
  sumFileMapConfig: string;
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
  availableSUMSuffix: AvailableSUMSuffixTypes[];
  availableSUMKeySuffix: AvailableSUMKeySuffixTypes[];
  sumFileMapConfigFileName: string;
  sumConfigFileName: string;
  remoteRepository: string;
  isDebug: boolean;
}

export type SUMKeySuffixTypes = AvailableSUMKeySuffixTypes & '_';
export type AvailableSUMKeySuffixTypes = 'defaultFile' | 'customFile' | 'extendFile' | string;
export type AvailableSUMSuffixTypes = '-default.md' | '-custom.md' | '-extend.md' | string;

export type PartialConfig<T> = {
  [K in keyof T]?: any;
};

export interface RepositoryMapFileConfigType extends ConfigTemplateType {
  templateVersion: string;
  fileMap: string[];
  templateFileList: string[];
  rootPathFileList: string[];
  redOnlyFileList: string[];
}
