import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSumFileMapConfig } from '@/feature/__tests__/const';
import { extractAndReplacePaths } from '@/feature/__tests__/extractAndReplacePaths';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { updateConfigBasedOnComparison } from '@/feature/__tests__/updateConfigBasedOnComparison';
import { cleanUpBeforeUpdate } from '@/feature/cleanUpBeforeUpdate';
import { ConfigType } from '@/feature/config/types';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';

describe('cleanUpBeforeUpdate', () => {
  let partialConfig: Partial<ConfigType>;
  let config: ConfigType;
  let sumFileMapConfig: FileMapConfig;

  beforeEach(async () => {
    const configFullField = mockConfig.step.cleanUp.fullFiled;
    const configEmpty = mockConfig.step.cleanUp.empty;
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

  it('should clean up files and update the configuration accordingly - without extra file', async () => {
    config = { ...mockConfig.step.cleanUp.empty, ...partialConfig };
    sumFileMapConfig = { ...mockSumFileMapConfig.step.cleanUp.empty };

    // Set up mock files for testing
    await createFile({
      filePath: config.sumConfigFilePath,
      content: JSON.stringify(config),
    });
    await createFile({
      filePath: config.sumFileMapConfig,
      content: JSON.stringify(sumFileMapConfig),
    });

    // Manually create files listed in the sumFileMapConfig's fileMap

    for (const file of sumFileMapConfig.createdFileMap) {
      await createFile({
        filePath: file,
        content: `{"path": "${file}"}`,
      });
    }

    // Run the cleanUpBeforeUpdate function
    const result = await cleanUpBeforeUpdate(config);

    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    // Expectations: The files should remain untouched as there were no files to clean up
    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.cleanUpBeforeUpdate.empty,
      sumFileMapConfig: mockSumFileMapConfig.step.cleanUpBeforeUpdate.empty,
      allFiles: ['./test/mockProject/.sum/repositoryMap.json', './test/mockProject/.sum.config.json'],
      deletedPath: [
        './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
        './test/mockProject/.gitignore',
        './test/mockProject/.sum/templateCatalog/README.md-default.md',
        './test/mockProject/README.md',
        './test/mockProject/.sum/templateCatalog/package.json-default.md',
        './test/mockProject/package.json',
        './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
        './test/mockProject/tools/test.sh',
        './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
        './test/mockProject/tsconfig.json',
        './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
        './test/mockProject/yarn.lock',
      ],
    });
  });
  //
  it('with extra files', async () => {
    config = { ...mockConfig.step.cleanUp.fullFiled, ...partialConfig };
    sumFileMapConfig = { ...mockSumFileMapConfig.step.cleanUp.fullFiled };

    // Set up mock files for testing
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
    const pathToCreate = [...pathToCreateExtendFile, ...pathToCreateCustomFile, ...sumFileMapConfig.createdFileMap];
    const uniquePathToCreate = [...new Set(pathToCreate)];

    for (const file of uniquePathToCreate) {
      await createFile({
        filePath: file,
        content: `{"path": "${file}"}`,
      });
    }

    // Run the cleanUpBeforeUpdate function
    const result = await cleanUpBeforeUpdate(config);

    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    // Expectations: The files should remain untouched as there were no files to clean up
    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.cleanUpBeforeUpdate.fullFiled,
      sumFileMapConfig: mockSumFileMapConfig.step.cleanUpBeforeUpdate.fullFiled,
      allFiles: [
        './test/mockProject/.sum/repositoryMap.json',
        './test/mockProject/.sum/templateCatalog/.gitignore-custom.md',
        './test/mockProject/.sum/templateCatalog/.gitignore-extend.md',
        './test/mockProject/.sum/templateCatalog/README.md-custom.md',
        './test/mockProject/.sum/templateCatalog/README.md-extend.md',
        './test/mockProject/.sum/templateCatalog/package.json-custom.md',
        './test/mockProject/.sum/templateCatalog/package.json-extend.md',
        './test/mockProject/.sum.config.json',
      ],
      deletedPath: [
        './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
        './test/mockProject/.gitignore',
        './test/mockProject/.sum/templateCatalog/README.md-default.md',
        './test/mockProject/README.md',
        './test/mockProject/.sum/templateCatalog/package.json-default.md',
        './test/mockProject/package.json',
        './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
        './test/mockProject/tools/test.sh',
        './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
        './test/mockProject/tsconfig.json',
        './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
        './test/mockProject/yarn.lock',
      ],
    });
  });
});
