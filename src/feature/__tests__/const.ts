import { ConfigTemplateType, RepositoryMapFileConfigType } from '../config/types';

const mockConfig_step_init = {
  REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
  _: [],
  availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
  availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
  isDebug: false,
  projectCatalog: './test/mockProject',
  remoteFileMapURL:
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/testTemplate/templateCatalog/repositoryMap.json',
  remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/testTemplate',
  remoteRootRepositoryUrl:
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/testTemplate',
  templateVersion: '1.0.0',
  snpCatalog: './test/mockProject/.snp/',
  snpConfigFile: './test/mockProject/.snp/snp.config.json',
  snpConfigFileName: 'snp.config.json',
  snpFileMapConfig: './test/mockProject/.snp/repositoryMap.json',
  templateCatalogName: 'templateCatalog',
  temporaryFolder: './test/mockProject/.snp/temporary/',
};

const mockConfig_step_createConfigFile = {
  ...mockConfig_step_init,
};
const mockConfig_step_downloadConfigFileForInit = {
  ...mockConfig_step_createConfigFile,
};
const mockConfig_step_downloadConfigFileForUpdate = {
  ...mockConfig_step_createConfigFile,
  remoteFileMapURL:
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/mockUpdatedTemplate/templateCatalog/repositoryMap.json',
  remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
  remoteRootRepositoryUrl:
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
};

const mockConfig_step_prepareBaseSnpFileMap = {
  ...mockConfig_step_downloadConfigFileForInit,
};

const mockConfig_step_scanExtraFile_empty = {
  ...mockConfig_step_downloadConfigFileForInit,
};

const mockConfig_step_scanExtraFile_fullFiled = {
  ...mockConfig_step_downloadConfigFileForInit,
};

const mockConfig_step_buildFromConfig_empty = {
  ...mockConfig_step_scanExtraFile_empty,
};

const mockConfig_step_buildFromConfig_fullFiled = {
  ...mockConfig_step_scanExtraFile_fullFiled,
};

const mockConfig_step_cleanUp_empty = {
  ...mockConfig_step_buildFromConfig_empty,
};

const mockConfig_step_cleanUp_fullFiled = {
  ...mockConfig_step_buildFromConfig_fullFiled,
};

const mockConfig_step_cleanUpBeforeUpdate_empty = {
  ...mockConfig_step_cleanUp_empty,
};

const mockConfig_step_cleanUpBeforeUpdate_fullFiled = {
  ...mockConfig_step_cleanUp_fullFiled,
};

const mockSnpFileMapConfig_step_init = {
  fileMap: [
    'templateCatalog/.gitignore-default.md',
    'templateCatalog/README.md-default.md',
    'templateCatalog/package.json-default.md',
    'templateCatalog/tools/test.sh-default.md',
    'templateCatalog/tsconfig.json-default.md',
    'templateCatalog/yarn.lock-default.md',
  ],
  rootPathFileList: [
    './.gitignore.md',
    './README.md',
    './package.json',
    './tools/test.sh',
    './tsconfig.json',
    './yarn.lock',
  ],
  templateFileList: [
    './.gitignore.md',
    './README.md',
    './package.json',
    './tools/test.sh',
    './tsconfig.json',
    './yarn.lock',
  ],
  templateVersion: '1.0.0',
};

const mockSnpFileMapConfig_step_createConfigFile = {
  ...mockSnpFileMapConfig_step_init,
  snpFileMap: {},
  createdFileMap: [],
};

const mockSnpFileMapConfig_step_downloadConfigFileForInit = {
  ...mockSnpFileMapConfig_step_createConfigFile,
};
const mockSnpFileMapConfig_step_downloadConfigFileForDownloaded = {
  ...mockSnpFileMapConfig_step_createConfigFile,
  fileMap: [
    'templateCatalog/.gitignore-default.md',
    'templateCatalog/package.json-default.md',
    'templateCatalog/tools/newTest.sh-default.md',
    'templateCatalog/tools/test.sh-default.md',
    'templateCatalog/tsconfig.json-default.md',
    'templateCatalog/yarn.lock-default.md',
  ],
  rootPathFileList: [
    './.gitignore',
    './package.json',
    './tools/newTest.sh',
    './tools/test.sh',
    './tsconfig.json',
    './yarn.lock',
  ],
  templateFileList: [
    './.gitignore',
    './package.json',
    './tools/newTest.sh',
    './tools/test.sh',
    './tsconfig.json',
    './yarn.lock',
  ],
};

