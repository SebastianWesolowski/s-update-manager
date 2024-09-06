import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSnpFileMapConfig } from '@/feature/__tests__/const';
import { extractAndReplacePaths } from '@/feature/__tests__/extractAndReplacePaths';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { updateConfigBasedOnComparison } from '@/feature/__tests__/updateConfigBasedOnComparison';
import { buildFromConfig } from '@/feature/buildFromConfig';
import { ConfigType } from '@/feature/config/types';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';

describe('buildFromConfig', () => {
  let partialConfig: Partial<ConfigType>;
  let config: ConfigType;
  let snpFileMapConfig: FileMapConfig;

  beforeEach(async () => {
    const configFullField = mockConfig.step.scanExtraFile.fullFiled;
    const configEmpty = mockConfig.step.scanExtraFile.empty;
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

  it('should return correct content without extra file', async () => {
    config = { ...mockConfig.step.scanExtraFile.empty, ...partialConfig };
    snpFileMapConfig = { ...mockSnpFileMapConfig.step.scanExtraFile.empty };

    await createFile({
      filePath: config.snpConfigFile,
      content: JSON.stringify(config),
    });
    await createFile({
      filePath: config.snpFileMapConfig,
      content: JSON.stringify(snpFileMapConfig),
    });

    const result = await buildFromConfig(config);
    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });
    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.buildFromConfig.empty,
      snpFileMapConfig: mockSnpFileMapConfig.step.buildFromConfig.empty,
      allFiles: [
        './test/mockProject/.gitignore',
        './test/mockProject/.snp/repositoryMap.json',
        './test/mockProject/.snp/snp.config.json',
        './test/mockProject/.snp/templateCatalog/.gitignore-default.md',
        './test/mockProject/.snp/templateCatalog/README.md-default.md',
        './test/mockProject/.snp/templateCatalog/package.json-default.md',
        './test/mockProject/.snp/templateCatalog/tools/test.sh-default.md',
        './test/mockProject/.snp/templateCatalog/tsconfig.json-default.md',
        './test/mockProject/.snp/templateCatalog/yarn.lock-default.md',
        './test/mockProject/.snp/temporary/.gitignore-default.md',
        './test/mockProject/.snp/temporary/README.md-default.md',
        './test/mockProject/.snp/temporary/package.json-default.md',
        './test/mockProject/.snp/temporary/test.sh-default.md',
        './test/mockProject/.snp/temporary/tsconfig.json-default.md',
        './test/mockProject/.snp/temporary/yarn.lock-default.md',
        './test/mockProject/README.md',
        './test/mockProject/package.json',
        './test/mockProject/tools/test.sh',
        './test/mockProject/tsconfig.json',
        './test/mockProject/yarn.lock',
      ],
    });
  });

  it('should return correct content with extra file', async () => {
    config = { ...mockConfig.step.scanExtraFile.fullFiled };
    snpFileMapConfig = { ...mockSnpFileMapConfig.step.scanExtraFile.fullFiled };
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
        content: `{"path": "${file}"}`,
      });
    }

    const result = await buildFromConfig(config);
    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });
    expect({ ...result, allFiles }).toStrictEqual({
      config: mockConfig.step.buildFromConfig.fullFiled,
      snpFileMapConfig: mockSnpFileMapConfig.step.buildFromConfig.fullFiled,
      allFiles: [
        './test/mockProject/.gitignore',
        './test/mockProject/.snp/repositoryMap.json',
        './test/mockProject/.snp/snp.config.json',
        './test/mockProject/.snp/templateCatalog/.gitignore-custom.md',
        './test/mockProject/.snp/templateCatalog/.gitignore-default.md',
        './test/mockProject/.snp/templateCatalog/.gitignore-extend.md',
        './test/mockProject/.snp/templateCatalog/README.md-custom.md',
        './test/mockProject/.snp/templateCatalog/README.md-default.md',
        './test/mockProject/.snp/templateCatalog/README.md-extend.md',
        './test/mockProject/.snp/templateCatalog/package.json-custom.md',
        './test/mockProject/.snp/templateCatalog/package.json-default.md',
        './test/mockProject/.snp/templateCatalog/package.json-extend.md',
        './test/mockProject/.snp/templateCatalog/tools/test.sh-default.md',
        './test/mockProject/.snp/templateCatalog/tsconfig.json-default.md',
        './test/mockProject/.snp/templateCatalog/yarn.lock-default.md',
        './test/mockProject/.snp/temporary/.gitignore-default.md',
        './test/mockProject/.snp/temporary/README.md-default.md',
        './test/mockProject/.snp/temporary/package.json-default.md',
        './test/mockProject/.snp/temporary/test.sh-default.md',
        './test/mockProject/.snp/temporary/tsconfig.json-default.md',
        './test/mockProject/.snp/temporary/yarn.lock-default.md',
        './test/mockProject/README.md',
        './test/mockProject/package.json',
        './test/mockProject/tools/test.sh',
        './test/mockProject/tsconfig.json',
        './test/mockProject/yarn.lock',
      ],
    });
  });
});
