import { cleanUpTemplate } from './cleanUpTemplate';
import { cleanUpFiles } from '../__tests__/cleanForTests';
import { searchFilesInDirectory } from '../__tests__/searchFilesInDirectory';
import { ConfigTemplateType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';

describe('cleanUpTemplate', () => {
  let templateConfig: ConfigTemplateType;
  beforeEach(async () => {
    templateConfig = { ...mockTemplateConfig.bumpVersion };

    await cleanUpFiles({
      snpCatalog: templateConfig.templateCatalogPath,
      directoryPath: templateConfig.projectCatalog,
      isDebug: templateConfig.isDebug,
    });
  });

  afterEach(async () => {
    await cleanUpFiles({
      snpCatalog: templateConfig.templateCatalogPath,
      directoryPath: templateConfig.projectCatalog,
      isDebug: templateConfig.isDebug,
    });
  });

  it('should do nothing when directory is empty', async () => {
    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    const result = await cleanUpTemplate(templateConfig);

    expect({ ...result, allFiles }).toEqual({
      templateConfig,
      allFiles: [],
    });
  });

  it('should do nothing when only template config file exists', async () => {
    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(templateConfig),
    });

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    const result = await cleanUpTemplate(templateConfig);

    expect({ ...result, allFiles }).toEqual({
      templateConfig,
      allFiles: ['./test/mockTemplate/repositoryMap.json'],
    });
  });

  it('should keep only config file when template catalog exists', async () => {
    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(templateConfig),
    });
    await createCatalog(templateConfig.templateCatalogPath);

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    const result = await cleanUpTemplate(templateConfig);

    expect({ ...result, allFiles }).toEqual({
      templateConfig,
      allFiles: ['./test/mockTemplate/repositoryMap.json'],
    });
  });

  it('should clean up template catalog, leaving only config file', async () => {
    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(templateConfig),
    });
    await createCatalog(templateConfig.templateCatalogPath);
    await createFile({
      filePath: createPath([templateConfig.repositoryMapFilePath, 'dummy.md']),
      content: JSON.stringify('dummy'),
    });

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    const result = await cleanUpTemplate(templateConfig);

    expect({ ...result, allFiles }).toEqual({
      templateConfig,
      allFiles: ['./test/mockTemplate/repositoryMap.json'],
    });
  });

  it('should keep only config file after file update', async () => {
    const templateConfig = mockTemplateConfig.prepareFileList;
    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(templateConfig),
    });
    await createCatalog(templateConfig.templateCatalogPath);
    await createFile({
      filePath: createPath([templateConfig.repositoryMapFilePath, 'dummy.md']),
      content: JSON.stringify('dummy'),
    });

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    const result = await cleanUpTemplate(templateConfig);

    expect({ ...result, allFiles }).toEqual({
      templateConfig,
      allFiles: ['./test/mockTemplate/repositoryMap.json'],
    });
  });
});
