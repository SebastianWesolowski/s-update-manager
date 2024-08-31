import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSnpFileMapConfig } from '@/feature/__tests__/const';
import { extractAndReplacePaths } from '@/feature/__tests__/extractAndReplacePaths';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { ConfigType } from '@/feature/config/types';
import { scanExtraFile } from '@/feature/scanExtraFile';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';

describe('scanExtraFile', () => {
  let config: ConfigType;
  let snpFileMapConfig: FileMapConfig;

  beforeEach(async () => {
    config = { ...mockConfig.step.createConfigFile };
    snpFileMapConfig = { ...mockSnpFileMapConfig.step.prepareBaseSnpFileMap };

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

  it('should return correct content without extra file', async () => {
    await createFile({
      filePath: config.snpConfigFile,
      content: JSON.stringify(config),
    });
    await createFile({
      filePath: config.snpFileMapConfig,
      content: JSON.stringify(snpFileMapConfig),
    });

    const result = await scanExtraFile(config);
    const allFiles = searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.scanExtraFile.empty,
      snpFileMapConfig: mockSnpFileMapConfig.step.scanExtraFile.empty,
      allFiles: ['test/mockProject/.snp/repositoryMap.json', 'test/mockProject/.snp/snp.config.json'],
    });
  });

  it('should return correct content with extra file', async () => {
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
    const pathToCreate = [...pathToCreateExtendFile, ...pathToCreateCustomFile];

    for (const file of pathToCreate) {
      await createFile({
        filePath: file,
        content: 'file path = ' + file,
      });
    }
    const result = await scanExtraFile(config);
    const allFiles = searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.scanExtraFile.fullFiled,
      snpFileMapConfig: mockSnpFileMapConfig.step.scanExtraFile.fullFiled,
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
    });
  });
});