// @ts-ignore
delete mockSnpFileMapConfig_step_downloadConfigFileForDownloaded.createdFileMap;
// @ts-ignore
delete mockSnpFileMapConfig_step_downloadConfigFileForDownloaded.snpFileMap;

const mockSnpFileMapConfig_step_downloadConfigFileForUpdated = {
  ...mockSnpFileMapConfig_step_createConfigFile,
  createdFileMap: [],
  snpFileMap: {},
  fileMap: [
    'templateCatalog/.gitignore-default.md',
    'templateCatalog/package.json-default.md',
    'templateCatalog/tools/newTest.sh-default.md',
    'templateCatalog/tools/test.sh-default.md',
    'templateCatalog/tsconfig.json-default.md',
    'templateCatalog/yarn.lock-default.md',
  ],
  rootPathFileList: [
    './.gitignore',
    './package.json',
    './tools/newTest.sh',
    './tools/test.sh',
    './tsconfig.json',
    './yarn.lock',
  ],
  templateFileList: [
    './.gitignore',
    './package.json',
    './tools/newTest.sh',
    './tools/test.sh',
    './tsconfig.json',
    './yarn.lock',
  ],
};

const mockSnpFileMapConfig_step_prepareBaseSnpFileMap = {
  ...mockSnpFileMapConfig_step_downloadConfigFileForInit,
  snpFileMap: {
    '.gitignore': {
      _: {
        SNPKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/.gitignore',
        realFilePath: '.gitignore',
        realPath: './test/mockProject/.gitignore',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SNPKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.snp/templateCatalog/.gitignore-default.md',
        realFilePath: '.gitignore',
        realPath: './test/mockProject/.gitignore',
        templateVersion: '1.0.0',
        SNPSuffixFileName: 'templateCatalog/.gitignore-default.md',
      },
    },
    'README.md': {
      _: {
        SNPKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/README.md',
        realFilePath: 'README.md',
        realPath: './test/mockProject/README.md',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SNPKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.snp/templateCatalog/README.md-default.md',
        realFilePath: 'README.md',
        realPath: './test/mockProject/README.md',
        templateVersion: '1.0.0',
        SNPSuffixFileName: 'templateCatalog/README.md-default.md',
      },
    },
    'package.json': {
      _: {
        SNPKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/package.json',
        realFilePath: 'package.json',
        realPath: './test/mockProject/package.json',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SNPKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.snp/templateCatalog/package.json-default.md',
        realFilePath: 'package.json',
        realPath: './test/mockProject/package.json',
        templateVersion: '1.0.0',
        SNPSuffixFileName: 'templateCatalog/package.json-default.md',
      },
    },
    'tools/test.sh': {
      _: {
        SNPKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/tools/test.sh',
        realFilePath: 'tools/test.sh',
        realPath: './test/mockProject/test.sh',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SNPKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.snp/templateCatalog/tools/test.sh-default.md',
        realFilePath: 'tools/test.sh',
        realPath: './test/mockProject/tools/test.sh',
        templateVersion: '1.0.0',
        SNPSuffixFileName: 'templateCatalog/tools/test.sh-default.md',
      },
    },
    'tsconfig.json': {
      _: {
        SNPKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/tsconfig.json',
        realFilePath: 'tsconfig.json',
        realPath: './test/mockProject/tsconfig.json',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SNPKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.snp/templateCatalog/tsconfig.json-default.md',
        realFilePath: 'tsconfig.json',
        realPath: './test/mockProject/tsconfig.json',
        templateVersion: '1.0.0',
        SNPSuffixFileName: 'templateCatalog/tsconfig.json-default.md',
      },
    },
    'yarn.lock': {
      _: {
        SNPKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/yarn.lock',
        realFilePath: 'yarn.lock',
        realPath: './test/mockProject/yarn.lock',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SNPKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.snp/templateCatalog/yarn.lock-default.md',
        realFilePath: 'yarn.lock',
        realPath: './test/mockProject/yarn.lock',
        templateVersion: '1.0.0',
        SNPSuffixFileName: 'templateCatalog/yarn.lock-default.md',
      },
    },
  },
};

const mockSnpFileMapConfig_step_scanExtraFile_empty = {
  ...mockSnpFileMapConfig_step_prepareBaseSnpFileMap,
};

