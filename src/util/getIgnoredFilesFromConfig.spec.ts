import { getIgnoredFilesFromConfig } from './getIgnoredFilesFromConfig';
import { readFile } from './readFile';
import { ConfigType } from '@/feature/config/types';
import { FileMapConfig } from '@/feature/updateFileMapConfig';

jest.mock('./readFile');

let config: ConfigType;
let sumFileMapConfig: FileMapConfig;

describe('getIgnoredFilesFromConfig', () => {
  config = {
    templateCatalogName: 'templateCatalog',
    sumCatalog: './mock/mockProject/.sum/',
    sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
    availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
    availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
    templateVersion: undefined,
    sumFileMapConfigFileName: 'repositoryMap.json',
    sumFileMapConfig: './mock/mockProject/.sum/repositoryMap.json',
    projectCatalog: './mock/mockProject/',
    temporaryFolder: './mock/mockProject/.sum/temporary/',
    sumConfigFileName: '.sum.config.json',
    sumConfigFilePath: './mock/mockProject/.sum.config.json',
    remoteFileMapURL:
      'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate/templateCatalog/repositoryMap.json',
    remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
    remoteRootRepositoryUrl:
      'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
    isDebug: true,
    _: [],
  };

  sumFileMapConfig = {
    fileMap: [
      'templateCatalog/.gitignore-default.md',
      'templateCatalog/README.md-default.md',
      'templateCatalog/package.json-default.md',
      'templateCatalog/tools/test.sh-default.md',
      'templateCatalog/tsconfig.json-default.md',
      'templateCatalog/yarn.lock-default.md',
    ],
    rootPathFileList: [
      './.gitignore.md',
      './README.md',
      './package.json',
      './tools/test.sh',
      './tsconfig.json',
      './yarn.lock',
    ],
    templateFileList: [
      './.gitignore.md',
      './README.md',
      './package.json',
      './tools/test.sh',
      './tsconfig.json',
      './yarn.lock',
    ],
    templateVersion: '1.0.0',
    sumFileMap: {
      '.gitignore': {
        _: {
          SUMKeySuffix: '_',
          isCreated: false,
          path: './mock/mockProject/.gitignore',
          realFilePath: '.gitignore',
          realPath: './mock/mockProject/.gitignore',
          templateVersion: '1.0.0',
        },
        defaultFile: {
          SUMKeySuffix: 'defaultFile',
          isCreated: false,
          path: './mock/mockProject/.sum/templateCatalog/.gitignore-default.md',
          realFilePath: '.gitignore',
          realPath: './mock/mockProject/.gitignore',
          templateVersion: '1.0.0',
          SUMSuffixFileName: 'templateCatalog/.gitignore-default.md',
        },
      },
      'README.md': {
        _: {
          SUMKeySuffix: '_',
          isCreated: false,
          path: './mock/mockProject/README.md',
          realFilePath: 'README.md',
          realPath: './mock/mockProject/README.md',
          templateVersion: '1.0.0',
        },
        defaultFile: {
          SUMKeySuffix: 'defaultFile',
          isCreated: false,
          path: './mock/mockProject/.sum/templateCatalog/README.md-default.md',
          realFilePath: 'README.md',
          realPath: './mock/mockProject/README.md',
          templateVersion: '1.0.0',
          SUMSuffixFileName: 'templateCatalog/README.md-default.md',
        },
      },
      'package.json': {
        _: {
          SUMKeySuffix: '_',
          isCreated: false,
          path: './mock/mockProject/package.json',
          realFilePath: 'package.json',
          realPath: './mock/mockProject/package.json',
          templateVersion: '1.0.0',
        },
        defaultFile: {
          SUMKeySuffix: 'defaultFile',
          isCreated: false,
          path: './mock/mockProject/.sum/templateCatalog/package.json-default.md',
          realFilePath: 'package.json',
          realPath: './mock/mockProject/package.json',
          templateVersion: '1.0.0',
          SUMSuffixFileName: 'templateCatalog/package.json-default.md',
        },
      },
      'tools/test.sh': {
        _: {
          SUMKeySuffix: '_',
          isCreated: false,
          path: './mock/mockProject/tools/test.sh',
          realFilePath: 'tools/test.sh',
          realPath: './mock/mockProject/test.sh',
          templateVersion: '1.0.0',
        },
        defaultFile: {
          SUMKeySuffix: 'defaultFile',
          isCreated: false,
          path: './mock/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
          realFilePath: 'tools/test.sh',
          realPath: './mock/mockProject/tools/test.sh',
          templateVersion: '1.0.0',
          SUMSuffixFileName: 'templateCatalog/tools/test.sh-default.md',
        },
      },
      'tsconfig.json': {
        _: {
          SUMKeySuffix: '_',
          isCreated: false,
          path: './mock/mockProject/tsconfig.json',
          realFilePath: 'tsconfig.json',
          realPath: './mock/mockProject/tsconfig.json',
          templateVersion: '1.0.0',
        },
        defaultFile: {
          SUMKeySuffix: 'defaultFile',
          isCreated: false,
          path: './mock/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
          realFilePath: 'tsconfig.json',
          realPath: './mock/mockProject/tsconfig.json',
          templateVersion: '1.0.0',
          SUMSuffixFileName: 'templateCatalog/tsconfig.json-default.md',
        },
      },
      'yarn.lock': {
        _: {
          SUMKeySuffix: '_',
          isCreated: false,
          path: './mock/mockProject/yarn.lock',
          realFilePath: 'yarn.lock',
          realPath: './mock/mockProject/yarn.lock',
          templateVersion: '1.0.0',
        },
        defaultFile: {
          SUMKeySuffix: 'defaultFile',
          isCreated: false,
          path: './mock/mockProject/.sum/templateCatalog/yarn.lock-default.md',
          realFilePath: 'yarn.lock',
          realPath: './mock/mockProject/yarn.lock',
          templateVersion: '1.0.0',
          SUMSuffixFileName: 'templateCatalog/yarn.lock-default.md',
        },
      },
    },
    createdFileMap: [],
  };

  const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array when .sumignore is empty', async () => {
    mockReadFile.mockResolvedValue('');

    const result = await getIgnoredFilesFromConfig({
      config,
      sumFileMapConfig,
    });

    expect(result).toEqual([]);
  });

  it('should return empty array when sumFileMap is undefined', async () => {
    mockReadFile.mockResolvedValue('src/');

    const emptyConfig: FileMapConfig = {
      fileMap: [],
      createdFileMap: [],
      templateVersion: '1.0.0',
      rootPathFileList: [],
      templateFileList: [],
      sumFileMap: {},
    };

    const result = await getIgnoredFilesFromConfig({
      config,
      sumFileMapConfig: emptyConfig,
    });

    expect(result).toEqual([]);
  });

  it('should handle directory patterns with trailing slash', async () => {
    mockReadFile.mockResolvedValue('tools/');

    const result = await getIgnoredFilesFromConfig({
      config,
      sumFileMapConfig,
    });

    expect(result).toEqual(['tools/test.sh']);
  });

  it('should handle wildcard patterns', async () => {
    mockReadFile.mockResolvedValue('*.json');

    const result = await getIgnoredFilesFromConfig({
      config,
      sumFileMapConfig,
    });

    expect(result).toEqual(['package.json', 'tsconfig.json']);
  });

  it('should handle direct file matches', async () => {
    mockReadFile.mockResolvedValue('README.md');

    const result = await getIgnoredFilesFromConfig({
      config,
      sumFileMapConfig,
    });

    expect(result).toEqual(['README.md']);
  });

  it('should handle multiple ignore patterns', async () => {
    mockReadFile.mockResolvedValue('*.json\ntools/*\n.gitignore');

    const result = await getIgnoredFilesFromConfig({
      config,
      sumFileMapConfig,
    });

    expect(result).toEqual(['package.json', 'tsconfig.json', 'tools/test.sh', '.gitignore']);
  });
});
