import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSumFileMapConfig } from '@/feature/__tests__/const';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { ConfigType } from '@/feature/config/types';
import { prepareBaseSumFileMap } from '@/feature/prepareBaseFile';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';

describe('prepareBaseSumFileMap', () => {
  let config: ConfigType;
  let sumFileMapConfig: FileMapConfig;

  beforeEach(async () => {
    config = { ...mockConfig.step.downloadConfigFile.forInit };
    sumFileMapConfig = { ...mockSumFileMapConfig.step.downloadConfigFile.forInit };

    await cleanUpFiles({
      sumCatalog: config.sumCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });
  });

  afterEach(async () => {
    await cleanUpFiles({
      sumCatalog: config.sumCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });
  });

  it('should return correct content', async () => {
    await createFile({
      filePath: config.sumConfigFile,
      content: JSON.stringify(config),
    });
    await createFile({
      filePath: config.sumFileMapConfig,
      content: JSON.stringify(sumFileMapConfig),
    });

    const result = await prepareBaseSumFileMap(config);
    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });
    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.createConfigFile,
      sumFileMapConfig: mockSumFileMapConfig.step.prepareBaseSumFileMap,
      allFiles: ['./test/mockProject/.sum/repositoryMap.json', './test/mockProject/.sum/sum.config.json'],
    });
  });
});
