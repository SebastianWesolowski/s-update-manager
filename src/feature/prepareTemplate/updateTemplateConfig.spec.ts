import { updateTemplateConfig } from './updateTemplateConfig';
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
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

describe('updateTemplateConfig', () => {
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
        {
          filePath: createPath([templateConfig.templateCatalogPath, '.gitignore-default.md']),
        },
        {
          filePath: createPath([templateConfig.templateCatalogPath, 'package.json-default.md']),
        },
        {
          filePath: createPath([templateConfig.templateCatalogPath, 'repositoryMap.json']),
        },
        {
          filePath: createPath([templateConfig.templateCatalogPath, 'tools', 'test.sh-default.md']),
          options: { createFolder: true },
        },
        {
          filePath: createPath([templateConfig.templateCatalogPath, 'tsconfig.json-default.md']),
        },
        {
          filePath: createPath([templateConfig.templateCatalogPath, 'yarn.lock-default.md']),
        },
      ];
      await setupTestFiles(FileToCreate, templateConfig.isDebug);
    });

    afterEach(async () => {
      await cleanUpTemplateCatalog('mock');
    });

    it('should return mock file', async () => {
      const fileList = [
        'templateCatalog/.gitignore-default.md',
        'templateCatalog/package.json-default.md',
        'templateCatalog/tools/test.sh-default.md',
        'templateCatalog/tsconfig.json-default.md',
        'templateCatalog/yarn.lock-default.md',
      ];
      const rootPathFileList = [
        './mock/mockTemplate/.gitignore',
        './mock/mockTemplate/package.json',
        './mock/mockTemplate/tools/test.sh',
        './mock/mockTemplate/tsconfig.json',
        './mock/mockTemplate/yarn.lock',
      ];
      const redOnlyFileList = [];

      const templateFileList = ['./.gitignore', './package.json', './tools/test.sh', './tsconfig.json', './yarn.lock'];

      const dataToTest = await getTestData(templateConfig, () =>
        updateTemplateConfig({ templateConfig, fileList, templateFileList, rootPathFileList, redOnlyFileList })
      );

      expect({ ...dataToTest }).toStrictEqual({
        newContent: {
          fileMap: [
            'templateCatalog/.gitignore-default.md',
            'templateCatalog/package.json-default.md',
            'templateCatalog/tools/test.sh-default.md',
            'templateCatalog/tsconfig.json-default.md',
            'templateCatalog/yarn.lock-default.md',
          ],
          redOnlyFileList: [],
          rootPathFileList: [
            './mock/mockTemplate/.gitignore',
            './mock/mockTemplate/package.json',
            './mock/mockTemplate/tools/test.sh',
            './mock/mockTemplate/tsconfig.json',
            './mock/mockTemplate/yarn.lock',
          ],
          templateFileList: ['./.gitignore', './package.json', './tools/test.sh', './tsconfig.json', './yarn.lock'],
        },
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
        templateConfig: {
          ...templateConfig,
        },
        repositoryMapFileConfigContent: {
          fileMap: [
            'templateCatalog/.gitignore-default.md',
            'templateCatalog/package.json-default.md',
            'templateCatalog/tools/test.sh-default.md',
            'templateCatalog/tsconfig.json-default.md',
            'templateCatalog/yarn.lock-default.md',
          ],
          redOnlyFileList: [],
          rootPathFileList: [
            './mock/mockTemplate/.gitignore',
            './mock/mockTemplate/package.json',
            './mock/mockTemplate/tools/test.sh',
            './mock/mockTemplate/tsconfig.json',
            './mock/mockTemplate/yarn.lock',
          ],
          templateFileList: ['./.gitignore', './package.json', './tools/test.sh', './tsconfig.json', './yarn.lock'],
        },
      });
    });
  });

  describe('context test', () => {
    let templateConfig: ConfigTemplateType;
    beforeEach(async () => {
      templateConfig = { ...mockTemplateConfig.scanProjectFolder };

      await cleanUpTemplateCatalog('test');
      await cleanUpProjectCatalog('test');

      await createCatalog(templateConfig.templateCatalogPath);

      await createFile({
        filePath: templateConfig.repositoryMapFilePath,
        content: JSON.stringify(templateConfig),
      });

      const pathToCreate = [
        createPath([templateConfig.projectCatalog, 'dummy.md']),
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
    });

    afterEach(async () => {
      await cleanUpTemplateCatalog('test');
      await cleanUpProjectCatalog('test');
    });

    it('should update template config correctly', async () => {
      const templateFileList = ['./.gitignore', './abc/index.ts', './dummy.md', './readme.md'];
      const rootPathFileList = [
        './test/mockTemplate/.gitignore',
        './test/mockTemplate/abc/index.ts',
        './test/mockTemplate/dummy.md',
        './test/mockTemplate/readme.md',
      ];
      const fileList = [
        'templateCatalog/.gitignore-default.md',
        'templateCatalog/abc/index.ts-default.md',
        'templateCatalog/dummy.md-default.md',
        'templateCatalog/readme.md-default.md',
      ];

      const redOnlyFileList = [];

      const result = await updateTemplateConfig({
        templateConfig,
        fileList,
        templateFileList,
        rootPathFileList,
        redOnlyFileList,
      });

      const allFiles = await searchFilesInDirectory({
        directoryPath: templateConfig.projectCatalog,
        excludedFileNames: ['.DS_Store'],
        excludedPhrases: ['.backup'],
      });

      const repositoryMapFileConfig: RepositoryMapFileConfigType = await readFile(
        templateConfig.repositoryMapFilePath
      ).then(async (bufferData) => parseJSON(bufferData.toString()));

      expect({ ...result, allFiles, repositoryMapFileConfig }).toEqual({
        templateConfig: mockTemplateConfig.updateTemplateConfig.templateConfig,
        newContent: mockTemplateConfig.updateTemplateConfig.repositoryMapFileConfig,
        repositoryMapFileConfig: mockTemplateConfig.updateTemplateConfig.repositoryMapFileConfig,
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
      });
    });
  });
});
