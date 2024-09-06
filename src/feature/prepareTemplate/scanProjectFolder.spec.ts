import { scanProjectFolder } from './scanProjectFolder';
import { cleanUpFiles } from '../__tests__/cleanForTests';
import { searchFilesInDirectory } from '../__tests__/searchFilesInDirectory';
import { ConfigTemplateType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';

describe('scanProjectFolder', () => {
  let templateConfig: ConfigTemplateType;
  beforeEach(async () => {
    templateConfig = { ...mockTemplateConfig.cleanUpTemplate };

    await cleanUpFiles({
      snpCatalog: templateConfig.templateCatalogPath,
      directoryPath: templateConfig.projectCatalog,
      isDebug: templateConfig.isDebug,
    });
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
    await cleanUpFiles({
      snpCatalog: templateConfig.templateCatalogPath,
      directoryPath: templateConfig.projectCatalog,
      isDebug: templateConfig.isDebug,
    });
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
      allFiles: ['./test/mockTemplate/dummy.md', './test/mockTemplate/repositoryMap.json'],
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
        './test/mockTemplate/repositoryMap.json',
        './test/mockTemplate/templateCatalog/abc/index.ts-default.md',
        './test/mockTemplate/templateCatalog/readme.md-default.md',
      ],
    });
  });

  it('should respect gitignore', async () => {
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

    const result = await scanProjectFolder(templateConfig);

    expect({ ...result, allFiles }).toEqual({
      templateConfig: mockTemplateConfig.scanProjectFolder,
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
        './test/mockTemplate/repositoryMap.json',
        './test/mockTemplate/templateCatalog/abc/index.ts-default.md',
        './test/mockTemplate/templateCatalog/readme.md-default.md',
        './test/mockTemplate/test/index.spec.ts',
      ],
    });
  });
});
