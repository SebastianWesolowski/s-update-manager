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

export type OptionalKeys<T> = { [K in keyof T]?: T[K] };
export type LocalConfigType<T> = OptionalKeys<T>;

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

export type availableTemplate = 'node' | string;

export type SNPKeySuffixTypes = AvailableSNPKeySuffixTypes & '_';
export type AvailableSNPKeySuffixTypes = 'defaultFile' | 'instructionsFile' | 'customFile' | 'extendFile';
export type AvailableSNPSuffixTypes = '-default.md' | '-instructions.md' | '-custom.md' | '-extend.md';

export interface ConfigType extends StableConfig, GeneratedConfig {
  _: any[];
}

export type PartialConfig<T> = {
  [K in keyof T]?: any;
};
