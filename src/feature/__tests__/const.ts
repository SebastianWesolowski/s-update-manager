import { ConfigTemplateType, RepositoryMapFileConfigType } from '../config/types';

// TODO [SC-28] after release change all dev repolinks to master
const mockConfig_step_init = {
  sumFileMapConfigFileName: 'repositoryMap.json',
  _: [],
  availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
  availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
  isDebug: false,
  projectCatalog: './test/mockProject',
  remoteFileMapURL:
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate/templateCatalog/repositoryMap.json',
  remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
  remoteRootRepositoryUrl:
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate',
  templateVersion: '1.0.0',
  sumCatalog: './test/mockProject/.sum/',
  sumConfigFilePath: './test/mockProject/.sum.config.json',
  sumConfigFileName: '.sum.config.json',
  sumFileMapConfig: './test/mockProject/.sum/repositoryMap.json',
  templateCatalogName: 'templateCatalog',
  temporaryFolder: './test/mockProject/.sum/temporary/',
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
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateUpdated/templateCatalog/repositoryMap.json',
  remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateUpdated',
  remoteRootRepositoryUrl:
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateUpdated',
};

const mockConfig_step_prepareBaseSumFileMap = {
  ...mockConfig_step_downloadConfigFileForInit,
};

