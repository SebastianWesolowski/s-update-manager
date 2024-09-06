import { bumpVersion } from './bumpVersion';
import { cleanUpFiles } from '../__tests__/cleanForTests';
import { searchFilesInDirectory } from '../__tests__/searchFilesInDirectory';
import { ConfigTemplateType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createFile } from '@/util/createFile';

describe('bumpVersion', () => {
  let templateConfig: ConfigTemplateType;
  beforeEach(async () => {
    templateConfig = { ...mockTemplateConfig.init };

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

  it('should correctly bump version - without config file and templateVersion', async () => {
    const result = await bumpVersion(templateConfig);
    const expectTemplateConfig = { ...mockTemplateConfig.bumpVersion };
    delete expectTemplateConfig.templateVersion;

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      templateConfig: expectTemplateConfig,
      allFiles: ['./test/mockTemplate/repositoryMap.json'],
    });
  });

  it('should correctly bump version - without config file, with existing templateVersion', async () => {
    templateConfig.templateVersion = '1.0.0';

    const result = await bumpVersion(templateConfig);

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      allFiles: ['./test/mockTemplate/repositoryMap.json'],
      templateConfig: { ...mockTemplateConfig.bumpVersion },
    });
  });

  it('should correctly bump version - with config file', async () => {
    templateConfig.templateVersion = '1.0.0';

    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(templateConfig),
    });

    const result = await bumpVersion(templateConfig);

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      templateConfig: { ...mockTemplateConfig.bumpVersion, templateVersion: '1.0.1' },
      allFiles: ['./test/mockTemplate/repositoryMap.json'],
    });
  });

  it('should not bump version when bumpVersion is set to false', async () => {
    templateConfig.templateVersion = '1.0.0';
    templateConfig.bumpVersion = false;

    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(templateConfig),
    });

    const result = await bumpVersion(templateConfig);

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      templateConfig: { ...mockTemplateConfig.bumpVersion, bumpVersion: false },
      allFiles: ['./test/mockTemplate/repositoryMap.json'],
    });
  });
});
