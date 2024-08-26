import { defaultConfig } from '@/feature/config/const';
import { ConfigType } from '@/feature/config/types';
import { downloadConfig } from '@/feature/downloadConfig';

describe('downloadConfig', () => {
  let config: ConfigType;

  beforeEach(() => {
    config = { ...defaultConfig };
  });

  it('should return correct content', async () => {
    const mockConfig = {
      REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
      _: [],
      availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
      availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
      isDebug: false,
      projectCatalog: './test/mockProject',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/testTemplate/templateCatalog/repositoryMap.json',
      remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/testTemplate',
      remoteRootRepositoryUrl:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/test/testTemplate',
      sUpdaterVersion: '1.0.0-dev.27',
      snpCatalog: './test/mockProject/.snp/',
      snpConfigFile: './test/mockProject/.snp/snp.config.json',
      snpConfigFileName: 'snp.config.json',
      snpFileMapConfig: './test/mockProject/.snp/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
      templateVersion: undefined,
      temporaryFolder: './test/mockProject/.snp/temporary/',
    };
    config = { ...config, ...mockConfig };

    const result = await downloadConfig(config);

    expect(result).toStrictEqual({
      config,
      downloadContent: {},
    });
  });
});
