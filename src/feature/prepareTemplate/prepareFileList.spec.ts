import { prepareFileList } from './prepareFileList';
import { createImage } from '../__tests__/createImage';
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
          redOnlyFileList: [],
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          templateFileList: [],
          templateVersion: '1.0.0',
        },
        redOnlyFileList: [],
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

    it('should return mock file with Image and config', async () => {
      templateConfig = {
        ...templateConfig,
        projectCatalog: './mock/mockTemplateWithImageWithConfig',
        templateCatalogPath: './mock/mockTemplateWithImageWithConfig/templateCatalog',
        repositoryMapFilePath: './mock/mockTemplateWithImageWithConfig/templateCatalog/repositoryMap.json',
      };

      repositoryMapFileConfig = {
        ...repositoryMapFileConfig,
        projectCatalog: './mock/mockTemplateWithImageWithConfig',
        templateCatalogPath: './mock/mockTemplateWithImageWithConfig/templateCatalog',
        repositoryMapFilePath: './mock/mockTemplateWithImageWithConfig/templateCatalog/repositoryMap.json',
        fileMap: [
          'templateCatalog/.gitignore-default.md',
          'templateCatalog/package.json-default.md',
          'templateCatalog/tsconfig.json-default.md',
          'templateCatalog/yarn.lock-default.md',
        ],
        templateFileList: [
          './.gitignore',
          './package.json',
          './srcReadme/heroImageReposytory.png',
          './tsconfig.json',
          './yarn.lock',
        ],
        rootPathFileList: [
          './mock/mockTemplateWithImageWithConfig/.gitignore',
          './mock/mockTemplateWithImageWithConfig/package.json',
          './mock/mockTemplateWithImageWithConfig/tsconfig.json',
          './mock/mockTemplateWithImageWithConfig/yarn.lock',
        ],
        redOnlyFileList: ['./srcReadme/heroImageReposytory.png'],
      };

      await createCatalog(templateConfig.templateCatalogPath);

      await cleanUpTemplateCatalog('mock', 'prepareFileList', 'mockTemplateWithImageWithConfig');

      const FileToCreate: FileToCreateType[] = [
        {
          filePath: templateConfig.repositoryMapFilePath,
          content: JSON.stringify(repositoryMapFileConfig),
          options: { createFolder: true },
        },
      ];

      await setupTestFiles(FileToCreate, templateConfig.isDebug);

      const dataToTest = await getTestData(templateConfig, () =>
        prepareFileList({
          templateConfig,
          templateFileList: [
            './.gitignore',
            './package.json',
            './tsconfig.json',
            './yarn.lock',
            './srcReadme/heroImageReposytory.png',
          ],
        })
      );

      expect({ ...dataToTest }).toStrictEqual({
        allFiles: [
          './mock/mockTemplateWithImageWithConfig/.gitignore',
          './mock/mockTemplateWithImageWithConfig/package.json',
          './mock/mockTemplateWithImageWithConfig/srcReadme/heroImageReposytory.png',
          './mock/mockTemplateWithImageWithConfig/templateCatalog/.gitignore-default.md',
          './mock/mockTemplateWithImageWithConfig/templateCatalog/package.json-default.md',
          './mock/mockTemplateWithImageWithConfig/templateCatalog/repositoryMap.json',
          './mock/mockTemplateWithImageWithConfig/templateCatalog/tsconfig.json-default.md',
          './mock/mockTemplateWithImageWithConfig/templateCatalog/yarn.lock-default.md',
          './mock/mockTemplateWithImageWithConfig/tsconfig.json',
          './mock/mockTemplateWithImageWithConfig/yarn.lock',
        ],
        repositoryMapFileConfigContent: {
          _: [],
          bumpVersion: true,
          fileMap: [
            'templateCatalog/.gitignore-default.md',
            'templateCatalog/package.json-default.md',
            'templateCatalog/tsconfig.json-default.md',
            'templateCatalog/yarn.lock-default.md',
          ],
          isDebug: false,
          projectCatalog: './mock/mockTemplateWithImageWithConfig',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './mock/mockTemplateWithImageWithConfig/templateCatalog/repositoryMap.json',
          rootPathFileList: [
            './mock/mockTemplateWithImageWithConfig/.gitignore',
            './mock/mockTemplateWithImageWithConfig/package.json',
            './mock/mockTemplateWithImageWithConfig/tsconfig.json',
            './mock/mockTemplateWithImageWithConfig/yarn.lock',
          ],
          redOnlyFileList: ['./srcReadme/heroImageReposytory.png'],
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './mock/mockTemplateWithImageWithConfig/templateCatalog',
          templateFileList: [
            './.gitignore',
            './package.json',
            './srcReadme/heroImageReposytory.png',
            './tsconfig.json',
            './yarn.lock',
          ],
          templateVersion: '1.0.0',
        },
        redOnlyFileList: ['./srcReadme/heroImageReposytory.png'],
        fileList: [
          'templateCatalog/.gitignore-default.md',
          'templateCatalog/package.json-default.md',
          'templateCatalog/tsconfig.json-default.md',
          'templateCatalog/yarn.lock-default.md',
        ],
        rootPathFileList: [
          './mock/mockTemplateWithImageWithConfig/.gitignore',
          './mock/mockTemplateWithImageWithConfig/package.json',
          './mock/mockTemplateWithImageWithConfig/tsconfig.json',
          './mock/mockTemplateWithImageWithConfig/yarn.lock',
        ],
        templateFileList: [
          './.gitignore',
          './package.json',
          './tsconfig.json',
          './yarn.lock',
          './srcReadme/heroImageReposytory.png',
        ],
        templateConfig: {
          ...templateConfig,
        },
      });
      await cleanUpTemplateCatalog('mock', 'prepareFileList', 'templateCatalogWithImage');
    });

    it('should return mock file with Image', async () => {
      templateConfig = {
        ...templateConfig,
        projectCatalog: './mock/mockTemplateWithImage',
        templateCatalogPath: './mock/mockTemplateWithImage/templateCatalog',
        repositoryMapFilePath: './mock/mockTemplateWithImage/templateCatalog/repositoryMap.json',
      };

      await createCatalog(templateConfig.templateCatalogPath);

      await cleanUpTemplateCatalog('mock', 'prepareFileList', 'mockTemplateWithImage');

      const dataToTest = await getTestData(templateConfig, () =>
        prepareFileList({
          templateConfig,
          templateFileList: [
            './.gitignore',
            './package.json',
            './tsconfig.json',
            './yarn.lock',
            './srcReadme/heroImageReposytory.png',
          ],
        })
      );

      expect({ ...dataToTest }).toStrictEqual({
        allFiles: [
          './mock/mockTemplateWithImage/.gitignore',
          './mock/mockTemplateWithImage/package.json',
          './mock/mockTemplateWithImage/srcReadme/heroImageReposytory.png',
          './mock/mockTemplateWithImage/templateCatalog/.gitignore-default.md',
          './mock/mockTemplateWithImage/templateCatalog/package.json-default.md',
          './mock/mockTemplateWithImage/templateCatalog/tsconfig.json-default.md',
          './mock/mockTemplateWithImage/templateCatalog/yarn.lock-default.md',
          './mock/mockTemplateWithImage/tsconfig.json',
          './mock/mockTemplateWithImage/yarn.lock',
        ],
        repositoryMapFileConfigContent: {},
        redOnlyFileList: ['./srcReadme/heroImageReposytory.png'],
        fileList: [
          'templateCatalog/.gitignore-default.md',
          'templateCatalog/package.json-default.md',
          'templateCatalog/tsconfig.json-default.md',
          'templateCatalog/yarn.lock-default.md',
        ],
        rootPathFileList: [
          './mock/mockTemplateWithImage/.gitignore',
          './mock/mockTemplateWithImage/package.json',
          './mock/mockTemplateWithImage/tsconfig.json',
          './mock/mockTemplateWithImage/yarn.lock',
        ],
        templateFileList: [
          './.gitignore',
          './package.json',
          './tsconfig.json',
          './yarn.lock',
          './srcReadme/heroImageReposytory.png',
        ],
        templateConfig: {
          ...templateConfig,
        },
      });
      await cleanUpTemplateCatalog('mock', 'prepareFileList', 'templateCatalogWithImage');
    });
  });

  describe('context test', () => {
    let templateConfig: ConfigTemplateType;
    let repositoryMapFileConfig: RepositoryMapFileConfigType;

    beforeEach(async () => {
      templateConfig = { ...mockTemplateConfig.prepareFileList };
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
        redOnlyFileList: [],
        rootPathFileList: [],
      });
    });

    it('should return non empty arrays', async () => {
      const result = await prepareFileList({ templateConfig, templateFileList: ['./dummy.md'] });

      const allFiles = await searchFilesInDirectory({
        directoryPath: templateConfig.projectCatalog,
        excludedFileNames: ['.DS_Store'],
        excludedPhrases: ['.backup'],
      });

      expect({ ...result, allFiles }).toEqual({
        templateConfig: mockTemplateConfig.prepareFileList,
        templateFileList: ['./dummy.md'],
        allFiles: [
          './test/mockTemplate/dummy.md',
          './test/mockTemplate/templateCatalog/dummy.md-default.md',
          './test/mockTemplate/templateCatalog/repositoryMap.json',
        ],
        fileList: ['templateCatalog/dummy.md-default.md'],
        redOnlyFileList: [],
        rootPathFileList: ['./test/mockTemplate/dummy.md'],
      });
    });

    it('should return non empty arrays and binary file', async () => {
      await createImage(createPath([templateConfig.projectCatalog, 'image.png']));

      const result = await prepareFileList({ templateConfig, templateFileList: ['./dummy.md', './image.png'] });

      const allFiles = await searchFilesInDirectory({
        directoryPath: templateConfig.projectCatalog,
        excludedFileNames: ['.DS_Store'],
        excludedPhrases: ['.backup'],
      });

      expect({ ...result, allFiles }).toEqual({
        templateConfig: mockTemplateConfig.prepareFileList,
        templateFileList: ['./dummy.md', './image.png'],
        allFiles: [
          './test/mockTemplate/dummy.md',
          './test/mockTemplate/image.png',
          './test/mockTemplate/templateCatalog/dummy.md-default.md',
          './test/mockTemplate/templateCatalog/repositoryMap.json',
        ],
        fileList: ['templateCatalog/dummy.md-default.md'],
        redOnlyFileList: ['./image.png'],
        rootPathFileList: ['./test/mockTemplate/dummy.md'],
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
        redOnlyFileList: [],
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
