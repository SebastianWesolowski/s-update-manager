import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSnpFileMapConfig } from '@/feature/__tests__/const';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { ConfigType } from '@/feature/config/types';
import { downloadConfig } from '@/feature/downloadConfig';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';

describe('downloadConfig', () => {
  let config: ConfigType;
  let snpFileMapConfig: FileMapConfig;

  beforeEach(async () => {
    config = { ...mockConfig.step.createConfigFile };
    snpFileMapConfig = { ...mockSnpFileMapConfig.step.createConfigFile };

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

  it('should return correct content with only snpConfigFile', async () => {
    await createFile({
      filePath: config.snpConfigFile,
      content: JSON.stringify(config),
    });

    const result = await downloadConfig(config);
    const allFiles = searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      config: {
        ...mockConfig.step.downloadConfigFile,
      },
      downloadContent: mockSnpFileMapConfig.step.init,
      snpFileMapConfig: mockSnpFileMapConfig.step.downloadConfigFile,
      allFiles: [
        'test/mockProject/.snp/repositoryMap.json',
        'test/mockProject/.snp/snp.config.json',
        'test/mockProject/.snp/temporary/repositoryMap.json',
      ],
    });
  });

  it('should return correct content with both configs file', async () => {
    await createFile({
      filePath: config.snpConfigFile,
      content: JSON.stringify(config),
    });

    await createFile({
      filePath: config.snpFileMapConfig,
      content: JSON.stringify(snpFileMapConfig),
    });

    const result = await downloadConfig(config);
    const allFiles = searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });
    expect({ ...result, allFiles }).toStrictEqual({
      config: {
        ...mockConfig.step.downloadConfigFile,
      },
      downloadContent: mockSnpFileMapConfig.step.init,
      snpFileMapConfig: mockSnpFileMapConfig.step.downloadConfigFile,
      allFiles: [
        'test/mockProject/.snp/repositoryMap.json',
        'test/mockProject/.snp/snp.config.json',
        'test/mockProject/.snp/temporary/repositoryMap.json',
      ],
    });
  });

  // it('should return correct content with both configs file and update', async () => {
  //   config = {
  //     ...config,
  //     remoteFileMapURL:
  //       'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/mockUpdatedTemplate/templateCatalog/repositoryMap.json',
  //     remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
  //     remoteRootRepositoryUrl:
  //       'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
  //   };
  //
  //   await createFile({
  //     filePath: config.snpConfigFile,
  //     content: JSON.stringify(config),
  //   });
  //
  //   await createFile({
  //     filePath: config.snpFileMapConfig,
  //     content: JSON.stringify(snpFileMapConfig),
  //   });
  //
  //   const result = await downloadConfig(config);
  //   const allFiles = searchFilesInDirectory({
  //     directoryPath: config.projectCatalog,
  //     excludedFileNames: ['.DS_Store'],
  //     excludedPhrases: ['.backup'],
  //   });
  //   expect({ result, allFiles }).toStrictEqual({
  //     config: {
  //       ...config,
  //     },
  //     downloadContent: mockSnpFileMapConfig.step.init,
  //     snpFileMapConfig: mockSnpFileMapConfig.step.downloadConfigFile,
  //     allFiles: [
  //       'test/mockProject/.snp/repositoryMap.json',
  //       'test/mockProject/.snp/snp.config.json',
  //       'test/mockProject/.snp/temporary/repositoryMap.json',
  //     ],
  //   });
  // });
});
