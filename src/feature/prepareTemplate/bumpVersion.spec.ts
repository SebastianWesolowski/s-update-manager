import { bumpVersion } from './bumpVersion';
import { cleanUpSinglePath } from '../__tests__/cleanForTests';
import { getTestData } from '../__tests__/getTestData';
import {
  cleanUpProjectCatalog,
  cleanUpTemplateCatalog,
  FileToCreate,
  setupTestFiles,
} from '../__tests__/prepareFileForTests';
import { ConfigTemplateType, RepositoryMapFileConfigType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createCatalog } from '@/util/createCatalog';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';

describe('bumpVersion', () => {
  describe('context mock', () => {
    let templateConfig: ConfigTemplateType;
    let repositoryMapFileConfig: RepositoryMapFileConfigType;

    beforeEach(async () => {
      templateConfig = {
        projectCatalog: './',
        templateCatalogName: 'templateCatalog',
        templateCatalogPath: './templateCatalog',
        repositoryMapFileName: 'repositoryMap.json',
        repositoryMapFilePath: './templateCatalog/repositoryMap.json',
        bumpVersion: true,
        isDebug: false,
        _: [],
      };

      // set as mock:
      templateConfig = {
        ...templateConfig,
        projectCatalog: './mock/mockTemplate',
        templateCatalogPath: './mock/mockTemplate/templateCatalog',
        repositoryMapFilePath: './mock/mockTemplate/templateCatalog/repositoryMap.json',
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

      const FileToCreate: FileToCreate[] = [
        {
          filePath: templateConfig.repositoryMapFilePath,
          content: JSON.stringify(templateConfig),
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);
    });

    afterEach(async () => {
      await cleanUpTemplateCatalog('mock');
    });

    it('as a first time should use mock and default', async () => {
      const FileToCreate: FileToCreate[] = [
        {
          filePath: createPath([templateConfig.projectCatalog, 'tools', 'test.sh']),
          options: { createFolder: true },
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      templateConfig.bumpVersion = false;

      const dataToTest = await getTestData(templateConfig, bumpVersion);

      expect({ ...dataToTest }).toStrictEqual({
        templateConfig: {
          ...templateConfig,
          bumpVersion: true,
          templateVersion: '1.0.0',
        },
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
          projectCatalog: './mock/mockTemplate',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './mock/mockTemplate/templateCatalog/repositoryMap.json',
          rootPathFileList: [],
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './mock/mockTemplate/templateCatalog',
          templateFileList: [],
          templateVersion: '1.0.0',
        },
      });
    });

    it('should set bump becouse depends exist file', async () => {
      const FileToCreate: FileToCreate[] = [
        {
          filePath: createPath([templateConfig.projectCatalog, 'tools', 'test.sh']),
          options: { createFolder: true },
        },
        { filePath: createPath([templateConfig.projectCatalog, 'tools', 'test-new.sh']) },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      templateConfig.bumpVersion = true;
      repositoryMapFileConfig = {
        projectCatalog: './mock/mockTemplate',
        templateCatalogName: 'templateCatalog',
        templateCatalogPath: './mock/mockTemplate/templateCatalog',
        repositoryMapFileName: 'repositoryMap.json',
        repositoryMapFilePath: './mock/mockTemplate/templateCatalog/repositoryMap.json',
        bumpVersion: true,
        isDebug: false,
        _: [],
        templateVersion: '1.0.1',
        fileMap: [],
        templateFileList: [],
        rootPathFileList: [],
      };

      const dataToTest = await getTestData(templateConfig, bumpVersion);

      expect({ ...dataToTest }).toStrictEqual({
        templateConfig: {
          ...templateConfig,
          bumpVersion: true,
          templateVersion: '1.0.1',
        },
        allFiles: [
          './mock/mockTemplate/.gitignore',
          './mock/mockTemplate/package.json',
          './mock/mockTemplate/templateCatalog/repositoryMap.json',
          './mock/mockTemplate/tools/test-new.sh',
          './mock/mockTemplate/tools/test.sh',
          './mock/mockTemplate/tsconfig.json',
          './mock/mockTemplate/yarn.lock',
        ],
        repositoryMapFileConfigContent: {
          _: [],
          bumpVersion: true,
          fileMap: [],
          isDebug: false,
          projectCatalog: './mock/mockTemplate',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './mock/mockTemplate/templateCatalog/repositoryMap.json',
          rootPathFileList: [],
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './mock/mockTemplate/templateCatalog',
          templateFileList: [],
          templateVersion: '1.0.1',
        },
      });
    });
  });

  describe('context test', () => {
    let templateConfig: ConfigTemplateType;
    let repositoryMapFileConfig: RepositoryMapFileConfigType;
    beforeEach(async () => {
      templateConfig = { ...mockTemplateConfig.init.templateConfig };
      repositoryMapFileConfig = { ...mockTemplateConfig.init.repositoryMapFileConfig };

      await cleanUpTemplateCatalog('test');
      await cleanUpProjectCatalog('test');

      const FileToCreate: FileToCreate[] = [
        {
          filePath: templateConfig.repositoryMapFilePath,
          content: JSON.stringify(templateConfig),
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);
    });

    afterEach(async () => {
      await cleanUpTemplateCatalog('test');
      await cleanUpProjectCatalog('test');
    });

    it('should correctly bump version - without config file and templateVersion', async () => {
      await deletePath(templateConfig.repositoryMapFilePath, templateConfig.isDebug);

      const expectTemplateConfig = { ...mockTemplateConfig.bumpVersion };
      delete expectTemplateConfig.templateVersion;

      const dataToTest = await getTestData(templateConfig, bumpVersion);
      expect({ ...dataToTest }).toStrictEqual({
        templateConfig: {
          ...expectTemplateConfig,
        },
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
        repositoryMapFileConfigContent: {
          _: [],
          bumpVersion: true,
          fileMap: [],
          isDebug: false,
          projectCatalog: './test/mockTemplate/',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './test/mockTemplate/templateCatalog/repositoryMap.json',
          rootPathFileList: [],
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './test/mockTemplate/templateCatalog',
          templateFileList: [],
          templateVersion: '1.0.0',
        },
      });
    });

    it('should correctly bump version - without config file, with existing templateVersion', async () => {
      templateConfig.templateVersion = '1.0.0';
      await deletePath(templateConfig.repositoryMapFilePath, templateConfig.isDebug);

      const dataToTest = await getTestData(templateConfig, bumpVersion);
      expect({ ...dataToTest }).toStrictEqual({
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
        templateConfig: {
          ...mockTemplateConfig.bumpVersion,
        },
        repositoryMapFileConfigContent: {
          _: [],
          bumpVersion: true,
          fileMap: [],
          isDebug: false,
          projectCatalog: './test/mockTemplate/',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './test/mockTemplate/templateCatalog/repositoryMap.json',
          rootPathFileList: [],
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './test/mockTemplate/templateCatalog',
          templateFileList: [],
          templateVersion: '1.0.0',
        },
      });
    });

    it('should correctly bump version - with config file', async () => {
      templateConfig.templateVersion = '1.0.0';

      const FileToCreate: FileToCreate[] = [
        {
          filePath: templateConfig.repositoryMapFilePath,
          content: JSON.stringify(templateConfig),
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      const dataToTest = await getTestData(templateConfig, bumpVersion);
      expect({ ...dataToTest }).toStrictEqual({
        templateConfig: {
          ...mockTemplateConfig.bumpVersion,
          templateVersion: '1.0.1',
        },
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
        repositoryMapFileConfigContent: {
          _: [],
          bumpVersion: true,
          fileMap: [],
          isDebug: false,
          projectCatalog: './test/mockTemplate/',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './test/mockTemplate/templateCatalog/repositoryMap.json',
          rootPathFileList: [],
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './test/mockTemplate/templateCatalog',
          templateFileList: [],
          templateVersion: '1.0.1',
        },
      });
    });

    it('should not bump version when bumpVersion is set to false', async () => {
      templateConfig.templateVersion = '1.0.0';
      templateConfig.bumpVersion = false;

      const FileToCreate: FileToCreate[] = [
        {
          filePath: templateConfig.repositoryMapFilePath,
          content: JSON.stringify(templateConfig),
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      const dataToTest = await getTestData(templateConfig, bumpVersion);
      expect({ ...dataToTest }).toStrictEqual({
        templateConfig: {
          ...mockTemplateConfig.bumpVersion,
          bumpVersion: true,
        },
        allFiles: ['./test/mockTemplate/templateCatalog/repositoryMap.json'],
        repositoryMapFileConfigContent: {
          _: [],
          bumpVersion: false,
          fileMap: [],
          isDebug: false,
          projectCatalog: './test/mockTemplate/',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './test/mockTemplate/templateCatalog/repositoryMap.json',
          rootPathFileList: [],
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './test/mockTemplate/templateCatalog',
          templateFileList: [],
          templateVersion: '1.0.0',
        },
      });
    });
  });
});
