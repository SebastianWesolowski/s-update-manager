import { cleanUpTemplate } from './cleanUpTemplate';
import { cleanUpSinglePath } from '../__tests__/cleanForTests';
import { cleanUpProjectCatalog, cleanUpTemplateCatalog } from '../__tests__/prepareFileForTests';
import { searchFilesInDirectory } from '../__tests__/searchFilesInDirectory';
import { ConfigTemplateType, RepositoryMapFileConfigType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';

describe('cleanUpTemplate', () => {
  describe('context mock', () => {
    let templateConfig: ConfigTemplateType;
    let repositoryMapFileConfig: RepositoryMapFileConfigType;

    beforeEach(async () => {
      templateConfig = {
        projectCatalog: './mock/mockTemplate',
        templateCatalogName: 'templateCatalog',
        templateCatalogPath: './mock/mockTemplate/templateCatalog',
        repositoryMapFileName: 'repositoryMap.json',
        repositoryMapFilePath: './mock/mockTemplate/templateCatalog/repositoryMap.json',
        bumpVersion: true,
        isDebug: true,
        _: [],
        templateVersion: '1.0.0',
      };

      repositoryMapFileConfig = {
        projectCatalog: './',
        templateCatalogName: 'templateCatalog',
        templateCatalogPath: './templateCatalog',
        repositoryMapFileName: 'repositoryMap.json',
        repositoryMapFilePath: './templateCatalog/repositoryMap.json',
        bumpVersion: true,
        isDebug: false,
        _: [],
        templateVersion: '1.0.0',
        fileMap: [],
        templateFileList: [],
        rootPathFileList: [],
      };

      await cleanUpSinglePath({
        path: createPath([templateConfig.projectCatalog, 'tools']),
        isDebug: templateConfig.isDebug,
      });
      await cleanUpTemplateCatalog('mock');
      await createCatalog(templateConfig.templateCatalogPath);
      await createFile({
        filePath: templateConfig.repositoryMapFilePath,
        content: JSON.stringify(templateConfig),
      });
    });
    it('a', async () => {
      expect(1).toEqual(1);
    });
  });

  describe('context test', () => {
    let templateConfig: ConfigTemplateType;
    let repositoryMapFileConfig: RepositoryMapFileConfigType;
    beforeEach(async () => {
      templateConfig = { ...mockTemplateConfig.bumpVersion };
      repositoryMapFileConfig = { ...mockTemplateConfig.init.repositoryMapFileConfig };

      await cleanUpTemplateCatalog('test');
      await cleanUpProjectCatalog('test');
    });

    afterEach(async () => {
      await cleanUpTemplateCatalog('test');
      await cleanUpProjectCatalog('test');
    });

    it('should do nothing when directory is empty', async () => {
      await createCatalog(templateConfig.projectCatalog);

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
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
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
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
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
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
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
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
      });
    });
  });
});
