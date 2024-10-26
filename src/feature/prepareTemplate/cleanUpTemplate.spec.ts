import { cleanUpTemplate } from './cleanUpTemplate';
import { getTestData } from '../__tests__/getTestData';
import {
  cleanUpProjectCatalog,
  cleanUpTemplateCatalog,
  FileToCreateType,
  setupTestFiles,
} from '../__tests__/prepareFileForTests';
import { ConfigTemplateType, RepositoryMapFileConfigType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createCatalog } from '@/util/createCatalog';
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
        redOnlyFileList: [],
      };

      await cleanUpTemplateCatalog('mock');
      await createCatalog(templateConfig.templateCatalogPath);

      const FileToCreate: FileToCreateType[] = [
        {
          filePath: templateConfig.repositoryMapFilePath,
          content: JSON.stringify(repositoryMapFileConfig),
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);
    });

    afterEach(async () => {
      await cleanUpTemplateCatalog('mock');
    });

    it('as a first time should use mock and default', async () => {
      const FileToCreate: FileToCreateType[] = [
        {
          filePath: createPath([templateConfig.projectCatalog, 'tools', 'test.sh']),
          options: { createFolder: true },
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      const dataToTest = await getTestData(templateConfig, cleanUpTemplate);

      expect({ ...dataToTest }).toStrictEqual({
        allFiles: [
          './mock/mockTemplate/.gitignore',
          './mock/mockTemplate/package.json',
          './mock/mockTemplate/templateCatalog/repositoryMap.json',
          './mock/mockTemplate/tools/test.sh',
          './mock/mockTemplate/tsconfig.json',
          './mock/mockTemplate/yarn.lock',
        ],
        repositoryMapFileConfigContent: {
          _: [],
          bumpVersion: true,
          fileMap: [],
          isDebug: false,
          projectCatalog: './',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './templateCatalog/repositoryMap.json',
          rootPathFileList: [],
          redOnlyFileList: [],
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          templateFileList: [],
          templateVersion: '1.0.0',
        },
        templateConfig: {
          ...templateConfig,
        },
      });
    });

    it(' return cleanup folder and use mock and default', async () => {
      const FileToCreate: FileToCreateType[] = [
        { filePath: createPath([templateConfig.projectCatalog, 'tools', 'test.sh']), options: { createFolder: true } },
        { filePath: createPath([templateConfig.projectCatalog, 'templateCatalog', '.gitignore-default.md']) },
        { filePath: createPath([templateConfig.projectCatalog, 'templateCatalog', 'package.json-default.md']) },
        {
          filePath: createPath([templateConfig.projectCatalog, 'templateCatalog', 'tools', 'test.sh-default.md']),
          options: { createFolder: true },
        },
        { filePath: createPath([templateConfig.projectCatalog, 'templateCatalog', 'tsconfig.json-default.md']) },
        { filePath: createPath([templateConfig.projectCatalog, 'templateCatalog', 'yarn.lock-default.md']) },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      const dataToTest = await getTestData(templateConfig, cleanUpTemplate);

      expect({ ...dataToTest }).toStrictEqual({
        allFiles: [
          './mock/mockTemplate/.gitignore',
          './mock/mockTemplate/package.json',
          './mock/mockTemplate/templateCatalog/repositoryMap.json',
          './mock/mockTemplate/tools/test.sh',
          './mock/mockTemplate/tsconfig.json',
          './mock/mockTemplate/yarn.lock',
        ],
        repositoryMapFileConfigContent: {
          _: [],
          bumpVersion: true,
          fileMap: [],
          isDebug: false,
          projectCatalog: './',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './templateCatalog/repositoryMap.json',
          rootPathFileList: [],
          redOnlyFileList: [],
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          templateFileList: [],
          templateVersion: '1.0.0',
        },
        templateConfig: {
          ...templateConfig,
        },
      });
    });
  });

  describe('context test', () => {
    let templateConfig: ConfigTemplateType;
    let repositoryMapFileConfig: RepositoryMapFileConfigType;
    beforeEach(async () => {
      templateConfig = { ...mockTemplateConfig.bumpVersion.templateConfig };
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

      const dataToTest = await getTestData(templateConfig, cleanUpTemplate);

      expect({ ...dataToTest }).toStrictEqual({
        templateConfig,
        repositoryMapFileConfigContent: {},
        allFiles: [],
      });
    });

    it('should do nothing when only template config file exists', async () => {
      const FileToCreate: FileToCreateType[] = [
        {
          filePath: templateConfig.repositoryMapFilePath,
          content: JSON.stringify(repositoryMapFileConfig),
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      const dataToTest = await getTestData(templateConfig, cleanUpTemplate);

      expect({ ...dataToTest }).toStrictEqual({
        templateConfig,
        repositoryMapFileConfigContent: {
          ...mockTemplateConfig.bumpVersion.repositoryMapFileConfig,
        },
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
      });
    });

    it('should keep only config file when template catalog exists', async () => {
      const FileToCreate: FileToCreateType[] = [
        {
          filePath: templateConfig.repositoryMapFilePath,
          content: JSON.stringify(repositoryMapFileConfig),
        },
        {
          filePath: templateConfig.templateCatalogPath,
          options: { createFolder: true },
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      const dataToTest = await getTestData(templateConfig, cleanUpTemplate);

      expect({ ...dataToTest }).toStrictEqual({
        templateConfig,
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
        repositoryMapFileConfigContent: {
          ...mockTemplateConfig.bumpVersion.repositoryMapFileConfig,
        },
      });
    });

    it('should clean up template catalog, leaving only config file', async () => {
      const FileToCreate: FileToCreateType[] = [
        {
          filePath: templateConfig.repositoryMapFilePath,
          content: JSON.stringify(repositoryMapFileConfig),
        },
        {
          filePath: createPath([templateConfig.repositoryMapFilePath, 'dummy.md']),
          content: JSON.stringify('dummy'),
          options: { createFolder: true },
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      const dataToTest = await getTestData(templateConfig, cleanUpTemplate);

      expect({ ...dataToTest }).toStrictEqual({
        templateConfig,
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
        repositoryMapFileConfigContent: {
          ...mockTemplateConfig.bumpVersion.repositoryMapFileConfig,
        },
      });
    });

    it('should keep only config file after file update', async () => {
      const templateConfig = mockTemplateConfig.prepareFileList;

      const FileToCreate: FileToCreateType[] = [
        {
          filePath: templateConfig.repositoryMapFilePath,
          content: JSON.stringify(repositoryMapFileConfig),
        },
        {
          filePath: templateConfig.templateCatalogPath,
          options: { createFolder: true },
        },
        { filePath: createPath([templateConfig.repositoryMapFilePath, 'dummy.md']), content: JSON.stringify('dummy') },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);
      const dataToTest = await getTestData(templateConfig, cleanUpTemplate);

      expect({ ...dataToTest }).toStrictEqual({
        templateConfig,
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
        repositoryMapFileConfigContent: {
          ...mockTemplateConfig.bumpVersion.repositoryMapFileConfig,
        },
      });
    });
  });
});