const mockSnpFileMapConfig_step_scanExtraFile_fullFiled = {
  ...mockSnpFileMapConfig_step_prepareBaseSnpFileMap,
  manualCreatedFileMap: [
    './test/mockProject/.snp/templateCatalog/.gitignore-custom.md',
    './test/mockProject/.snp/templateCatalog/README.md-custom.md',
    './test/mockProject/.snp/templateCatalog/package.json-custom.md',
    './test/mockProject/.snp/templateCatalog/.gitignore-extend.md',
    './test/mockProject/.snp/templateCatalog/README.md-extend.md',
    './test/mockProject/.snp/templateCatalog/package.json-extend.md',
  ],
  snpFileMap: {
    ...mockSnpFileMapConfig_step_prepareBaseSnpFileMap.snpFileMap,
    '.gitignore': {
      ...mockSnpFileMapConfig_step_prepareBaseSnpFileMap.snpFileMap['.gitignore'],
      customFile: {
        SNPKeySuffix: 'customFile',
        SNPSuffixFileName: '.gitignore-custom.md',
        isCreated: true,
        path: './test/mockProject/.snp/templateCatalog/.gitignore-custom.md',
        realFilePath: '.gitignore',
        realPath: './test/mockProject/.gitignore',
        templateVersion: '1.0.0',
      },
      extendFile: {
        SNPKeySuffix: 'extendFile',
        SNPSuffixFileName: '.gitignore-extend.md',
        isCreated: true,
        path: './test/mockProject/.snp/templateCatalog/.gitignore-extend.md',
        realFilePath: '.gitignore',
        realPath: './test/mockProject/.gitignore',
        templateVersion: '1.0.0',
      },
    },
    'README.md': {
      ...mockSnpFileMapConfig_step_prepareBaseSnpFileMap.snpFileMap['README.md'],
      customFile: {
        SNPKeySuffix: 'customFile',
        SNPSuffixFileName: 'README.md-custom.md',
        isCreated: true,
        path: './test/mockProject/.snp/templateCatalog/README.md-custom.md',
        realFilePath: 'README.md',
        realPath: './test/mockProject/README.md',
        templateVersion: '1.0.0',
      },
      extendFile: {
        SNPKeySuffix: 'extendFile',
        SNPSuffixFileName: 'README.md-extend.md',
        isCreated: true,
        path: './test/mockProject/.snp/templateCatalog/README.md-extend.md',
        realFilePath: 'README.md',
        realPath: './test/mockProject/README.md',
        templateVersion: '1.0.0',
      },
    },
    'package.json': {
      ...mockSnpFileMapConfig_step_prepareBaseSnpFileMap.snpFileMap['package.json'],
      customFile: {
        SNPKeySuffix: 'customFile',
        SNPSuffixFileName: 'package.json-custom.md',
        isCreated: true,
        path: './test/mockProject/.snp/templateCatalog/package.json-custom.md',
        realFilePath: 'package.json',
        realPath: './test/mockProject/package.json',
        templateVersion: '1.0.0',
      },
      extendFile: {
        SNPKeySuffix: 'extendFile',
        SNPSuffixFileName: 'package.json-extend.md',
        isCreated: true,
        path: './test/mockProject/.snp/templateCatalog/package.json-extend.md',
        realFilePath: 'package.json',
        realPath: './test/mockProject/package.json',
        templateVersion: '1.0.0',
      },
    },
  },
};

const mockSnpFileMapConfig_step_buildFromConfig_empty = {
  ...mockSnpFileMapConfig_step_scanExtraFile_empty,
  createdFileMap: [
    './test/mockProject/.snp/templateCatalog/.gitignore-default.md',
    './test/mockProject/.gitignore',
    './test/mockProject/.snp/templateCatalog/README.md-default.md',
    './test/mockProject/README.md',
    './test/mockProject/.snp/templateCatalog/package.json-default.md',
    './test/mockProject/package.json',
    './test/mockProject/.snp/templateCatalog/tools/test.sh-default.md',
    './test/mockProject/tools/test.sh',
    './test/mockProject/.snp/templateCatalog/tsconfig.json-default.md',
    './test/mockProject/tsconfig.json',
    './test/mockProject/.snp/templateCatalog/yarn.lock-default.md',
    './test/mockProject/yarn.lock',
  ],
  snpFileMap: Object.fromEntries(
    Object.entries({
      '.gitignore': {},
      'README.md': {},
      'package.json': {},
      'tools/test.sh': {},
      'tsconfig.json': {},
      'yarn.lock': {},
    }).map(([key]) => [
      key,
      {
        ...mockSnpFileMapConfig_step_scanExtraFile_empty.snpFileMap[key],
        _: {
          ...mockSnpFileMapConfig_step_scanExtraFile_fullFiled.snpFileMap[key]?.['_'],
          isCreated: true,
        },
        defaultFile: {
          ...mockSnpFileMapConfig_step_scanExtraFile_empty.snpFileMap[key].defaultFile,
          isCreated: true,
        },
      },
    ])
  ),
};