const mockConfig_step_scanExtraFile_empty = {
  ...mockConfig_step_downloadConfigFileForInit,
};
const mockConfig_step_scanExtraFile_empty_binary = {
  ...mockConfig_step_downloadConfigFileForInit,
  remoteFileMapURL:
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateWithImage/templateCatalog/repositoryMap.json',
  remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateWithImage',
  remoteRootRepositoryUrl:
    'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateWithImage',
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

const mockSumFileMapConfig_step_init = {
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

const mockSumFileMapConfig_step_createConfigFile = {
  ...mockSumFileMapConfig_step_init,
  sumFileMap: {},
  createdFileMap: [],
};

const mockSumFileMapConfig_step_downloadConfigFileForInit = {
  ...mockSumFileMapConfig_step_createConfigFile,
};
const mockSumFileMapConfig_step_downloadConfigFileForDownloaded = {
  ...mockSumFileMapConfig_step_createConfigFile,
  _: [],
  bumpVersion: true,
  isDebug: false,
  projectCatalog: './',
  repositoryMapFileName: 'repositoryMap.json',
  repositoryMapFilePath: './templateCatalog/repositoryMap.json',
  templateCatalogName: 'templateCatalog',
  templateCatalogPath: './templateCatalog',
  fileMap: [
    'templateCatalog/.gitignore-default.md',
    'templateCatalog/package.json-default.md',
    'templateCatalog/README.md-default.md',
    'templateCatalog/tools/test-new.sh-default.md',
    'templateCatalog/tools/test.sh-default.md',
    'templateCatalog/tsconfig.json-default.md',
    'templateCatalog/yarn.lock-default.md',
  ],
  rootPathFileList: [
    './mock/mockTemplateUpdated/.gitignore',
    './mock/mockTemplateUpdated/package.json',
    './mock/mockTemplateUpdated/README.md',
    './mock/mockTemplateUpdated/tools/test-new.sh',
    './mock/mockTemplateUpdated/tools/test.sh',
    './mock/mockTemplateUpdated/tsconfig.json',
    './mock/mockTemplateUpdated/yarn.lock',
  ],
  templateFileList: [
    './.gitignore',
    './package.json',
    './README.md',
    './tools/test-new.sh',
    './tools/test.sh',
    './tsconfig.json',
    './yarn.lock',
  ],
};

// @ts-ignore
delete mockSumFileMapConfig_step_downloadConfigFileForDownloaded.createdFileMap;
// @ts-ignore
delete mockSumFileMapConfig_step_downloadConfigFileForDownloaded.sumFileMap;

const mockSumFileMapConfig_step_downloadConfigFileForUpdated = {
  ...mockSumFileMapConfig_step_createConfigFile,
  createdFileMap: [],
  sumFileMap: {},
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

const mockSumFileMapConfig_step_prepareBaseSumFileMap = {
  ...mockSumFileMapConfig_step_downloadConfigFileForInit,
  sumFileMap: {
    '.gitignore': {
      _: {
        SUMKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/.gitignore',
        realFilePath: '.gitignore',
        realPath: './test/mockProject/.gitignore',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SUMKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
        realFilePath: '.gitignore',
        realPath: './test/mockProject/.gitignore',
        templateVersion: '1.0.0',
        SUMSuffixFileName: 'templateCatalog/.gitignore-default.md',
      },
    },
    'README.md': {
      _: {
        SUMKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/README.md',
        realFilePath: 'README.md',
        realPath: './test/mockProject/README.md',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SUMKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.sum/templateCatalog/README.md-default.md',
        realFilePath: 'README.md',
        realPath: './test/mockProject/README.md',
        templateVersion: '1.0.0',
        SUMSuffixFileName: 'templateCatalog/README.md-default.md',
      },
    },
    'package.json': {
      _: {
        SUMKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/package.json',
        realFilePath: 'package.json',
        realPath: './test/mockProject/package.json',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SUMKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.sum/templateCatalog/package.json-default.md',
        realFilePath: 'package.json',
        realPath: './test/mockProject/package.json',
        templateVersion: '1.0.0',
        SUMSuffixFileName: 'templateCatalog/package.json-default.md',
      },
    },
    'tools/test.sh': {
      _: {
        SUMKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/tools/test.sh',
        realFilePath: 'tools/test.sh',
        realPath: './test/mockProject/test.sh',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SUMKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
        realFilePath: 'tools/test.sh',
        realPath: './test/mockProject/tools/test.sh',
        templateVersion: '1.0.0',
        SUMSuffixFileName: 'templateCatalog/tools/test.sh-default.md',
      },
    },
    'tsconfig.json': {
      _: {
        SUMKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/tsconfig.json',
        realFilePath: 'tsconfig.json',
        realPath: './test/mockProject/tsconfig.json',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SUMKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
        realFilePath: 'tsconfig.json',
        realPath: './test/mockProject/tsconfig.json',
        templateVersion: '1.0.0',
        SUMSuffixFileName: 'templateCatalog/tsconfig.json-default.md',
      },
    },
    'yarn.lock': {
      _: {
        SUMKeySuffix: '_',
        isCreated: false,
        path: './test/mockProject/yarn.lock',
        realFilePath: 'yarn.lock',
        realPath: './test/mockProject/yarn.lock',
        templateVersion: '1.0.0',
      },
      defaultFile: {
        SUMKeySuffix: 'defaultFile',
        isCreated: false,
        path: './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
        realFilePath: 'yarn.lock',
        realPath: './test/mockProject/yarn.lock',
        templateVersion: '1.0.0',
        SUMSuffixFileName: 'templateCatalog/yarn.lock-default.md',
      },
    },
  },
};

const mockSumFileMapConfig_step_scanExtraFile_empty = {
  ...mockSumFileMapConfig_step_prepareBaseSumFileMap,
};

const mockSumFileMapConfig_step_scanExtraFile_fullFiled = {
  ...mockSumFileMapConfig_step_prepareBaseSumFileMap,
  manualCreatedFileMap: [
    './test/mockProject/.sum/templateCatalog/.gitignore-custom.md',
    './test/mockProject/.sum/templateCatalog/README.md-custom.md',
    './test/mockProject/.sum/templateCatalog/package.json-custom.md',
    './test/mockProject/.sum/templateCatalog/.gitignore-extend.md',
    './test/mockProject/.sum/templateCatalog/README.md-extend.md',
    './test/mockProject/.sum/templateCatalog/package.json-extend.md',
  ],
  sumFileMap: {
    ...mockSumFileMapConfig_step_prepareBaseSumFileMap.sumFileMap,
    '.gitignore': {
      ...mockSumFileMapConfig_step_prepareBaseSumFileMap.sumFileMap['.gitignore'],
      customFile: {
        SUMKeySuffix: 'customFile',
        SUMSuffixFileName: '.gitignore-custom.md',
        isCreated: true,
        path: './test/mockProject/.sum/templateCatalog/.gitignore-custom.md',
        realFilePath: '.gitignore',
        realPath: './test/mockProject/.gitignore',
        templateVersion: '1.0.0',
      },
      extendFile: {
        SUMKeySuffix: 'extendFile',
        SUMSuffixFileName: '.gitignore-extend.md',
        isCreated: true,
        path: './test/mockProject/.sum/templateCatalog/.gitignore-extend.md',
        realFilePath: '.gitignore',
        realPath: './test/mockProject/.gitignore',
        templateVersion: '1.0.0',
      },
    },
    'README.md': {
      ...mockSumFileMapConfig_step_prepareBaseSumFileMap.sumFileMap['README.md'],
      customFile: {
        SUMKeySuffix: 'customFile',
        SUMSuffixFileName: 'README.md-custom.md',
        isCreated: true,
        path: './test/mockProject/.sum/templateCatalog/README.md-custom.md',
        realFilePath: 'README.md',
        realPath: './test/mockProject/README.md',
        templateVersion: '1.0.0',
      },
      extendFile: {
        SUMKeySuffix: 'extendFile',
        SUMSuffixFileName: 'README.md-extend.md',
        isCreated: true,
        path: './test/mockProject/.sum/templateCatalog/README.md-extend.md',
        realFilePath: 'README.md',
        realPath: './test/mockProject/README.md',
        templateVersion: '1.0.0',
      },
    },
    'package.json': {
      ...mockSumFileMapConfig_step_prepareBaseSumFileMap.sumFileMap['package.json'],
      customFile: {
        SUMKeySuffix: 'customFile',
        SUMSuffixFileName: 'package.json-custom.md',
        isCreated: true,
        path: './test/mockProject/.sum/templateCatalog/package.json-custom.md',
        realFilePath: 'package.json',
        realPath: './test/mockProject/package.json',
        templateVersion: '1.0.0',
      },
      extendFile: {
        SUMKeySuffix: 'extendFile',
        SUMSuffixFileName: 'package.json-extend.md',
        isCreated: true,
        path: './test/mockProject/.sum/templateCatalog/package.json-extend.md',
        realFilePath: 'package.json',
        realPath: './test/mockProject/package.json',
        templateVersion: '1.0.0',
      },
    },
  },
};

const mockSumFileMapConfig_step_buildFromConfig_empty = {
  ...mockSumFileMapConfig_step_scanExtraFile_empty,
  createdFileMap: [
    './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
    './test/mockProject/.gitignore',
    './test/mockProject/.sum/templateCatalog/README.md-default.md',
    './test/mockProject/README.md',
    './test/mockProject/.sum/templateCatalog/package.json-default.md',
    './test/mockProject/package.json',
    './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
    './test/mockProject/tools/test.sh',
    './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
    './test/mockProject/tsconfig.json',
    './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
    './test/mockProject/yarn.lock',
  ],
  sumFileMap: Object.fromEntries(
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
        ...mockSumFileMapConfig_step_scanExtraFile_empty.sumFileMap[key],
        _: {
          ...mockSumFileMapConfig_step_scanExtraFile_fullFiled.sumFileMap[key]?.['_'],
          isCreated: true,
        },
        defaultFile: {
          ...mockSumFileMapConfig_step_scanExtraFile_empty.sumFileMap[key].defaultFile,
          isCreated: true,
        },
      },
    ])
  ),
};

