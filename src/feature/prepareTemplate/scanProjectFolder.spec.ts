import { scanProjectFolder } from './scanProjectFolder';
import { getTestData } from '../__tests__/getTestData';
import { cleanUpTemplateCatalog, FileToCreateType, setupTestFiles } from '../__tests__/prepareFileForTests';
import { searchFilesInDirectory } from '../__tests__/searchFilesInDirectory';
import { ConfigTemplateType, RepositoryMapFileConfigType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';
import { readFile } from '@/util/readFile';

describe('scanProjectFolder', () => {
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
      const dataToTest = await getTestData(templateConfig, scanProjectFolder);

      expect({ ...dataToTest }).toStrictEqual({
        allFiles: [
          './mock/mockTemplate/.gitignore',
          './mock/mockTemplate/package.json',
          './mock/mockTemplate/templateCatalog/repositoryMap.json',
          './mock/mockTemplate/tools/test.sh',
          './mock/mockTemplate/tsconfig.json',
          './mock/mockTemplate/yarn.lock',
        ],
        templateFileList: ['./.gitignore', './package.json', './tsconfig.json', './yarn.lock'],
        repositoryMapFileConfigContent: {
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
        },
        templateConfig: {
          ...templateConfig,
        },
      });
    });

    it('should return mock use .gitignore file and return without node_modules', async () => {
      const FileToCreate: FileToCreateType[] = [
        {
          filePath: createPath([templateConfig.projectCatalog, 'node_modules/.bin/acorn']),
        },
        {
          filePath: createPath([templateConfig.projectCatalog, 'node_modules/.bin/cdl']),
        },
        {
          filePath: createPath([templateConfig.projectCatalog, 'node_modules/.bin/ejs']),
        },
        {
          filePath: createPath([templateConfig.projectCatalog, 'node_modules/@babel/index.js']),
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      const dataToTest = await getTestData(templateConfig, scanProjectFolder);

      expect({ ...dataToTest }).toStrictEqual({
        allFiles: [
          './mock/mockTemplate/.gitignore',
          './mock/mockTemplate/node_modules/.bin/acorn',
          './mock/mockTemplate/node_modules/.bin/cdl',
          './mock/mockTemplate/node_modules/.bin/ejs',
          './mock/mockTemplate/node_modules/@babel/index.js',
          './mock/mockTemplate/package.json',
          './mock/mockTemplate/templateCatalog/repositoryMap.json',
          './mock/mockTemplate/tools/test.sh',
          './mock/mockTemplate/tsconfig.json',
          './mock/mockTemplate/yarn.lock',
        ],
        templateFileList: ['./.gitignore', './package.json', './tsconfig.json', './yarn.lock'],
        repositoryMapFileConfigContent: {
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
        },
        templateConfig: {
          ...templateConfig,
        },
      });
      await deletePath(createPath([templateConfig.projectCatalog, 'node_modules']), templateConfig.isDebug);
    });

    it('should return mock use .gitignore file and return without node_modules and tools', async () => {
      const gitignoreContent = await readFile(
        createPath([templateConfig.projectCatalog, '.gitignore']),
        templateConfig.isDebug
      ).then((data) => data.toString());
      const extendGitignoreContent = `${gitignoreContent}\ntools/`;

      await deletePath(createPath([templateConfig.projectCatalog, '.gitignore']), templateConfig.isDebug);

      const FileToCreate: FileToCreateType[] = [
        {
          filePath: createPath([templateConfig.projectCatalog, 'node_modules/.bin/acorn']),
        },
        {
          filePath: createPath([templateConfig.projectCatalog, 'node_modules/.bin/cdl']),
        },
        {
          filePath: createPath([templateConfig.projectCatalog, 'node_modules/.bin/ejs']),
        },
        {
          filePath: createPath([templateConfig.projectCatalog, 'node_modules/@babel/index.js']),
        },
        {
          filePath: createPath([templateConfig.projectCatalog, '.gitignore']),
          content: extendGitignoreContent,
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      const dataToTest = await getTestData(templateConfig, scanProjectFolder);

      expect({ ...dataToTest }).toStrictEqual({
        allFiles: [
          './mock/mockTemplate/.gitignore',
          './mock/mockTemplate/node_modules/.bin/acorn',
          './mock/mockTemplate/node_modules/.bin/cdl',
          './mock/mockTemplate/node_modules/.bin/ejs',
          './mock/mockTemplate/node_modules/@babel/index.js',
          './mock/mockTemplate/package.json',
          './mock/mockTemplate/templateCatalog/repositoryMap.json',
          './mock/mockTemplate/tools/test.sh',
          './mock/mockTemplate/tsconfig.json',
          './mock/mockTemplate/yarn.lock',
        ],
        templateFileList: ['./.gitignore', './package.json', './tsconfig.json', './yarn.lock'],
        repositoryMapFileConfigContent: {
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
        },
        templateConfig: {
          ...templateConfig,
        },
      });

      const restoreGitignore: FileToCreateType[] = [
        {
          filePath: createPath([templateConfig.projectCatalog, '.gitignore']),
          content: `${gitignoreContent}`,
        },
      ];
      await setupTestFiles(restoreGitignore, templateConfig.isDebug);
      await deletePath(createPath([templateConfig.projectCatalog, 'node_modules']), templateConfig.isDebug);
    });

    //TODO [SC-80] advanced gitignore Rule
  });

  describe('context test', () => {
    let templateConfig: ConfigTemplateType;
    let repositoryMapFileConfig: RepositoryMapFileConfigType;

    beforeEach(async () => {
      templateConfig = { ...mockTemplateConfig.cleanUpTemplate };
      repositoryMapFileConfig = { ...mockTemplateConfig.init.repositoryMapFileConfig };

      await cleanUpTemplateCatalog('test');

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
    });
    it('should return dummy file', async () => {
      const allFiles = await searchFilesInDirectory({
        directoryPath: templateConfig.projectCatalog,
        excludedFileNames: ['.DS_Store'],
        excludedPhrases: ['.backup'],
      });

      const result = await scanProjectFolder(templateConfig);

      expect({ ...result, allFiles }).toEqual({
        templateConfig: mockTemplateConfig.scanProjectFolder,
        templateFileList: ['./dummy.md'],
        allFiles: ['./test/mockTemplate/dummy.md', './test/mockTemplate/templateCatalog/repositoryMap.json'],
      });
    });

    it('should return folder structure', async () => {
      const pathToCreate = [
        createPath([templateConfig.projectCatalog, '.DS_Store']),
        createPath([templateConfig.projectCatalog, 'readme.md']),
        createPath([templateConfig.projectCatalog, 'abc/index.ts']),
        createPath([templateConfig.projectCatalog, 'templateCatalog/readme.md-default.md']),
        createPath([templateConfig.projectCatalog, 'templateCatalog/abc/index.ts-default.md']),
      ];

      for (const file of pathToCreate) {
        await createFile({
          filePath: file,
          content: 'file path = ' + file,
        });
      }

      const allFiles = await searchFilesInDirectory({
        directoryPath: templateConfig.projectCatalog,
        excludedFileNames: ['.DS_Store'],
        excludedPhrases: ['.backup'],
      });

      const result = await scanProjectFolder(templateConfig);

      expect({ ...result, allFiles }).toEqual({
        templateConfig: mockTemplateConfig.scanProjectFolder,
        templateFileList: ['./abc/index.ts', './dummy.md', './readme.md'],
        allFiles: [
          './test/mockTemplate/abc/index.ts',
          './test/mockTemplate/dummy.md',
          './test/mockTemplate/readme.md',
          './test/mockTemplate/templateCatalog/abc/index.ts-default.md',
          './test/mockTemplate/templateCatalog/readme.md-default.md',
          './test/mockTemplate/templateCatalog/repositoryMap.json',
        ],
      });
    });

    it('should respect gitignore', async () => {
      const pathToCreate = [
        createPath([templateConfig.projectCatalog, '.DS_Store']),
        createPath([templateConfig.projectCatalog, 'readme.md']),
        createPath([templateConfig.projectCatalog, 'abc/index.ts']),
        createPath([templateConfig.projectCatalog, 'abc/test.ts']),
        createPath([templateConfig.projectCatalog, 'abc/new/index.ts']),
        createPath([templateConfig.projectCatalog, 'templateCatalog/readme.md-default.md']),
        createPath([templateConfig.projectCatalog, 'templateCatalog/abc/index.ts-default.md']),
        createPath([templateConfig.projectCatalog, 'templateCatalog/abc/test.ts-default.md']),
        createPath([templateConfig.projectCatalog, 'templateCatalog/abc/new/index.ts-default.md']),
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
        content: 'node_modules/\ntest/\nabc/**/*',
      });

      const allFiles = await searchFilesInDirectory({
        directoryPath: templateConfig.projectCatalog,
        excludedFileNames: ['.DS_Store'],
        excludedPhrases: ['.backup'],
      });

      const result = await scanProjectFolder(templateConfig);

      expect({ ...result, allFiles }).toEqual({
        templateConfig: mockTemplateConfig.scanProjectFolder,
        templateFileList: [
          './.gitignore',
          './abc/index.ts',
          './abc/new/index.ts',
          './abc/test.ts',
          './dummy.md',
          './readme.md',
        ],
        allFiles: [
          './test/mockTemplate/.gitignore',
          './test/mockTemplate/abc/index.ts',
          './test/mockTemplate/abc/new/index.ts',
          './test/mockTemplate/abc/test.ts',
          './test/mockTemplate/dummy.md',
          './test/mockTemplate/node_modules/.bin/acorn',
          './test/mockTemplate/node_modules/.bin/cdl',
          './test/mockTemplate/node_modules/.bin/ejs',
          './test/mockTemplate/node_modules/@babel/index.js',
          './test/mockTemplate/readme.md',
          './test/mockTemplate/templateCatalog/abc/index.ts-default.md',
          './test/mockTemplate/templateCatalog/abc/new/index.ts-default.md',
          './test/mockTemplate/templateCatalog/abc/test.ts-default.md',
          './test/mockTemplate/templateCatalog/readme.md-default.md',
          './test/mockTemplate/templateCatalog/repositoryMap.json',
          './test/mockTemplate/test/index.spec.ts',
        ],
      });
    });
  });
});