const mockSnpFileMapConfig_step_buildFromConfig_fullFiled = {
  ...mockSnpFileMapConfig_step_scanExtraFile_fullFiled,
  createdFileMap: [
    './test/mockProject/.snp/templateCatalog/.gitignore-default.md',
    './test/mockProject/.gitignore',
    './test/mockProject/.snp/templateCatalog/README.md-default.md',
    './test/mockProject/README.md',
    './test/mockProject/.snp/templateCatalog/package.json-default.md',
    './test/mockProject/package.json',
    './test/mockProject/.snp/templateCatalog/tools/test.sh-default.md',
    './test/mockProject/tools/test.sh',
    './test/mockProject/.snp/templateCatalog/tsconfig.json-default.md',
    './test/mockProject/tsconfig.json',
    './test/mockProject/.snp/templateCatalog/yarn.lock-default.md',
    './test/mockProject/yarn.lock',
  ],
  snpFileMap: Object.fromEntries(
    Object.entries({
      '.gitignore': {},
      'README.md': {},
      'package.json': {},
      'tools/test.sh': {},
      'tsconfig.json': {},
      'yarn.lock': {},
    }).map(([key]) => [
      key,
      {
        ...mockSnpFileMapConfig_step_scanExtraFile_fullFiled.snpFileMap[key],
        _: {
          ...mockSnpFileMapConfig_step_scanExtraFile_fullFiled.snpFileMap[key]?.['_'],
          isCreated: true,
        },
        defaultFile: {
          ...mockSnpFileMapConfig_step_scanExtraFile_fullFiled.snpFileMap[key]?.defaultFile,
          isCreated: true,
        },
      },
    ])
  ),
};

const mockSnpFileMapConfig_step_cleanUp_empty = {
  ...mockSnpFileMapConfig_step_buildFromConfig_empty,
};
const mockSnpFileMapConfig_step_cleanUp_fullFiled = {
  ...mockSnpFileMapConfig_step_buildFromConfig_fullFiled,
};

const mockSnpFileMapConfig_step_cleanUpBeforeUpdate_empty = {
  ...mockSnpFileMapConfig_step_cleanUp_empty,
  createdFileMap: [],
  fileMap: [],
  rootPathFileList: mockSnpFileMapConfig_step_cleanUp_empty.rootPathFileList,
  snpFileMap: {},
  templateFileList: mockSnpFileMapConfig_step_cleanUp_empty.templateFileList,
};

const mockSnpFileMapConfig_step_cleanUpBeforeUpdate_fullFiled = {
  ...mockSnpFileMapConfig_step_cleanUp_fullFiled,
  createdFileMap: [],
  fileMap: [],
  rootPathFileList: mockSnpFileMapConfig_step_cleanUp_fullFiled.rootPathFileList,
  snpFileMap: Object.fromEntries(
    Object.entries({
      '.gitignore': {},
      'README.md': {},
      'package.json': {},
    }).map(([key]) => [
      key,
      {
        customFile: {
          ...mockSnpFileMapConfig_step_cleanUp_fullFiled.snpFileMap[key]?.customFile,
        },
        extendFile: {
          ...mockSnpFileMapConfig_step_cleanUp_fullFiled.snpFileMap[key]?.extendFile,
        },
      },
    ])
  ),
  templateFileList: mockSnpFileMapConfig_step_cleanUp_fullFiled.templateFileList,
};

export const mockConfig = {
  step: {
    init: mockConfig_step_init,
    createConfigFile: mockConfig_step_createConfigFile,
    downloadConfigFile: {
      forInit: mockConfig_step_downloadConfigFileForInit,
      forUpdate: mockConfig_step_downloadConfigFileForUpdate,
    },
    prepareBaseSnpFileMap: mockConfig_step_prepareBaseSnpFileMap,
    scanExtraFile: {
      empty: mockConfig_step_scanExtraFile_empty,
      fullFiled: mockConfig_step_scanExtraFile_fullFiled,
    },
    buildFromConfig: {
      empty: mockConfig_step_buildFromConfig_empty,
      fullFiled: mockConfig_step_buildFromConfig_fullFiled,
    },
    cleanUp: {
      empty: mockConfig_step_cleanUp_empty,
      fullFiled: mockConfig_step_cleanUp_fullFiled,
    },
    cleanUpBeforeUpdate: {
      empty: mockConfig_step_cleanUpBeforeUpdate_empty,
      fullFiled: mockConfig_step_cleanUpBeforeUpdate_fullFiled,
    },
  },
};

