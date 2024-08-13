import { ConfigTemplateType, ConfigType } from '@/feature/config/types';

export const defaultConfig: ConfigType = {
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
