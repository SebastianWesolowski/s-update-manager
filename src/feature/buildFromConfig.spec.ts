import { FileToCreateType, setupTestFiles } from './__tests__/prepareFileForTests';
import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSumFileMapConfig } from '@/feature/__tests__/const';
import { extractAndReplacePaths } from '@/feature/__tests__/extractAndReplacePaths';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { updateConfigBasedOnComparison } from '@/feature/__tests__/updateConfigBasedOnComparison';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { ConfigType } from '@/feature/config/types';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';

describe('buildFromConfig', () => {
  let partialConfig: Partial<ConfigType>;
  let config: ConfigType;
  let sumFileMapConfig: FileMapConfig;

  beforeEach(async () => {
    const configFullField = mockConfig.step.scanExtraFile.fullFiled;
    const configEmpty = mockConfig.step.scanExtraFile.empty;
    const keysToCompare: (keyof ConfigType)[] = ['sumCatalog', 'projectCatalog', 'isDebug'];

    partialConfig = updateConfigBasedOnComparison<Partial<ConfigType>>(
      partialConfig,
      configFullField,
      configEmpty,
      keysToCompare
    );

    if (partialConfig.sumCatalog && partialConfig.projectCatalog && partialConfig.isDebug) {
      await cleanUpFiles({
        sumCatalog: partialConfig.sumCatalog,
        directoryPath: partialConfig.projectCatalog,
        isDebug: partialConfig.isDebug,
      });
    }
  });

  afterEach(async () => {
    await cleanUpFiles({
      sumCatalog: config.sumCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });
  });

  it('should return correct content without extra file - empty project templateCatalog ', async () => {
    config = { ...mockConfig.step.scanExtraFile.empty, ...partialConfig };
    sumFileMapConfig = { ...mockSumFileMapConfig.step.scanExtraFile.empty };

    const FileToCreate: FileToCreateType[] = [
      {
        filePath: config.sumConfigFilePath,
        content: JSON.stringify(config),
      },
      {
        filePath: config.sumFileMapConfig,
        content: JSON.stringify(sumFileMapConfig),
      },
    ];
    await setupTestFiles(FileToCreate, config.isDebug);

    const result = await buildFromConfig(config);
    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });
    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.buildFromConfig.empty,
      sumFileMapConfig: {
        ...mockSumFileMapConfig.step.buildFromConfig.empty,
        createdFileMap: [
          './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
          './test/mockProject/.sum/templateCatalog/README.md-default.md',
          './test/mockProject/.sum/templateCatalog/package.json-default.md',
          './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
          './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
          './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
        ],
        sumFileMap: {
          ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap,
          '.gitignore': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['.gitignore'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['.gitignore']['_'],
              isCreated: false,
            },
          },
          'README.md': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['README.md'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['README.md']['_'],
              isCreated: false,
            },
          },
          'package.json': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['package.json'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['package.json']['_'],
              isCreated: false,
            },
          },
          'tools/test.sh': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['tools/test.sh'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['tools/test.sh']['_'],
              isCreated: false,
            },
          },
          'tsconfig.json': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['tsconfig.json'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['tsconfig.json']['_'],
              isCreated: false,
            },
          },
          'yarn.lock': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['yarn.lock'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['yarn.lock']['_'],
              isCreated: false,
            },
          },
        },
      },
      allFiles: [
        './test/mockProject/.sum/repositoryMap.json',
        './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
        './test/mockProject/.sum/templateCatalog/README.md-default.md',
        './test/mockProject/.sum/templateCatalog/package.json-default.md',
        './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
        './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
        './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
        './test/mockProject/.sum/temporary/.gitignore-default.md',
        './test/mockProject/.sum/temporary/README.md-default.md',
        './test/mockProject/.sum/temporary/package.json-default.md',
        './test/mockProject/.sum/temporary/test.sh-default.md',
        './test/mockProject/.sum/temporary/tsconfig.json-default.md',
        './test/mockProject/.sum/temporary/yarn.lock-default.md',
        './test/mockProject/.sum.config.json',
      ],
    });
  });

  it('should return correct content without extra file and binary files - empty project templateCatalog ', async () => {
    config = { ...mockConfig.step.scanExtraFile.empty_binary, ...partialConfig };
    sumFileMapConfig = { ...mockSumFileMapConfig.step.scanExtraFile.empty };

    const FileToCreate: FileToCreateType[] = [
      {
        filePath: config.sumConfigFilePath,
        content: JSON.stringify(config),
      },
      {
        filePath: config.sumFileMapConfig,
        content: JSON.stringify(sumFileMapConfig),
      },
    ];
    await setupTestFiles(FileToCreate, config.isDebug);

    const result = await buildFromConfig(config);
    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });
    expect({ ...result, allFiles }).toStrictEqual({
      config: {
        ...mockConfig.step.buildFromConfig.empty,
        remoteFileMapURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateWithImage/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateWithImage',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateWithImage',
      },
      sumFileMapConfig: {
        ...mockSumFileMapConfig.step.buildFromConfig.empty,
        createdFileMap: [
          './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
          './test/mockProject/.sum/templateCatalog/README.md-default.md',
          './test/mockProject/.sum/templateCatalog/package.json-default.md',
          './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
          './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
          './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
        ],
        sumFileMap: {
          ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap,
          '.gitignore': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['.gitignore'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['.gitignore']['_'],
              isCreated: false,
            },
          },
          'README.md': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['README.md'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['README.md']['_'],
              isCreated: false,
            },
          },
          'package.json': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['package.json'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['package.json']['_'],
              isCreated: false,
            },
          },
          'tools/test.sh': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['tools/test.sh'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['tools/test.sh']['_'],
              isCreated: false,
            },
          },
          'tsconfig.json': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['tsconfig.json'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['tsconfig.json']['_'],
              isCreated: false,
            },
          },
          'yarn.lock': {
            ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['yarn.lock'],
            _: {
              ...mockSumFileMapConfig.step.buildFromConfig.empty.sumFileMap['yarn.lock']['_'],
              isCreated: false,
            },
          },
        },
      },
      allFiles: [
        './test/mockProject/.sum/repositoryMap.json',
        './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
        './test/mockProject/.sum/templateCatalog/README.md-default.md',
        './test/mockProject/.sum/templateCatalog/package.json-default.md',
        './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
        './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
        './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
        './test/mockProject/.sum/temporary/.gitignore-default.md',
        './test/mockProject/.sum/temporary/README.md-default.md',
        './test/mockProject/.sum/temporary/package.json-default.md',
        './test/mockProject/.sum/temporary/test.sh-default.md',
        './test/mockProject/.sum/temporary/tsconfig.json-default.md',
        './test/mockProject/.sum/temporary/yarn.lock-default.md',
        './test/mockProject/.sum.config.json',
      ],
    });
  });

  it('should return correct content without extra file - project mockTemplateToUpdate ', async () => {
    config = { ...mockConfig.step.scanExtraFile.empty, ...partialConfig };
    sumFileMapConfig = { ...mockSumFileMapConfig.step.scanExtraFile.empty };

    config = {
      ...config,
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
      remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
      remoteRootRepositoryUrl:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate',
    };

    const FileToCreate: FileToCreateType[] = [
      {
        filePath: config.sumConfigFilePath,
        content: JSON.stringify(config),
      },
      {
        filePath: config.sumFileMapConfig,
        content: JSON.stringify(sumFileMapConfig),
      },
    ];
    await setupTestFiles(FileToCreate, config.isDebug);

    const result = await buildFromConfig(config);
    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });
    expect({ ...result, allFiles }).toStrictEqual({
      config: {
        ...mockConfig.step.buildFromConfig.empty,
        remoteFileMapURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate',
      },
      sumFileMapConfig: mockSumFileMapConfig.step.buildFromConfig.empty,
      allFiles: [
        './test/mockProject/.gitignore',
        './test/mockProject/.sum/repositoryMap.json',
        './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
        './test/mockProject/.sum/templateCatalog/README.md-default.md',
        './test/mockProject/.sum/templateCatalog/package.json-default.md',
        './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
        './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
        './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
        './test/mockProject/.sum/temporary/.gitignore-default.md',
        './test/mockProject/.sum/temporary/README.md-default.md',
        './test/mockProject/.sum/temporary/package.json-default.md',
        './test/mockProject/.sum/temporary/test.sh-default.md',
        './test/mockProject/.sum/temporary/tsconfig.json-default.md',
        './test/mockProject/.sum/temporary/yarn.lock-default.md',
        './test/mockProject/.sum.config.json',
        './test/mockProject/README.md',
        './test/mockProject/package.json',
        './test/mockProject/tools/test.sh',
        './test/mockProject/tsconfig.json',
        './test/mockProject/yarn.lock',
      ],
    });
  });

  it('should return correct content with extra file  - project mockTemplateToUpdate ', async () => {
    config = { ...mockConfig.step.scanExtraFile.fullFiled };
    config = {
      ...config,
      remoteFileMapURL:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
      remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
      remoteRootRepositoryUrl:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate',
    };
    sumFileMapConfig = { ...mockSumFileMapConfig.step.scanExtraFile.fullFiled };
    await createFile({
      filePath: config.sumConfigFilePath,
      content: JSON.stringify(config),
    });
    await createFile({
      filePath: config.sumFileMapConfig,
      content: JSON.stringify(sumFileMapConfig),
    });

    let keysToCreateFile: NonNullable<unknown>[] = Object.keys(sumFileMapConfig.sumFileMap || {}).slice(0, 3);

    keysToCreateFile = keysToCreateFile.map((key: any) => {
      if (sumFileMapConfig.sumFileMap) {
        return sumFileMapConfig.sumFileMap[key];
      }
      return [];
    });

    //Manual creation of custom and extend files
    const pathToCreateCustomFile = extractAndReplacePaths(keysToCreateFile, '-default.md', '-custom.md');
    const pathToCreateExtendFile = extractAndReplacePaths(keysToCreateFile, '-default.md', '-extend.md');
    const pathToCreate = [...pathToCreateExtendFile, ...pathToCreateCustomFile];

    for (const file of pathToCreate) {
      await createFile({
        filePath: file,
        content: `{"path": "${file}"}`,
      });
    }

    const result = await buildFromConfig(config);
    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });
    expect({ ...result, allFiles }).toStrictEqual({
      config: {
        ...mockConfig.step.buildFromConfig.fullFiled,
        remoteFileMapURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate',
      },
      sumFileMapConfig: mockSumFileMapConfig.step.buildFromConfig.fullFiled,
      allFiles: [
        './test/mockProject/.gitignore',
        './test/mockProject/.sum/repositoryMap.json',
        './test/mockProject/.sum/templateCatalog/.gitignore-custom.md',
        './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
        './test/mockProject/.sum/templateCatalog/.gitignore-extend.md',
        './test/mockProject/.sum/templateCatalog/README.md-custom.md',
        './test/mockProject/.sum/templateCatalog/README.md-default.md',
        './test/mockProject/.sum/templateCatalog/README.md-extend.md',
        './test/mockProject/.sum/templateCatalog/package.json-custom.md',
        './test/mockProject/.sum/templateCatalog/package.json-default.md',
        './test/mockProject/.sum/templateCatalog/package.json-extend.md',
        './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
        './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
        './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
        './test/mockProject/.sum/temporary/.gitignore-default.md',
        './test/mockProject/.sum/temporary/README.md-default.md',
        './test/mockProject/.sum/temporary/package.json-default.md',
        './test/mockProject/.sum/temporary/test.sh-default.md',
        './test/mockProject/.sum/temporary/tsconfig.json-default.md',
        './test/mockProject/.sum/temporary/yarn.lock-default.md',
        './test/mockProject/.sum.config.json',
        './test/mockProject/README.md',
        './test/mockProject/package.json',
        './test/mockProject/tools/test.sh',
        './test/mockProject/tsconfig.json',
        './test/mockProject/yarn.lock',
      ],
    });
  });
});
