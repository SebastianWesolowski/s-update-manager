import { prepareFileList } from './prepareFileList';
import { getTestData } from '../__tests__/getTestData';
import {
  cleanUpProjectCatalog,
  cleanUpTemplateCatalog,
  FileToCreateType,
  setupTestFiles,
} from '../__tests__/prepareFileForTests';
import { searchFilesInDirectory } from '../__tests__/searchFilesInDirectory';
import { ConfigTemplateType, RepositoryMapFileConfigType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';

describe('prepareFileList', () => {
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

      await cleanUpTemplateCatalog('mock');
      await createCatalog(templateConfig.templateCatalogPath);

      const FileToCreate: FileToCreateType[] = [
        {
          filePath: templateConfig.repositoryMapFilePath,
          content: JSON.stringify(repositoryMapFileConfig),
        },
        {
          filePath: createPath([templateConfig.projectCatalog, 'tools', 'test.sh']),
          options: { createFolder: true },
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);
    });

    afterEach(async () => {
      await cleanUpTemplateCatalog('mock');
    });
    it('should return mock file', async () => {
      const dataToTest = await getTestData(templateConfig, () =>
        prepareFileList({
          templateConfig,
          templateFileList: ['./.gitignore', './package.json', './tools/test.sh', './tsconfig.json', './yarn.lock'],
        })
      );

      expect({ ...dataToTest }).toStrictEqual({
        allFiles: [
          './mock/mockTemplate/.gitignore',
          './mock/mockTemplate/package.json',
          './mock/mockTemplate/templateCatalog/.gitignore-default.md',
          './mock/mockTemplate/templateCatalog/package.json-default.md',
          './mock/mockTemplate/templateCatalog/repositoryMap.json',
          './mock/mockTemplate/templateCatalog/tools/test.sh-default.md',
          './mock/mockTemplate/templateCatalog/tsconfig.json-default.md',
          './mock/mockTemplate/templateCatalog/yarn.lock-default.md',
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
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          templateFileList: [],
          templateVersion: '1.0.0',
        },
        fileList: [
          'templateCatalog/.gitignore-default.md',
          'templateCatalog/package.json-default.md',
          'templateCatalog/tools/test.sh-default.md',
          'templateCatalog/tsconfig.json-default.md',
          'templateCatalog/yarn.lock-default.md',
        ],
        rootPathFileList: [
          './mock/mockTemplate/.gitignore',
          './mock/mockTemplate/package.json',
          './mock/mockTemplate/tools/test.sh',
          './mock/mockTemplate/tsconfig.json',
          './mock/mockTemplate/yarn.lock',
        ],
        templateFileList: ['./.gitignore', './package.json', './tools/test.sh', './tsconfig.json', './yarn.lock'],
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
      templateConfig = { ...mockTemplateConfig.prepareFileList };
      repositoryMapFileConfig = { ...mockTemplateConfig.init.repositoryMapFileConfig };

      await cleanUpTemplateCatalog('test');
      await cleanUpProjectCatalog('test');
      await createCatalog(templateConfig.templateCatalogPath);

      await createFile({
        filePath: templateConfig.repositoryMapFilePath,
        content: JSON.stringify(repositoryMapFileConfig),
      });
      await createFile({
        filePath: createPath([templateConfig.projectCatalog, 'dummy.md']),
        content: JSON.stringify('dummy'),
      });
    });

    afterEach(async () => {
      await cleanUpTemplateCatalog('test');
      await cleanUpProjectCatalog('test');
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
        allFiles: ['./test/mockTemplate/dummy.md', './test/mockTemplate/templateCatalog/repositoryMap.json'],
        fileList: [],
        rootPathFileList: [],
      });
    });

    it('should return non empty arrays', async () => {
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
          './test/mockTemplate/templateCatalog/repositoryMap.json',
          './test/mockTemplate/templateCatalog/test/mockTemplate/dummy.md-default.md',
        ],
        fileList: ['templateCatalog/test/mockTemplate/dummy.md-default.md'],
        rootPathFileList: ['./test/mockTemplate/test/mockTemplate/dummy.md'],
      });
    });

    it('should return empty arrays', async () => {
      const pathToCreate = [
        createPath([templateConfig.projectCatalog, '.DS_Store']),
        createPath([templateConfig.projectCatalog, 'readme.md']),
        createPath([templateConfig.projectCatalog, 'abc/index.ts']),
        createPath([templateConfig.projectCatalog, 'templateCatalog/readme.md-default.md']),
        createPath([templateConfig.projectCatalog, 'templateCatalog/abc/index.ts-default.md']),
        createPath([templateConfig.projectCatalog, 'node_modules/.bin/acorn']),
        createPath([templateConfig.projectCatalog, 'node_modules/.bin/cdl']),
        createPath([templateConfig.projectCatalog, 'node_modules/.bin/ejs']),
        createPath([templateConfig.projectCatalog, 'node_modules/@babel/index.js']),
        createPath([templateConfig.projectCatalog, 'test/index.spec.ts']),
      ];

      for (const file of pathToCreate) {
        await createFile({
          filePath: file,
          content: 'file path = ' + file,
        });
      }

      await createFile({
        filePath: createPath([templateConfig.projectCatalog, '.gitignore']),
        content: 'node_modules/\ntest/',
      });

      const allFiles = await searchFilesInDirectory({
        directoryPath: templateConfig.projectCatalog,
        excludedFileNames: ['.DS_Store'],
        excludedPhrases: ['.backup'],
      });

      const result = await prepareFileList({
        templateConfig,
        templateFileList: ['./.gitignore', './abc/index.ts', './dummy.md', './readme.md'],
      });

      expect({ ...result, allFiles }).toEqual({
        templateConfig: mockTemplateConfig.prepareFileList,
        templateFileList: ['./.gitignore', './abc/index.ts', './dummy.md', './readme.md'],
        allFiles: [
          './test/mockTemplate/.gitignore',
          './test/mockTemplate/abc/index.ts',
          './test/mockTemplate/dummy.md',
          './test/mockTemplate/node_modules/.bin/acorn',
          './test/mockTemplate/node_modules/.bin/cdl',
          './test/mockTemplate/node_modules/.bin/ejs',
          './test/mockTemplate/node_modules/@babel/index.js',
          './test/mockTemplate/readme.md',
          './test/mockTemplate/templateCatalog/abc/index.ts-default.md',
          './test/mockTemplate/templateCatalog/readme.md-default.md',
          './test/mockTemplate/templateCatalog/repositoryMap.json',
          './test/mockTemplate/test/index.spec.ts',
        ],
        fileList: [
          'templateCatalog/.gitignore-default.md',
          'templateCatalog/abc/index.ts-default.md',
          'templateCatalog/dummy.md-default.md',
          'templateCatalog/readme.md-default.md',
        ],
        rootPathFileList: [
          './test/mockTemplate/.gitignore',
          './test/mockTemplate/abc/index.ts',
          './test/mockTemplate/dummy.md',
          './test/mockTemplate/readme.md',
        ],
      });
    });
  });
});
