import { prepareFileList } from './prepareFileList';
import { cleanUpProjectCatalog, cleanUpTemplateCatalog } from '../__tests__/prepareFileForTests';
import { searchFilesInDirectory } from '../__tests__/searchFilesInDirectory';
import { ConfigTemplateType, RepositoryMapFileConfigType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';

describe('prepareFileList', () => {
  describe('context mock', () => {
    afterEach(async () => {
      await cleanUpTemplateCatalog('mock');
    });
    it('a', async () => {
      expect(1).toEqual(1);
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
        content: JSON.stringify(templateConfig),
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
