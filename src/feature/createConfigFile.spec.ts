import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig } from '@/feature/__tests__/const';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { ConfigType } from '@/feature/config/types';
import { createConfigFile } from '@/feature/createConfigFile';

describe('createConfigFile', () => {
  let config: ConfigType;

  beforeEach(async () => {
    config = { ...mockConfig.step.init };

    await cleanUpFiles({
      snpCatalog: config.snpCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });
  });

  afterEach(async () => {
    await cleanUpFiles({
      snpCatalog: config.snpCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });
  });

  it('should return correct creation', async () => {
    const result = await createConfigFile(config);
    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.createConfigFile,
      configFilePath: mockConfig.step.createConfigFile.snpConfigFile,
      allFiles: ['test/mockProject/.snp/snp.config.json'],
    });
  });
});
