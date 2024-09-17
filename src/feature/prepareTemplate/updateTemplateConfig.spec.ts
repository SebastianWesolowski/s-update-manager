import { updateTemplateConfig } from './updateTemplateConfig';
import { cleanUpProjectCatalog, cleanUpTemplateCatalog } from '../__tests__/prepareFileForTests';
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
      templateConfig = { ...mockTemplateConfig.scanProjectFolder };
      repositoryMapFileConfig = { ...mockTemplateConfig.init.repositoryMapFileConfig };

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

      const result = await updateTemplateConfig({ templateConfig, fileList, templateFileList, rootPathFileList });

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
