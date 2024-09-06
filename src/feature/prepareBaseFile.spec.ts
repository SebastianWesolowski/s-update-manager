import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSnpFileMapConfig } from '@/feature/__tests__/const';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { ConfigType } from '@/feature/config/types';
import { prepareBaseSnpFileMap } from '@/feature/prepareBaseFile';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';

describe('prepareBaseSnpFileMap', () => {
  let config: ConfigType;
  let snpFileMapConfig: FileMapConfig;

  beforeEach(async () => {
    config = { ...mockConfig.step.downloadConfigFile.forInit };
    snpFileMapConfig = { ...mockSnpFileMapConfig.step.downloadConfigFile.forInit };

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

  it('should return correct content', async () => {
    await createFile({
      filePath: config.snpConfigFile,
      content: JSON.stringify(config),
    });
    await createFile({
      filePath: config.snpFileMapConfig,
      content: JSON.stringify(snpFileMapConfig),
    });

    const result = await prepareBaseSnpFileMap(config);
    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });
    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.createConfigFile,
      snpFileMapConfig: mockSnpFileMapConfig.step.prepareBaseSnpFileMap,
      allFiles: ['test/mockProject/.snp/repositoryMap.json', 'test/mockProject/.snp/snp.config.json'],
    });
  });
});
