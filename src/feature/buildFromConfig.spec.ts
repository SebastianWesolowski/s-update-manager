import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import {
  mockConfig_step_buildFromConfig_empty,
  mockConfig_step_buildFromConfig_fullFiled,
  mockConfig_step_initSave,
  mockSnpFileMapConfig_step_buildFromConfig_empty,
  mockSnpFileMapConfig_step_buildFromConfig_fullFiled,
  mockSnpFileMapConfig_step_scanExtraFile_empty,
  mockSnpFileMapConfig_step_scanExtraFile_fullFiled,
} from '@/feature/__tests__/const';
import { extractAndReplacePaths } from '@/feature/__tests__/extractAndReplacePaths';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { ConfigType } from '@/feature/config/types';
import { createFile } from '@/util/createFile';

describe('buildFromConfig', () => {
  let config: ConfigType;

  // const cleanUpFiles = async () => {
  //   await deletePath(createPath(config.snpCatalog), config.isDebug);
  //   const allFiles = searchFilesInDirectory({ directoryPath: config.projectCatalog });
  //   for (const file of allFiles) {
  //     await deletePath(createPath(file), config.isDebug);
  //   }
  // };

  beforeEach(async () => {
    config = { ...mockConfig_step_initSave };
    await cleanUpFiles({
      snpCatalog: config.snpCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });
    await createFile({
      filePath: config.snpConfigFile,
      content: JSON.stringify(mockConfig_step_initSave),
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
      filePath: config.snpFileMapConfig,
      content: JSON.stringify(mockSnpFileMapConfig_step_scanExtraFile_empty),
    });

    const result = await buildFromConfig(config);
    const allFiles = searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });
    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig_step_buildFromConfig_empty,
      snpFileMapConfig: mockSnpFileMapConfig_step_buildFromConfig_empty,
      allFiles: [
        'test/mockProject/.snp/repositoryMap.json',
        'test/mockProject/.snp/repositoryMap.json.backup',
        'test/mockProject/.snp/snp.config.json',
        'test/mockProject/.snp/templateCatalog/.gitignore-default.md',
        'test/mockProject/.snp/templateCatalog/README.md-default.md',
        'test/mockProject/.snp/templateCatalog/package.json-default.md',
        'test/mockProject/.snp/templateCatalog/tools/test.sh-default.md',
        'test/mockProject/.snp/templateCatalog/tsconfig.json-default.md',
        'test/mockProject/.snp/templateCatalog/yarn.lock-default.md',
        'test/mockProject/.snp/temporary/.gitignore-default.md',
        'test/mockProject/.snp/temporary/README.md-default.md',
        'test/mockProject/.snp/temporary/package.json-default.md',
        'test/mockProject/.snp/temporary/test.sh-default.md',
        'test/mockProject/.snp/temporary/tsconfig.json-default.md',
        'test/mockProject/.snp/temporary/yarn.lock-default.md',
      ],
    });
  });

  it('should return correct content with extra file', async () => {
    await createFile({
      filePath: config.snpFileMapConfig,
      content: JSON.stringify(mockSnpFileMapConfig_step_scanExtraFile_fullFiled),
    });

    let keysToCreateFile = Object.keys(mockSnpFileMapConfig_step_scanExtraFile_fullFiled.snpFileMap).slice(0, 3);
    keysToCreateFile = keysToCreateFile.map((key) => mockSnpFileMapConfig_step_scanExtraFile_fullFiled.snpFileMap[key]);

    const pathToCreateCustomFile = extractAndReplacePaths(keysToCreateFile, '-default.md', '-custom.md');
    const pathToCreateExtendFile = extractAndReplacePaths(keysToCreateFile, '-default.md', '-extend.md');
    const pathToCreate = [...pathToCreateExtendFile, ...pathToCreateCustomFile];

    for (const file of pathToCreate) {
      await createFile({
        filePath: file,
        content: `{"path": "${file}"}`,
      });
    }
    const result = await buildFromConfig(config);

    const allFiles = searchFilesInDirectory({
      directoryPath: config.snpCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, createdFile: allFiles }).toStrictEqual({
      config: mockConfig_step_buildFromConfig_fullFiled,
      snpFileMapConfig: mockSnpFileMapConfig_step_buildFromConfig_fullFiled,
      allFiles: [
        'test/mockProject/.snp/templateCatalog/.gitignore-custom.md',
        'test/mockProject/.snp/templateCatalog/.gitignore-default.md',
        'test/mockProject/.snp/templateCatalog/.gitignore-extend.md',
        'test/mockProject/.snp/templateCatalog/README.md-custom.md',
        'test/mockProject/.snp/templateCatalog/README.md-default.md',
        'test/mockProject/.snp/templateCatalog/README.md-extend.md',
        'test/mockProject/.snp/templateCatalog/package.json-custom.md',
        'test/mockProject/.snp/templateCatalog/package.json-default.md',
        'test/mockProject/.snp/templateCatalog/package.json-extend.md',
        'test/mockProject/.snp/templateCatalog/tools/test.sh-default.md',
        'test/mockProject/.snp/templateCatalog/tsconfig.json-default.md',
        'test/mockProject/.snp/templateCatalog/yarn.lock-default.md',
        'test/mockProject/.snp/temporary/.gitignore-default.md',
        'test/mockProject/.snp/temporary/README.md-default.md',
        'test/mockProject/.snp/temporary/package.json-default.md',
        'test/mockProject/.snp/temporary/test.sh-default.md',
        'test/mockProject/.snp/temporary/tsconfig.json-default.md',
        'test/mockProject/.snp/temporary/yarn.lock-default.md',
      ],
    });
  });
});
