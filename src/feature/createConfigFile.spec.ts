import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig_step_init, mockConfig_step_initSave } from '@/feature/__tests__/const';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { ConfigType } from '@/feature/config/types';
import { createConfigFile } from '@/feature/createConfigFile';

describe('createConfigFile', () => {
  let config: ConfigType;

  beforeEach(async () => {
    config = { ...mockConfig_step_init };

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
    const allFiles = searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig_step_initSave,
      configFilePath: mockConfig_step_initSave.snpConfigFile,
      allFiles: ['test/mockProject/.snp/snp.config.json'],
    });
  });
});
