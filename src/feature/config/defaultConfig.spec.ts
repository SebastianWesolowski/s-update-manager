import { mockConfig_step_init, mockConfig_step_initSave } from '@/feature/__tests__/const';
import { defaultArgs } from '@/feature/args/const';
import { defaultConfig } from '@/feature/config/const';
import { getConfig, regenerateConfig, updateDefaultConfig } from '@/feature/config/defaultConfig';
import { ConfigType } from '@/feature/config/types';

const testCases: { description: string; mockConfig: Partial<ConfigType>; expectedConfig: Partial<ConfigType> }[] = [
  {
    description: 'full config',
    mockConfig: defaultConfig,
    expectedConfig: {
      REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
      _: [],
      availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
      availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
      isDebug: false,
      projectCatalog: './',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalog/repositoryMap.json',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalog/repositoryMap.json',
      remoteRootRepositoryUrl: 'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node',
      sUpdaterVersion: undefined,
      snpCatalog: './.snp/',
      snpConfigFile: './.snp/snp.config.json',
      snpConfigFileName: 'snp.config.json',
      snpFileMapConfig: './.snp/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
      templateVersion: undefined,
      temporaryFolder: './.snp/temporary/',
    },
  },
  {
    description: 'empty config',
    mockConfig: {},
    expectedConfig: {
      REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
      _: [],
      availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
      availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
      isDebug: false,
      projectCatalog: './',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalog/repositoryMap.json',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalog/repositoryMap.json',
      remoteRootRepositoryUrl: 'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node',
      sUpdaterVersion: undefined,
      snpCatalog: './.snp/',
      snpConfigFile: './.snp/snp.config.json',
      snpConfigFileName: 'snp.config.json',
      snpFileMapConfig: './.snp/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
      templateVersion: undefined,
      temporaryFolder: './.snp/temporary/',
    },
  },
  {
    description: 'custom config from args',
    mockConfig: {
      REPOSITORY_MAP_FILE_NAME: 'custom.json',
      _: [],
      availableSNPKeySuffix: ['superCustomFileName'],
      availableSNPSuffix: ['-superCustomFileName.md'],
      isDebug: true,
      projectCatalog: './frontEnd/',
      remoteFileMapURL: '',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalogCustom',
      remoteRootRepositoryUrl: '',
      sUpdaterVersion: '',
      snpCatalog: '',
      snpConfigFile: './.snp/snp.config.json',
      snpConfigFileName: 'template.config.json',
      snpFileMapConfig: './.snp/repositoryMap.json',
      templateCatalogName: 'templateCatalogCustom',
      templateVersion: '',
      temporaryFolder: './.snp/temporary/',
    },
    expectedConfig: {
      REPOSITORY_MAP_FILE_NAME: 'custom.json',
      _: [],
      availableSNPKeySuffix: ['superCustomFileName'],
      availableSNPSuffix: ['-superCustomFileName.md'],
      isDebug: true,
      projectCatalog: './frontEnd/',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalogCustom/custom.json',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalogCustom',
      remoteRootRepositoryUrl: 'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node',
      sUpdaterVersion: '',
      snpCatalog: './frontEnd/.snp/',
      snpConfigFile: './frontEnd/.snp/template.config.json',
      snpConfigFileName: 'template.config.json',
      snpFileMapConfig: './frontEnd/.snp/custom.json',
      templateCatalogName: 'templateCatalogCustom',
      templateVersion: '',
      temporaryFolder: './frontEnd/.snp/temporary/',
    },
  },
  {
    description: 'custom config from args',
    mockConfig: {
      REPOSITORY_MAP_FILE_NAME: 'custom.json',
      _: [],
      availableSNPKeySuffix: ['superCustomFileName'],
      availableSNPSuffix: ['-superCustomFileName.md'],
      isDebug: true,
      projectCatalog: './frontEnd/',
      remoteFileMapURL: '',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalogCustom',
      remoteRootRepositoryUrl: '',
      sUpdaterVersion: '',
      snpCatalog: '',
      snpConfigFile: './.snp/snp.config.json',
      snpConfigFileName: 'template.config.json',
      snpFileMapConfig: './.snp/repositoryMap.json',
      templateCatalogName: 'templateCatalogCustom',
      templateVersion: '',
      temporaryFolder: './.snp/temporary/',
    },
    expectedConfig: {
      REPOSITORY_MAP_FILE_NAME: 'custom.json',
      _: [],
      availableSNPKeySuffix: ['superCustomFileName'],
      availableSNPSuffix: ['-superCustomFileName.md'],
      isDebug: true,
      projectCatalog: './frontEnd/',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalogCustom/custom.json',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalogCustom',
      remoteRootRepositoryUrl: 'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node',
      sUpdaterVersion: '',
      snpCatalog: './frontEnd/.snp/',
      snpConfigFile: './frontEnd/.snp/template.config.json',
      snpConfigFileName: 'template.config.json',
      snpFileMapConfig: './frontEnd/.snp/custom.json',
      templateCatalogName: 'templateCatalogCustom',
      templateVersion: '',
      temporaryFolder: './frontEnd/.snp/temporary/',
    },
  },
  {
    description: 'config from const for tests',
    mockConfig: mockConfig_step_init,
    expectedConfig: mockConfig_step_initSave,
  },
];

