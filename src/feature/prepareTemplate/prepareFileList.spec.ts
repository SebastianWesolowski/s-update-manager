import { prepareFileList } from './prepareFileList';
import { cleanUpFiles } from '../__tests__/cleanForTests';
import { searchFilesInDirectory } from '../__tests__/searchFilesInDirectory';
import { ConfigTemplateType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';

describe('prepareFileList', () => {
  let templateConfig: ConfigTemplateType;

  beforeEach(async () => {
    templateConfig = { ...mockTemplateConfig.prepareFileList };

    await cleanUpFiles({
      snpCatalog: templateConfig.templateCatalogPath,
      directoryPath: templateConfig.projectCatalog,
      isDebug: templateConfig.isDebug,
    });
    await createCatalog(templateConfig.templateCatalogPath);

    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(templateConfig),
    });
    await createFile({
      filePath: createPath([templateConfig.projectCatalog, 'dummy.md']),
      content: JSON.stringify('dummy'),
    });
  });

  afterEach(async () => {
    await cleanUpFiles({
      snpCatalog: templateConfig.templateCatalogPath,
      directoryPath: templateConfig.projectCatalog,
      isDebug: templateConfig.isDebug,
    });
  });

  it('should return empty arrays', async () => {
    const result = await prepareFileList({ templateConfig, templateFileList: [] });

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toEqual({
      templateConfig: mockTemplateConfig.prepareFileList,
      templateFileList: [],
      allFiles: ['./test/mockTemplate/dummy.md', './test/mockTemplate/repositoryMap.json'],
      fileList: [],
      rootPathFileList: [],
    });
  });

  it('should return empty arrays', async () => {
    const result = await prepareFileList({ templateConfig, templateFileList: ['test/mockTemplate/dummy.md'] });

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toEqual({
      templateConfig: mockTemplateConfig.prepareFileList,
      templateFileList: ['test/mockTemplate/dummy.md'],
      allFiles: [
        './test/mockTemplate/dummy.md',
        './test/mockTemplate/repositoryMap.json',
        './test/mockTemplate/templateCatalog/test/mockTemplate/dummy.md-default.md',
      ],
      fileList: ['templateCatalog/test/mockTemplate/dummy.md-default.md'],
      rootPathFileList: ['./test/mockTemplate/test/mockTemplate/dummy.md'],
    });
  });
});
