import fs from 'fs';
import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSumFileMapConfig } from '@/feature/__tests__/const';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { updateConfigBasedOnComparison } from '@/feature/__tests__/updateConfigBasedOnComparison';
import { cleanUp } from '@/feature/cleanUp';
import { ConfigType } from '@/feature/config/types';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';

describe('cleanUp', () => {
  let partialConfig: Partial<ConfigType>;
  let config: ConfigType;
  let sumFileMapConfig: FileMapConfig;

  beforeEach(async () => {
    const configFullField = mockConfig.step.buildFromConfig.fullFiled;
    const configEmpty = mockConfig.step.buildFromConfig.empty;
    const keysToCompare: (keyof ConfigType)[] = ['sumCatalog', 'projectCatalog', 'isDebug'];

    partialConfig = updateConfigBasedOnComparison<Partial<ConfigType>>(
      partialConfig,
      configFullField,
      configEmpty,
      keysToCompare
    );

    if (partialConfig.sumCatalog && partialConfig.projectCatalog && partialConfig.isDebug) {
      await cleanUpFiles({
        sumCatalog: partialConfig.sumCatalog,
        directoryPath: partialConfig.projectCatalog,
        isDebug: partialConfig.isDebug,
      });
    }
  });

  afterEach(async () => {
    await cleanUpFiles({
      sumCatalog: config.sumCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });
  });

  it('should cleanup without extra file', async () => {
    config = { ...mockConfig.step.buildFromConfig.empty };
    sumFileMapConfig = { ...mockSumFileMapConfig.step.buildFromConfig.empty };
    await createFile({
      filePath: config.sumConfigFile,
      content: JSON.stringify(config),
    });
    await createFile({
      filePath: config.sumFileMapConfig,
      content: JSON.stringify(sumFileMapConfig),
    });

    for (const file of sumFileMapConfig.createdFileMap) {
      await createFile({
        filePath: file,
        content: `{ path: '${file}' }`,
      });
    }

    const result = await cleanUp(config);

    const allFiles = await searchFilesInDirectory({
      directoryPath: config.projectCatalog,
      excludedFileNames: ['.DS_Store'],
      excludedPhrases: ['.backup'],
    });

    const configContent = await fs.promises.readFile('test/mockProject/.sum/repositoryMap.json', 'utf8');
    const sumFileMapConfigContent = await fs.promises.readFile('test/mockProject/.sum/repositoryMap.json', 'utf8');

    expect({ ...result, allFiles, configContent, sumFileMapConfigContent }).toStrictEqual({
      config: mockConfig.step.cleanUp.empty,
      allFiles: [
        './test/mockProject/.gitignore',
        './test/mockProject/.sum/repositoryMap.json',
        './test/mockProject/.sum/sum.config.json',
        './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
        './test/mockProject/.sum/templateCatalog/README.md-default.md',
        './test/mockProject/.sum/templateCatalog/package.json-default.md',
        './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
        './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
        './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
        './test/mockProject/README.md',
        './test/mockProject/package.json',
        './test/mockProject/tools/test.sh',
        './test/mockProject/tsconfig.json',
        './test/mockProject/yarn.lock',
      ],
      configContent:
        '{\n  "fileMap": [\n    "templateCatalog/.gitignore-default.md",\n    "templateCatalog/README.md-default.md",\n    "templateCatalog/package.json-default.md",\n    "templateCatalog/tools/test.sh-default.md",\n    "templateCatalog/tsconfig.json-default.md",\n    "templateCatalog/yarn.lock-default.md"\n  ],\n  "rootPathFileList": [\n    "./.gitignore.md",\n    "./README.md",\n    "./package.json",\n    "./tools/test.sh",\n    "./tsconfig.json",\n    "./yarn.lock"\n  ],\n  "templateFileList": [\n    "./.gitignore.md",\n    "./README.md",\n    "./package.json",\n    "./tools/test.sh",\n    "./tsconfig.json",\n    "./yarn.lock"\n  ],\n  "templateVersion": "1.0.0",\n  "sumFileMap": {\n    ".gitignore": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/.gitignore",\n        "realFilePath": ".gitignore",\n        "realPath": "./test/mockProject/.gitignore",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/.gitignore-default.md",\n        "realFilePath": ".gitignore",\n        "realPath": "./test/mockProject/.gitignore",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/.gitignore-default.md"\n      }\n    },\n    "README.md": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/README.md",\n        "realFilePath": "README.md",\n        "realPath": "./test/mockProject/README.md",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/README.md-default.md",\n        "realFilePath": "README.md",\n        "realPath": "./test/mockProject/README.md",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/README.md-default.md"\n      }\n    },\n    "package.json": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/package.json",\n        "realFilePath": "package.json",\n        "realPath": "./test/mockProject/package.json",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/package.json-default.md",\n        "realFilePath": "package.json",\n        "realPath": "./test/mockProject/package.json",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/package.json-default.md"\n      }\n    },\n    "tools/test.sh": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/tools/test.sh",\n        "realFilePath": "tools/test.sh",\n        "realPath": "./test/mockProject/test.sh",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/tools/test.sh-default.md",\n        "realFilePath": "tools/test.sh",\n        "realPath": "./test/mockProject/tools/test.sh",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/tools/test.sh-default.md"\n      }\n    },\n    "tsconfig.json": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/tsconfig.json",\n        "realFilePath": "tsconfig.json",\n        "realPath": "./test/mockProject/tsconfig.json",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/tsconfig.json-default.md",\n        "realFilePath": "tsconfig.json",\n        "realPath": "./test/mockProject/tsconfig.json",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/tsconfig.json-default.md"\n      }\n    },\n    "yarn.lock": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/yarn.lock",\n        "realFilePath": "yarn.lock",\n        "realPath": "./test/mockProject/yarn.lock",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/yarn.lock-default.md",\n        "realFilePath": "yarn.lock",\n        "realPath": "./test/mockProject/yarn.lock",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/yarn.lock-default.md"\n      }\n    }\n  },\n  "createdFileMap": [\n    "./test/mockProject/.sum/templateCatalog/.gitignore-default.md",\n    "./test/mockProject/.gitignore",\n    "./test/mockProject/.sum/templateCatalog/README.md-default.md",\n    "./test/mockProject/README.md",\n    "./test/mockProject/.sum/templateCatalog/package.json-default.md",\n    "./test/mockProject/package.json",\n    "./test/mockProject/.sum/templateCatalog/tools/test.sh-default.md",\n    "./test/mockProject/tools/test.sh",\n    "./test/mockProject/.sum/templateCatalog/tsconfig.json-default.md",\n    "./test/mockProject/tsconfig.json",\n    "./test/mockProject/.sum/templateCatalog/yarn.lock-default.md",\n    "./test/mockProject/yarn.lock"\n  ]\n}\n',
      sumFileMapConfigContent:
        '{\n  "fileMap": [\n    "templateCatalog/.gitignore-default.md",\n    "templateCatalog/README.md-default.md",\n    "templateCatalog/package.json-default.md",\n    "templateCatalog/tools/test.sh-default.md",\n    "templateCatalog/tsconfig.json-default.md",\n    "templateCatalog/yarn.lock-default.md"\n  ],\n  "rootPathFileList": [\n    "./.gitignore.md",\n    "./README.md",\n    "./package.json",\n    "./tools/test.sh",\n    "./tsconfig.json",\n    "./yarn.lock"\n  ],\n  "templateFileList": [\n    "./.gitignore.md",\n    "./README.md",\n    "./package.json",\n    "./tools/test.sh",\n    "./tsconfig.json",\n    "./yarn.lock"\n  ],\n  "templateVersion": "1.0.0",\n  "sumFileMap": {\n    ".gitignore": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/.gitignore",\n        "realFilePath": ".gitignore",\n        "realPath": "./test/mockProject/.gitignore",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/.gitignore-default.md",\n        "realFilePath": ".gitignore",\n        "realPath": "./test/mockProject/.gitignore",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/.gitignore-default.md"\n      }\n    },\n    "README.md": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/README.md",\n        "realFilePath": "README.md",\n        "realPath": "./test/mockProject/README.md",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/README.md-default.md",\n        "realFilePath": "README.md",\n        "realPath": "./test/mockProject/README.md",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/README.md-default.md"\n      }\n    },\n    "package.json": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/package.json",\n        "realFilePath": "package.json",\n        "realPath": "./test/mockProject/package.json",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/package.json-default.md",\n        "realFilePath": "package.json",\n        "realPath": "./test/mockProject/package.json",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/package.json-default.md"\n      }\n    },\n    "tools/test.sh": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/tools/test.sh",\n        "realFilePath": "tools/test.sh",\n        "realPath": "./test/mockProject/test.sh",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/tools/test.sh-default.md",\n        "realFilePath": "tools/test.sh",\n        "realPath": "./test/mockProject/tools/test.sh",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/tools/test.sh-default.md"\n      }\n    },\n    "tsconfig.json": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/tsconfig.json",\n        "realFilePath": "tsconfig.json",\n        "realPath": "./test/mockProject/tsconfig.json",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/tsconfig.json-default.md",\n        "realFilePath": "tsconfig.json",\n        "realPath": "./test/mockProject/tsconfig.json",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/tsconfig.json-default.md"\n      }\n    },\n    "yarn.lock": {\n      "_": {\n        "SUMKeySuffix": "_",\n        "isCreated": true,\n        "path": "./test/mockProject/yarn.lock",\n        "realFilePath": "yarn.lock",\n        "realPath": "./test/mockProject/yarn.lock",\n        "templateVersion": "1.0.0"\n      },\n      "defaultFile": {\n        "SUMKeySuffix": "defaultFile",\n        "isCreated": true,\n        "path": "./test/mockProject/.sum/templateCatalog/yarn.lock-default.md",\n        "realFilePath": "yarn.lock",\n        "realPath": "./test/mockProject/yarn.lock",\n        "templateVersion": "1.0.0",\n        "SUMSuffixFileName": "templateCatalog/yarn.lock-default.md"\n      }\n    }\n  },\n  "createdFileMap": [\n    "./test/mockProject/.sum/templateCatalog/.gitignore-default.md",\n    "./test/mockProject/.gitignore",\n    "./test/mockProject/.sum/templateCatalog/README.md-default.md",\n    "./test/mockProject/README.md",\n    "./test/mockProject/.sum/templateCatalog/package.json-default.md",\n    "./test/mockProject/package.json",\n    "./test/mockProject/.sum/templateCatalog/tools/test.sh-default.md",\n    "./test/mockProject/tools/test.sh",\n    "./test/mockProject/.sum/templateCatalog/tsconfig.json-default.md",\n    "./test/mockProject/tsconfig.json",\n    "./test/mockProject/.sum/templateCatalog/yarn.lock-default.md",\n    "./test/mockProject/yarn.lock"\n  ]\n}\n',
    });
  });
});