// Test suite for the init function
describe('configuration functions', () => {
  testCases.forEach(
    ({
      description,
      mockConfig,
      expectedConfig,
    }: {
      description: string;
      mockConfig: Partial<ConfigType>;
      expectedConfig: Partial<ConfigType>;
    }) => {
      it(`regenerateConfig - should ${description}`, async () => {
        const expectedConfigOverwrite: Partial<ConfigType> = {
          ...expectedConfig,
          sUpdaterVersion: '1.0.0-dev.27', // common override
        };

        const result = await regenerateConfig({
          ...defaultConfig,
          ...mockConfig,
        });

        result.sUpdaterVersion = '1.0.0-dev.27';
        expect(result).toStrictEqual(expectedConfigOverwrite);
      });
    }
  );

  it('updateDefaultConfig - should return the expected file configuration', async () => {
    const mockConfig = {
      projectCatalog: './frontEnd/',
      sUpdaterVersion: 'last',
      snpCatalog: './frontEnd/.snp/',
      snpConfigFile: './frontEnd/.snp/snp.config.json',
      snpFileMapConfig: './frontEnd/.snp/repositoryMap.json',
      temporaryFolder: './frontEnd/.snp/temporary/',
    };

    const keyToUpdate: Partial<ConfigType> = {
      projectCatalog: './frontEnd/',
    };

    const config = {
      ...mockConfig,
      ...defaultConfig,
    };

    // regenerateTemplateConfig is used inside updateDefaultConfig
    const expectedConfig = await regenerateConfig({
      ...defaultConfig,
      ...mockConfig,
    });

    // Generate the actual configuration using the regeneration function
    const result = await updateDefaultConfig(config, keyToUpdate);

    expect(result).toStrictEqual(expectedConfig);
  });
  it('getConfig - should return the expected file configuration', async () => {
    const expectedConfig = {
      REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
      _: [],
      availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
      availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
      isDebug: 'true',
      projectCatalog: './test/fakeProjectRootfolder/',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalog/repositoryMap.json',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalog/repositoryMap.json',
      remoteRootRepositoryUrl: 'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node',
      sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.17T.tgz',
      snpCatalog: './test/fakeProjectRootfolder/.snp/',
      snpConfigFile: './test/fakeProjectRootfolder/.snp/snp.config.json',
      snpConfigFileName: 'snp.config.json',
      snpFileMapConfig: './test/fakeProjectRootfolder/.snp/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
      templateVersion: undefined,
      temporaryFolder: './test/fakeProjectRootfolder/.snp/temporary/',
    };

    const result: ConfigType = await getConfig(defaultArgs);

    expect(result).toStrictEqual(expectedConfig);
  });
});
