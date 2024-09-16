import { bumpVersion } from './bumpVersion';
import { cleanUpSinglePath } from '../__tests__/cleanForTests';
import { searchFilesInDirectory } from '../__tests__/searchFilesInDirectory';
import { ConfigTemplateType, RepositoryMapFileConfigType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';

describe('bumpVersion - context mock', () => {
  let templateConfig: ConfigTemplateType;
  let repositoryMapFileConfig: RepositoryMapFileConfigType;

  beforeEach(async () => {
    templateConfig = {
      projectCatalog: './mock/mockTemplate',
      templateCatalogName: 'templateCatalog',
      templateCatalogPath: './mock/mockTemplate/templateCatalog',
      repositoryMapFileName: 'repositoryMap.json',
      repositoryMapFilePath: './mock/mockTemplate/templateCatalog/repositoryMap.json',
      bumpVersion: false,
      isDebug: true,
      _: [],
    };
    repositoryMapFileConfig = {
      projectCatalog: './',
      templateCatalogName: 'templateCatalog',
      templateCatalogPath: './templateCatalog',
      repositoryMapFileName: 'repositoryMap.json',
      repositoryMapFilePath: './repositoryMap.json',
      bumpVersion: true,
      isDebug: false,
      _: [],
      templateVersion: '1.0.0',
      fileMap: [],
      templateFileList: [],
      rootPathFileList: [],
    };
    await cleanUpSinglePath({
      path: templateConfig.templateCatalogPath,
      isDebug: templateConfig.isDebug,
    });

    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(templateConfig),
    });
  });

  afterEach(async () => {
    await cleanUpSinglePath({
      path: templateConfig.templateCatalogPath,
      isDebug: templateConfig.isDebug,
    });
  });

  it('should use mock', async () => {
    await createFile({
      filePath: createPath([templateConfig.projectCatalog, 'tools', 'test.sh']),
      options: {
        createFolder: true,
      },
      content: 'lorem ipsum dolor sit amet, consectetur adipis',
    });

    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(repositoryMapFileConfig),
    });

    const result = await bumpVersion(templateConfig);

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      templateConfig: { ...templateConfig, bumpVersion: false },
      allFiles: [
        './mock/mockTemplate/.gitignore',
        './mock/mockTemplate/package.json',
        './mock/mockTemplate/templateCatalog/repositoryMap.json',
        './mock/mockTemplate/tools/test.sh',
        './mock/mockTemplate/tsconfig.json',
        './mock/mockTemplate/yarn.lock',
      ],
    });
  });
});

describe('bumpVersion - context test', () => {
  let templateConfig: ConfigTemplateType;
  let repositoryMapFileConfig: ConfigTemplateType;
  beforeEach(async () => {
    templateConfig = { ...mockTemplateConfig.init.templateConfig };
    repositoryMapFileConfig = { ...mockTemplateConfig.init.repositoryMapFileConfig };

    await cleanUpSinglePath({
      path: templateConfig.templateCatalogPath,
      isDebug: templateConfig.isDebug,
    });

    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(repositoryMapFileConfig),
    });
  });

  afterEach(async () => {
    await cleanUpSinglePath({
      path: templateConfig.templateCatalogPath,
      isDebug: templateConfig.isDebug,
    });
  });

  it('should correctly bump version - without config file and templateVersion', async () => {
    await deletePath(templateConfig.repositoryMapFilePath, templateConfig.isDebug);

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
      allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
    });
  });

  it('should correctly bump version - without config file, with existing templateVersion', async () => {
    templateConfig.templateVersion = '1.0.0';
    await deletePath(templateConfig.repositoryMapFilePath, templateConfig.isDebug);
    const result = await bumpVersion(templateConfig);

    const allFiles = await searchFilesInDirectory({
      directoryPath: templateConfig.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    expect({ ...result, allFiles }).toStrictEqual({
      allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
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
      allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
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
      allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
    });
  });
});
