import { mockConfig } from '@/feature/__tests__/const';
import { defaultArgs } from '@/feature/args/const';
import { defaultConfig } from '@/feature/config/const';
import { getConfig, regenerateConfig, updateDefaultConfig } from '@/feature/config/defaultConfig';
import { ConfigType } from '@/feature/config/types';
import { readPackageVersion } from '@/util/readVersionPackage';

const updateSUpdaterVersion = async (projectCatalog: string): Promise<Partial<{ sUpdaterVersion: string }>> => {
  const sUpdaterVersion = await readPackageVersion(projectCatalog + '/package.json');
  return { sUpdaterVersion };
};

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
    description: 'custom remoteRepository',
    mockConfig: {
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalogCustom',
    },
    expectedConfig: {
      REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
      _: [],
      availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
      availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
      isDebug: false,
      projectCatalog: './',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalogCustom/repositoryMap.json',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalogCustom',
      remoteRootRepositoryUrl:
        'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalogCustom',
      sUpdaterVersion: '1.0.0-dev.27',
      snpCatalog: './.snp/',
      snpConfigFile: './.snp/snp.config.json',
      snpConfigFileName: 'snp.config.json',
      snpFileMapConfig: './.snp/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
      temporaryFolder: './.snp/temporary/',
      templateVersion: undefined,
    },
  },
  {
    description: 'config from const for tests',
    mockConfig: mockConfig.step.init,
    expectedConfig: mockConfig.step.createConfigFile,
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
        const { sUpdaterVersion } = await updateSUpdaterVersion(expectedConfig.projectCatalog || './');

        const updatedExpectedConfig = {
          ...expectedConfig,
          sUpdaterVersion,
        };

        const expectedConfigOverwrite = await regenerateConfig({
          ...defaultConfig,
          ...mockConfig,
          projectCatalog: mockConfig.projectCatalog || './',
        });

        const result = await regenerateConfig({
          ...defaultConfig,
          ...mockConfig,
        });

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
      projectCatalog: './mock/mockProject/',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalog/repositoryMap.json',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalog/repositoryMap.json',
      remoteRootRepositoryUrl: 'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node',
      sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.17T.tgz',
      snpCatalog: './mock/mockProject/.snp/',
      snpConfigFile: './mock/mockProject/.snp/snp.config.json',
      snpConfigFileName: 'snp.config.json',
      snpFileMapConfig: './mock/mockProject/.snp/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
      templateVersion: undefined,
      temporaryFolder: './mock/mockProject/.snp/temporary/',
    };

    const result: ConfigType = await getConfig(defaultArgs);
    const { sUpdaterVersion } = await updateSUpdaterVersion(expectedConfig.projectCatalog);

    const updatedExpectedConfig = {
      ...expectedConfig,
      sUpdaterVersion,
    };
    expect(result).toStrictEqual(updatedExpectedConfig);
  });
});
