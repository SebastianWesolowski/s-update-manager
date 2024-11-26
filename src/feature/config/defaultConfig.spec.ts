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
      sumIgnoreFilePath: './.sumignore',
      sumIgnoreFileName: '.sumignore',
      sumFileMapConfigFileName: 'repositoryMap.json',
      _: [],
      availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
      availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
      isDebug: false,
      projectCatalog: './',
      remoteRootRepositoryUrl:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate',
      remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
      sUpdaterVersion: undefined,
      sumCatalog: './.sum/',
      sumConfigFilePath: './.sum.config.json',
      sumConfigFileName: '.sum.config.json',
      sumFileMapConfig: './.sum/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
      templateVersion: undefined,
      temporaryFolder: './.sum/temporary/',
    },
  },
  {
    description: 'empty config',
    mockConfig: {},
    expectedConfig: {
      sumIgnoreFilePath: './.sumignore',
      sumIgnoreFileName: '.sumignore',
      sumFileMapConfigFileName: 'repositoryMap.json',
      _: [],
      availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
      availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
      isDebug: false,
      projectCatalog: './',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
      remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
      remoteRootRepositoryUrl:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate',
      sUpdaterVersion: undefined,
      sumCatalog: './.sum/',
      sumConfigFilePath: './.sum.config.json',
      sumConfigFileName: '.sum.config.json',
      sumFileMapConfig: './.sum/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
      templateVersion: undefined,
      temporaryFolder: './.sum/temporary/',
    },
  },
  {
    description: 'custom config from args',
    mockConfig: {
      sumIgnoreFilePath: './.sumignore',
      sumIgnoreFileName: '.sumignore',
      sumFileMapConfigFileName: 'custom.json',
      _: [],
      availableSUMKeySuffix: ['superCustomFileName'],
      availableSUMSuffix: ['-superCustomFileName.md'],
      isDebug: true,
      projectCatalog: './frontEnd/',
      remoteFileMapURL: '',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalogCustom',
      remoteRootRepositoryUrl: '',
      sUpdaterVersion: '',
      sumCatalog: '',
      sumConfigFilePath: './.sum.config.json',
      sumConfigFileName: 'template.config.json',
      sumFileMapConfig: './.sum/repositoryMap.json',
      templateCatalogName: 'templateCatalogCustom',
      templateVersion: '',
      temporaryFolder: './.sum/temporary/',
    },
    expectedConfig: {
      sumIgnoreFilePath: './.sumignore',
      sumIgnoreFileName: '.sumignore',
      sumFileMapConfigFileName: 'custom.json',
      _: [],
      availableSUMKeySuffix: ['superCustomFileName'],
      availableSUMSuffix: ['-superCustomFileName.md'],
      isDebug: true,
      projectCatalog: './frontEnd/',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalogCustom/custom.json',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalogCustom',
      remoteRootRepositoryUrl: 'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node',
      sUpdaterVersion: '',
      sumCatalog: './frontEnd/.sum/',
      sumConfigFilePath: './frontEnd/.sum/template.config.json',
      sumConfigFileName: 'template.config.json',
      sumFileMapConfig: './frontEnd/.sum/custom.json',
      templateCatalogName: 'templateCatalogCustom',
      templateVersion: '',
      temporaryFolder: './frontEnd/.sum/temporary/',
    },
  },
  {
    description: 'custom remoteRepository',
    mockConfig: {
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalogCustom',
    },
    expectedConfig: {
      sumIgnoreFilePath: './.sumignore',
      sumIgnoreFileName: '.sumignore',
      sumFileMapConfigFileName: 'repositoryMap.json',
      _: [],
      availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
      availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
      isDebug: false,
      projectCatalog: './',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalogCustom/repositoryMap.json',
      remoteRepository:
        'https://github.com/SebastianWesolowski/testTemplate/blob/main/template/node/templateCatalogCustom',
      remoteRootRepositoryUrl:
        'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/node/templateCatalogCustom',
      sUpdaterVersion: '1.0.0-dev.27',
      sumCatalog: './.sum/',
      sumConfigFilePath: './.sum.config.json',
      sumConfigFileName: '.sum.config.json',
      sumFileMapConfig: './.sum/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
      temporaryFolder: './.sum/temporary/',
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

        const expectedConfigOverwrite = await regenerateConfig({
          ...defaultConfig,
          ...expectedConfig,
          sUpdaterVersion,
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
      sumCatalog: './frontEnd/.sum/',
      sumConfigFilePath: './frontEnd/.sum.config.json',
      sumFileMapConfig: './frontEnd/.sum/repositoryMap.json',
      temporaryFolder: './frontEnd/.sum/temporary/',
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
      sumIgnoreFilePath: './mock/mockProject/.sumignore',
      sumIgnoreFileName: '.sumignore',
      sumFileMapConfigFileName: 'repositoryMap.json',
      _: [],
      availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
      availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
      isDebug: true,
      projectCatalog: './mock/mockProject/',
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
      remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
      remoteRootRepositoryUrl:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate',
      sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.17T.tgz',
      sumCatalog: './mock/mockProject/.sum/',
      sumConfigFilePath: './mock/mockProject/.sum.config.json',
      sumConfigFileName: '.sum.config.json',
      sumFileMapConfig: './mock/mockProject/.sum/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
      templateVersion: undefined,
      temporaryFolder: './mock/mockProject/.sum/temporary/',
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