export const mockSnpFileMapConfig = {
  step: {
    init: mockSnpFileMapConfig_step_init,
    createConfigFile: mockSnpFileMapConfig_step_createConfigFile,
    downloadConfigFile: {
      forInit: mockSnpFileMapConfig_step_downloadConfigFileForInit,
      downloaded: mockSnpFileMapConfig_step_downloadConfigFileForDownloaded,
      updated: mockSnpFileMapConfig_step_downloadConfigFileForUpdated,
    },
    prepareBaseSnpFileMap: mockSnpFileMapConfig_step_prepareBaseSnpFileMap,
    scanExtraFile: {
      empty: mockSnpFileMapConfig_step_scanExtraFile_empty,
      fullFiled: mockSnpFileMapConfig_step_scanExtraFile_fullFiled,
    },
    buildFromConfig: {
      empty: mockSnpFileMapConfig_step_buildFromConfig_empty,
      fullFiled: mockSnpFileMapConfig_step_buildFromConfig_fullFiled,
    },
    cleanUp: {
      empty: mockSnpFileMapConfig_step_cleanUp_empty,
      fullFiled: mockSnpFileMapConfig_step_cleanUp_fullFiled,
    },
    cleanUpBeforeUpdate: {
      empty: mockSnpFileMapConfig_step_cleanUpBeforeUpdate_empty,
      fullFiled: mockSnpFileMapConfig_step_cleanUpBeforeUpdate_fullFiled,
    },
  },
};

const mockTemplateConfig_step_init: ConfigTemplateType = {
  projectCatalog: './test/mockTemplate/',
  templateCatalogName: 'templateCatalog',
  templateCatalogPath: './test/mockTemplate/templateCatalog',
  repositoryMapFileName: 'repositoryMap.json',
  repositoryMapFilePath: './test/mockTemplate/repositoryMap.json',
  bumpVersion: true,
  isDebug: false,
  _: [],
};

const mockTemplateConfig_step_bumpVersion: ConfigTemplateType = {
  ...mockTemplateConfig_step_init,
  templateVersion: '1.0.0',
};
const mockTemplateConfig_step_cleanUpTemplate: ConfigTemplateType = {
  ...mockTemplateConfig_step_bumpVersion,
};
const mockTemplateConfig_step_prepareFileList: ConfigTemplateType = {
  ...mockTemplateConfig_step_cleanUpTemplate,
};
const mockTemplateConfig_step_scanProjectFolder: ConfigTemplateType = {
  ...mockTemplateConfig_step_prepareFileList,
};
const mockTemplateConfig_step_updateTemplateConfig: ConfigTemplateType = {
  ...mockTemplateConfig_step_scanProjectFolder,
};

const repositoryMapFileConfigType_step_updateTemplateConfig: RepositoryMapFileConfigType = {
  ...mockTemplateConfig_step_scanProjectFolder,
  templateVersion: '1.0.0',
  fileMap: [
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
  templateFileList: ['./.gitignore', './abc/index.ts', './dummy.md', './readme.md'],
};
const mockTemplateConfig_step_formatJsonWithPrettier: ConfigTemplateType = {
  ...mockTemplateConfig_step_updateTemplateConfig,
};

export const mockTemplateConfig = {
  init: mockTemplateConfig_step_init,
  bumpVersion: mockTemplateConfig_step_bumpVersion,
  cleanUpTemplate: mockTemplateConfig_step_cleanUpTemplate,
  prepareFileList: mockTemplateConfig_step_prepareFileList,
  scanProjectFolder: mockTemplateConfig_step_scanProjectFolder,
  updateTemplateConfig: {
    templateConfig: mockTemplateConfig_step_updateTemplateConfig,
    repositoryMapFileConfig: repositoryMapFileConfigType_step_updateTemplateConfig,
  },

  formatJsonWithPrettier: mockTemplateConfig_step_formatJsonWithPrettier,
};