const mockSumFileMapConfig_step_buildFromConfig_fullFiled = {
  ...mockSumFileMapConfig_step_scanExtraFile_fullFiled,
  createdFileMap: [
    './test/mockProject/.sum/templateCatalog/.gitignore-default.md',
    './test/mockProject/.gitignore',
    './test/mockProject/.sum/templateCatalog/README.md-default.md',
    './test/mockProject/README.md',
    './test/mockProject/.sum/templateCatalog/package.json-default.md',
    './test/mockProject/package.json',
    './test/mockProject/.sum/templateCatalog/tools/test.sh-default.md',
    './test/mockProject/tools/test.sh',
    './test/mockProject/.sum/templateCatalog/tsconfig.json-default.md',
    './test/mockProject/tsconfig.json',
    './test/mockProject/.sum/templateCatalog/yarn.lock-default.md',
    './test/mockProject/yarn.lock',
  ],
  sumFileMap: Object.fromEntries(
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
        ...mockSumFileMapConfig_step_scanExtraFile_fullFiled.sumFileMap[key],
        _: {
          ...mockSumFileMapConfig_step_scanExtraFile_fullFiled.sumFileMap[key]?.['_'],
          isCreated: true,
        },
        defaultFile: {
          ...mockSumFileMapConfig_step_scanExtraFile_fullFiled.sumFileMap[key]?.defaultFile,
          isCreated: true,
        },
      },
    ])
  ),
};

