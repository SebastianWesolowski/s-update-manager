import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSnpFileMapConfig } from '@/feature/__tests__/const';
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
  let snpFileMapConfig: FileMapConfig;

  beforeEach(async () => {
    const configFullField = mockConfig.step.cleanUp.fullFiled;
    const configEmpty = mockConfig.step.cleanUp.empty;
    const keysToCompare: (keyof ConfigType)[] = ['snpCatalog', 'projectCatalog', 'isDebug'];

    partialConfig = updateConfigBasedOnComparison<Partial<ConfigType>>(
      partialConfig,
      configFullField,
      configEmpty,
      keysToCompare
    );

    if (partialConfig.snpCatalog && partialConfig.projectCatalog && partialConfig.isDebug) {
      await cleanUpFiles({
        snpCatalog: partialConfig.snpCatalog,
        directoryPath: partialConfig.projectCatalog,
        isDebug: partialConfig.isDebug,
      });
    }
  });

  afterEach(async () => {
    await cleanUpFiles({
      snpCatalog: config.snpCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });
  });

  it('should clean up files and update the configuration accordingly - without extra file', async () => {
    config = { ...mockConfig.step.cleanUp.empty, ...partialConfig };
    snpFileMapConfig = { ...mockSnpFileMapConfig.step.cleanUp.empty };

    // Set up mock files for testing
    await createFile({
      filePath: config.snpConfigFile,
      content: JSON.stringify(config),
    });
    await createFile({
      filePath: config.snpFileMapConfig,
      content: JSON.stringify(snpFileMapConfig),
    });

    // Manually create files listed in the snpFileMapConfig's fileMap

    for (const file of snpFileMapConfig.createdFileMap) {
      await createFile({
        filePath: file,
        content: `{"path": "${file}"}`,
      });
    }

    // Run the cleanUpBeforeUpdate function
    const result = await cleanUpBeforeUpdate(config);

    const allFiles = searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    // Expectations: The files should remain untouched as there were no files to clean up
    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.cleanUpBeforeUpdate.empty,
      snpFileMapConfig: mockSnpFileMapConfig.step.cleanUpBeforeUpdate.empty,
      allFiles: ['test/mockProject/.snp/repositoryMap.json', 'test/mockProject/.snp/snp.config.json'],
      deletedPath: [
        './test/mockProject/.snp/templateCatalog/.gitignore-default.md',
        './test/mockProject/.gitignore',
        './test/mockProject/.snp/templateCatalog/README.md-default.md',
        './test/mockProject/README.md',
        './test/mockProject/.snp/templateCatalog/package.json-default.md',
        './test/mockProject/package.json',
        './test/mockProject/.snp/templateCatalog/tools/test.sh-default.md',
        './test/mockProject/tools/test.sh',
        './test/mockProject/.snp/templateCatalog/tsconfig.json-default.md',
        './test/mockProject/tsconfig.json',
        './test/mockProject/.snp/templateCatalog/yarn.lock-default.md',
        './test/mockProject/yarn.lock',
      ],
    });
  });
  //
  it('with extra files', async () => {
    config = { ...mockConfig.step.cleanUp.fullFiled, ...partialConfig };
    snpFileMapConfig = { ...mockSnpFileMapConfig.step.cleanUp.fullFiled };

    // Set up mock files for testing
    await createFile({
      filePath: config.snpConfigFile,
      content: JSON.stringify(config),
    });
    await createFile({
      filePath: config.snpFileMapConfig,
      content: JSON.stringify(snpFileMapConfig),
    });

    let keysToCreateFile: NonNullable<unknown>[] = Object.keys(snpFileMapConfig.snpFileMap || {}).slice(0, 3);

    keysToCreateFile = keysToCreateFile.map((key: any) => {
      if (snpFileMapConfig.snpFileMap) {
        return snpFileMapConfig.snpFileMap[key];
      }
      return [];
    });

    //Manual creation of custom and extend files
    const pathToCreateCustomFile = extractAndReplacePaths(keysToCreateFile, '-default.md', '-custom.md');
    const pathToCreateExtendFile = extractAndReplacePaths(keysToCreateFile, '-default.md', '-extend.md');
    const pathToCreate = [...pathToCreateExtendFile, ...pathToCreateCustomFile, ...snpFileMapConfig.createdFileMap];
    const uniquePathToCreate = [...new Set(pathToCreate)];

    for (const file of uniquePathToCreate) {
      await createFile({
        filePath: file,
        content: `{"path": "${file}"}`,
      });
    }

    // Run the cleanUpBeforeUpdate function
    const result = await cleanUpBeforeUpdate(config);

    const allFiles = searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    // Expectations: The files should remain untouched as there were no files to clean up
    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.cleanUpBeforeUpdate.fullFiled,
      snpFileMapConfig: mockSnpFileMapConfig.step.cleanUpBeforeUpdate.fullFiled,
      allFiles: [
        'test/mockProject/.snp/repositoryMap.json',
        'test/mockProject/.snp/snp.config.json',
        'test/mockProject/.snp/templateCatalog/.gitignore-custom.md',
        'test/mockProject/.snp/templateCatalog/.gitignore-extend.md',
        'test/mockProject/.snp/templateCatalog/README.md-custom.md',
        'test/mockProject/.snp/templateCatalog/README.md-extend.md',
        'test/mockProject/.snp/templateCatalog/package.json-custom.md',
        'test/mockProject/.snp/templateCatalog/package.json-extend.md',
      ],
      deletedPath: [
        './test/mockProject/.snp/templateCatalog/.gitignore-default.md',
        './test/mockProject/.gitignore',
        './test/mockProject/.snp/templateCatalog/README.md-default.md',
        './test/mockProject/README.md',
        './test/mockProject/.snp/templateCatalog/package.json-default.md',
        './test/mockProject/package.json',
        './test/mockProject/.snp/templateCatalog/tools/test.sh-default.md',
        './test/mockProject/tools/test.sh',
        './test/mockProject/.snp/templateCatalog/tsconfig.json-default.md',
        './test/mockProject/tsconfig.json',
        './test/mockProject/.snp/templateCatalog/yarn.lock-default.md',
        './test/mockProject/yarn.lock',
      ],
    });
  });
});
