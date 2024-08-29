import {
  mockConfig_step_initSave,
  mockSnpFileMapConfig_step_prepareBaseSnpFileMap,
  mockSnpFileMapConfig_step_scanExtraFile_empty,
  mockSnpFileMapConfig_step_scanExtraFile_fullFiled,
} from '@/feature/__tests__/const';
import { extractAndReplacePaths } from '@/feature/__tests__/extractAndReplacePaths';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { ConfigType } from '@/feature/config/types';
import { scanExtraFile } from '@/feature/scanExtraFile';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';

describe('scanExtraFile', () => {
  let config: ConfigType;

  const cleanUpFiles = async () => {
    await deletePath(createPath(config.snpConfigFile), config.isDebug);
    await deletePath(createPath(config.snpFileMapConfig), config.isDebug);

    const generateFiles = searchFilesInDirectory({
      directoryPath: config.snpCatalog,
      phrases: config.availableSNPSuffix,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    for (const file of generateFiles) {
      console.log(file);
      // await deletePath(createPath(file), config.isDebug);
    }
  };

  beforeEach(async () => {
    config = { ...mockConfig_step_initSave };
    await cleanUpFiles();
    await createFile({
      filePath: config.snpConfigFile,
      content: JSON.stringify(mockConfig_step_initSave),
    });
    await createFile({
      filePath: config.snpFileMapConfig,
      content: JSON.stringify(mockSnpFileMapConfig_step_prepareBaseSnpFileMap),
    });
  });

  afterEach(async () => {
    await cleanUpFiles();
  });

  it('should return correct content without extra file', async () => {
    const result = await scanExtraFile(config);

    expect(result).toStrictEqual({
      config: mockConfig_step_initSave,
      snpFileMapConfig: mockSnpFileMapConfig_step_scanExtraFile_empty,
    });
  });

  it('should return correct content with extra file', async () => {
    let keysToCreateFile = Object.keys(mockSnpFileMapConfig_step_prepareBaseSnpFileMap.snpFileMap).slice(0, 3);
    keysToCreateFile = keysToCreateFile.map((key) => mockSnpFileMapConfig_step_prepareBaseSnpFileMap.snpFileMap[key]);

    const pathToCreateCustomFile = extractAndReplacePaths(keysToCreateFile, '-default.md', '-custom.md');
    const pathToCreateExtendFile = extractAndReplacePaths(keysToCreateFile, '-default.md', '-extend.md');
    const pathToCreate = [...pathToCreateExtendFile, ...pathToCreateCustomFile];

    for (const file of pathToCreate) {
      await createFile({
        filePath: file,
        content: 'file path = ' + file,
      });
    }
    debugger;
    const result = await scanExtraFile(config);

    expect(result).toStrictEqual({
      config: mockConfig_step_initSave,
      snpFileMapConfig: mockSnpFileMapConfig_step_scanExtraFile_fullFiled,
    });
  });
});