const mockSumFileMapConfig_step_cleanUp_empty = {
  ...mockSumFileMapConfig_step_buildFromConfig_empty,
};
const mockSumFileMapConfig_step_cleanUp_fullFiled = {
  ...mockSumFileMapConfig_step_buildFromConfig_fullFiled,
};

const mockSumFileMapConfig_step_cleanUpBeforeUpdate_empty = {
  ...mockSumFileMapConfig_step_cleanUp_empty,
  createdFileMap: [],
  fileMap: [],
  rootPathFileList: mockSumFileMapConfig_step_cleanUp_empty.rootPathFileList,
  sumFileMap: {},
  templateFileList: mockSumFileMapConfig_step_cleanUp_empty.templateFileList,
};

const mockSumFileMapConfig_step_cleanUpBeforeUpdate_fullFiled = {
  ...mockSumFileMapConfig_step_cleanUp_fullFiled,
  createdFileMap: [],
  fileMap: [],
  rootPathFileList: mockSumFileMapConfig_step_cleanUp_fullFiled.rootPathFileList,
  sumFileMap: Object.fromEntries(
    Object.entries({
      '.gitignore': {},
      'README.md': {},
      'package.json': {},
    }).map(([key]) => [
      key,
      {
        customFile: {
          ...mockSumFileMapConfig_step_cleanUp_fullFiled.sumFileMap[key]?.customFile,
        },
        extendFile: {
          ...mockSumFileMapConfig_step_cleanUp_fullFiled.sumFileMap[key]?.extendFile,
        },
      },
    ])
  ),
  templateFileList: mockSumFileMapConfig_step_cleanUp_fullFiled.templateFileList,
};

