import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSnpFileMapConfig } from '@/feature/__tests__/const';
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
  // it('should handle cases where there are no files to clean up', async () => {
  //   // Set up the mock configuration with no fileMap
  //   config = { ...mockConfig.step.createConfigFile };
  //
  //   await createFile({
  //     filePath: config.snpConfigFile,
  //     content: JSON.stringify(config),
  //   });
  //   await createFile({
  //     filePath: config.snpFileMapConfig,
  //     content: JSON.stringify({
  //       ...mockSnpFileMapConfig.step.prepareBaseSnpFileMap,
  //       fileMap: [], // Ensure fileMap is empty
  //     }),
  //   });
  //
  //   // Run the cleanUpBeforeUpdate function
  //   const result = await cleanUpBeforeUpdate(config);
  //
  //   const allFiles = searchFilesInDirectory({
  //     directoryPath: config.projectCatalog,
  //     excludedFileNames: ['.DS_Store'],
  //     excludedPhrases: ['.backup'],
  //   });
  //
  //   // Expectations: The files should remain untouched as there were no files to clean up
  //   expect({ ...result, allFiles }).toStrictEqual({
  //     config: mockConfig.step.buildFromConfig.empty,
  //     snpFileMapConfig: mockSnpFileMapConfig.step.buildFromConfig.empty,
  //     allFiles: [
  //       'test/mockProject/.gitignore',
  //       'test/mockProject/.snp/repositoryMap.json',
  //       'test/mockProject/.snp/snp.config.json',
  //       'test/mockProject/.snp/templateCatalog/.gitignore-default.md',
  //       'test/mockProject/.snp/templateCatalog/README.md-default.md',
  //       'test/mockProject/.snp/templateCatalog/package.json-default.md',
  //       'test/mockProject/.snp/templateCatalog/tools/test.sh-default.md',
  //       'test/mockProject/.snp/templateCatalog/tsconfig.json-default.md',
  //       'test/mockProject/.snp/templateCatalog/yarn.lock-default.md',
  //       'test/mockProject/.snp/temporary/.gitignore-default.md',
  //       'test/mockProject/.snp/temporary/README.md-default.md',
  //       'test/mockProject/.snp/temporary/package.json-default.md',
  //       'test/mockProject/.snp/temporary/test.sh-default.md',
  //       'test/mockProject/.snp/temporary/tsconfig.json-default.md',
  //       'test/mockProject/.snp/temporary/yarn.lock-default.md',
  //       'test/mockProject/README.md',
  //       'test/mockProject/package.json',
  //       'test/mockProject/tools/test.sh',
  //       'test/mockProject/tsconfig.json',
  //       'test/mockProject/yarn.lock',
  //     ],
  //   });
  //
  //   // Ensure that the function returned the correct config object
  //   expect(result).toStrictEqual(config);
  // });

  // it('should handle errors gracefully', async () => {
  //   // Simulate an error by providing an invalid path in the fileMap
  //   config = { ...mockConfig.step.createConfigFile };
  //
  //   await createFile({
  //     filePath: config.snpConfigFile,
  //     content: JSON.stringify(config),
  //   });
  //   await createFile({
  //     filePath: config.snpFileMapConfig,
  //     content: JSON.stringify({
  //       ...mockSnpFileMapConfig.step.prepareBaseSnpFileMap,
  //       fileMap: ['invalid/path/to/file'], // Invalid path to simulate an error
  //     }),
  //   });
  //
  //   await expect(cleanUpBeforeUpdate(config)).rejects.toThrow('Error while downloading config from github');
  // });
});
