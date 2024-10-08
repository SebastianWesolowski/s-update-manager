import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSumFileMapConfig } from '@/feature/__tests__/const';
import { extractAndReplacePaths } from '@/feature/__tests__/extractAndReplacePaths';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { ConfigType } from '@/feature/config/types';
import { scanExtraFile } from '@/feature/scanExtraFile';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';

describe('scanExtraFile', () => {
  let config: ConfigType;
  let sumFileMapConfig: FileMapConfig;

  beforeEach(async () => {
    config = { ...mockConfig.step.createConfigFile };
    sumFileMapConfig = { ...mockSumFileMapConfig.step.prepareBaseSumFileMap };

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

  it('should return correct content without extra file', async () => {
    await createFile({
      filePath: config.sumConfigFile,
      content: JSON.stringify(config),
    });
    await createFile({
      filePath: config.sumFileMapConfig,
      content: JSON.stringify(sumFileMapConfig),
    });

    const result = await scanExtraFile(config);
    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.scanExtraFile.empty,
      sumFileMapConfig: mockSumFileMapConfig.step.scanExtraFile.empty,
      allFiles: ['./test/mockProject/.sum/repositoryMap.json', './test/mockProject/.sum/sum.config.json'],
    });
  });

  it('should return correct content with extra file', async () => {
    await createFile({
      filePath: config.sumConfigFile,
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
        content: 'file path = ' + file,
      });
    }
    const result = await scanExtraFile(config);
    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.scanExtraFile.fullFiled,
      sumFileMapConfig: mockSumFileMapConfig.step.scanExtraFile.fullFiled,
      allFiles: [
        './test/mockProject/.sum/repositoryMap.json',
        './test/mockProject/.sum/sum.config.json',
        './test/mockProject/.sum/templateCatalog/.gitignore-custom.md',
        './test/mockProject/.sum/templateCatalog/.gitignore-extend.md',
        './test/mockProject/.sum/templateCatalog/README.md-custom.md',
        './test/mockProject/.sum/templateCatalog/README.md-extend.md',
        './test/mockProject/.sum/templateCatalog/package.json-custom.md',
        './test/mockProject/.sum/templateCatalog/package.json-extend.md',
      ],
    });
  });
});