export const mockConfig = {
  step: {
    init: mockConfig_step_init,
    createConfigFile: mockConfig_step_createConfigFile,
    downloadConfigFile: {
      forInit: mockConfig_step_downloadConfigFileForInit,
      forUpdate: mockConfig_step_downloadConfigFileForUpdate,
    },
    prepareBaseSumFileMap: mockConfig_step_prepareBaseSumFileMap,
    scanExtraFile: {
      empty: mockConfig_step_scanExtraFile_empty,
      empty_binary: mockConfig_step_scanExtraFile_empty_binary,
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

export const mockSumFileMapConfig = {
  step: {
    init: mockSumFileMapConfig_step_init,
    createConfigFile: mockSumFileMapConfig_step_createConfigFile,
    downloadConfigFile: {
      forInit: mockSumFileMapConfig_step_downloadConfigFileForInit,
      downloaded: mockSumFileMapConfig_step_downloadConfigFileForDownloaded,
      updated: mockSumFileMapConfig_step_downloadConfigFileForUpdated,
    },
    prepareBaseSumFileMap: mockSumFileMapConfig_step_prepareBaseSumFileMap,
    scanExtraFile: {
      empty: mockSumFileMapConfig_step_scanExtraFile_empty,
      fullFiled: mockSumFileMapConfig_step_scanExtraFile_fullFiled,
    },
    buildFromConfig: {
      empty: mockSumFileMapConfig_step_buildFromConfig_empty,
      fullFiled: mockSumFileMapConfig_step_buildFromConfig_fullFiled,
    },
    cleanUp: {
      empty: mockSumFileMapConfig_step_cleanUp_empty,
      fullFiled: mockSumFileMapConfig_step_cleanUp_fullFiled,
    },
    cleanUpBeforeUpdate: {
      empty: mockSumFileMapConfig_step_cleanUpBeforeUpdate_empty,
      fullFiled: mockSumFileMapConfig_step_cleanUpBeforeUpdate_fullFiled,
    },
  },
};

const mockTemplateConfig_step_init: ConfigTemplateType = {
  projectCatalog: './test/mockTemplate/',
  templateCatalogName: 'templateCatalog',
  templateCatalogPath: './test/mockTemplate/templateCatalog',
  repositoryMapFileName: 'repositoryMap.json',
  repositoryMapFilePath: './test/mockTemplate/templateCatalog/repositoryMap.json',
  bumpVersion: true,
  isDebug: false,
  _: [],
};

const repositoryMapFileConfig_step_init: RepositoryMapFileConfigType = {
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

const repositoryMapFileConfig_step_bumpVersion: RepositoryMapFileConfigType = {
  ...repositoryMapFileConfig_step_init,
};
const repositoryMapFileConfig_step_cleanUpTemplate: RepositoryMapFileConfigType = {
  ...repositoryMapFileConfig_step_bumpVersion,
};
const repositoryMapFileConfig_step_prepareFileList: RepositoryMapFileConfigType = {
  ...repositoryMapFileConfig_step_cleanUpTemplate,
};
const repositoryMapFileConfig_step_scanProjectFolder: RepositoryMapFileConfigType = {
  ...repositoryMapFileConfig_step_prepareFileList,
};
const repositoryMapFileConfig_step_updateTemplateConfig: RepositoryMapFileConfigType = {
  ...repositoryMapFileConfig_step_scanProjectFolder,
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
  redOnlyFileList: [],
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
  init: {
    templateConfig: mockTemplateConfig_step_init,
    repositoryMapFileConfig: repositoryMapFileConfig_step_init,
  },
  bumpVersion: {
    templateConfig: mockTemplateConfig_step_bumpVersion,
    repositoryMapFileConfig: repositoryMapFileConfig_step_bumpVersion,
  },
  cleanUpTemplateEnd: {
    templateConfig: mockTemplateConfig_step_cleanUpTemplate,
    repositoryMapFileConfig: repositoryMapFileConfig_step_cleanUpTemplate,
  },
  cleanUpTemplate: mockTemplateConfig_step_cleanUpTemplate,
  prepareFileListEnd: {
    templateConfig: mockTemplateConfig_step_prepareFileList,
    repositoryMapFileConfig: repositoryMapFileConfig_step_prepareFileList,
  },
  prepareFileList: mockTemplateConfig_step_prepareFileList,
  scanProjectFolderEnd: {
    templateConfig: mockTemplateConfig_step_scanProjectFolder,
    repositoryMapFileConfig: repositoryMapFileConfig_step_scanProjectFolder,
  },
  scanProjectFolder: mockTemplateConfig_step_scanProjectFolder,
  updateTemplateConfigEnd: {
    templateConfig: mockTemplateConfig_step_updateTemplateConfig,
    repositoryMapFileConfig: repositoryMapFileConfig_step_updateTemplateConfig,
  },
  updateTemplateConfig: {
    templateConfig: mockTemplateConfig_step_updateTemplateConfig,
    repositoryMapFileConfig: repositoryMapFileConfigType_step_updateTemplateConfig,
  },
  formatJsonWithPrettier: mockTemplateConfig_step_formatJsonWithPrettier,
};
