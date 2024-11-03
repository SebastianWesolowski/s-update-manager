import { getProjectTestData } from './__tests__/getTestData';
import { cleanUpProjectCatalog, FileToCreateType, setupTestFiles } from './__tests__/prepareFileForTests';
import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSumFileMapConfig } from '@/feature/__tests__/const';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { ConfigType } from '@/feature/config/types';
import { prepareBaseSumFileMap } from '@/feature/prepareBaseFile';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';

describe('prepareBaseSumFileMap', () => {
  describe('context mock', () => {
    let config: ConfigType;
    let sumFileMapConfig: FileMapConfig;

    beforeEach(async () => {
      config = {
        templateCatalogName: 'templateCatalog',
        sumCatalog: './mock/mockProject/.sum/',
        sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
        availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
        availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
        templateVersion: undefined,
        sumFileMapConfigFileName: 'repositoryMap.json',
        sumFileMapConfig: './mock/mockProject/.sum/repositoryMap.json',
        projectCatalog: './mock/mockProject/',
        temporaryFolder: './mock/mockProject/.sum/temporary/',
        sumConfigFileName: '.sum.config.json',
        sumConfigFilePath: './mock/mockProject/.sum.config.json',
        remoteFileMapURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
        isDebug: true,
        _: [],
      };

      sumFileMapConfig = {
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
        createdFileMap: [],
      };

      await cleanUpProjectCatalog('mock');

      const FileToCreate: FileToCreateType[] = [
        {
          filePath: config.sumConfigFilePath,
          content: JSON.stringify(sumFileMapConfig),
        },
      ];
      await setupTestFiles(FileToCreate, config.isDebug);
    });

    afterEach(async () => {
      await cleanUpProjectCatalog('mock');
    });

    it('should return correct content', async () => {
      const dataToTest = await getProjectTestData(config, () => prepareBaseSumFileMap(config));

      expect({ ...dataToTest }).toStrictEqual({
        config: {
          templateCatalogName: 'templateCatalog',
          sumCatalog: './mock/mockProject/.sum/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          templateVersion: undefined,
          sumFileMapConfigFileName: 'repositoryMap.json',
          sumFileMapConfig: './mock/mockProject/.sum/repositoryMap.json',
          projectCatalog: './mock/mockProject/',
          temporaryFolder: './mock/mockProject/.sum/temporary/',
          sumConfigFileName: '.sum.config.json',
          sumConfigFilePath: './mock/mockProject/.sum.config.json',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate/templateCatalog/repositoryMap.json',
          remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
          isDebug: true,
          _: [],
        },
        sumFileMapConfig: {},
        allFiles: [
          './mock/mockProject/.gitignore',
          './mock/mockProject/.sum.config.json',
          './mock/mockProject/README.md',
          './mock/mockProject/package.json',
          './mock/mockProject/tools/addDependency.js',
          './mock/mockProject/tools/addModuleType.js',
          './mock/mockProject/tools/test-new.sh',
          './mock/mockProject/tools/test.sh',
          './mock/mockProject/tools/upload.sh',
          './mock/mockProject/tsconfig.json',
          './mock/mockProject/yarn.lock',
        ],
        sumConfigFileContent: {
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
          createdFileMap: [],
        },
        sumFileMapConfigContent: null,
      });
    });

    it('should return correct content with binaryfiles', async () => {
      config = {
        templateCatalogName: 'templateCatalog',
        sumCatalog: './mock/mockProjectWithImage/.sum/',
        sUpdaterVersion: '^1.0.0-dev.28',
        availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
        availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
        templateVersion: '1.0.0',
        sumFileMapConfigFileName: 'repositoryMap.json',
        sumFileMapConfig: './mock/mockProjectWithImage/.sum/repositoryMap.json',
        projectCatalog: './mock/mockProjectWithImage/',
        temporaryFolder: './mock/mockProjectWithImage/.sum/temporary/',
        sumConfigFileName: '.sum.config.json',
        sumConfigFilePath: './mock/mockProjectWithImage/.sum.config.json',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateWithImageWithConfig',
        remoteRepository:
          'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateWithImageWithConfig',
        remoteFileMapURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateWithImageWithConfig/templateCatalog/repositoryMap.json',
        isDebug: true,
        _: [],
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
        createdFileMap: [],
        sumFileMap: {},
      } as ConfigType;

      sumFileMapConfig = {
        projectCatalog: './mock/mockTemplateWithImageWithConfig',
        templateCatalogName: 'templateCatalog',
        templateCatalogPath: './mock/mockTemplateWithImageWithConfig/templateCatalog',
        repositoryMapFileName: 'repositoryMap.json',
        repositoryMapFilePath: './mock/mockTemplateWithImageWithConfig/templateCatalog/repositoryMap.json',
        bumpVersion: true,
        isDebug: false,
        _: [],
        templateVersion: '1.0.0',
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
        createdFileMap: [],
        sumFileMap: {},
      } as FileMapConfig;

      await cleanUpProjectCatalog('mock', 'prepareBaseFile', 'mockProjectWithImage');

      const FileToCreate: FileToCreateType[] = [
        {
          filePath: config.sumConfigFilePath,
          content: JSON.stringify(sumFileMapConfig),
        },
      ];
      await setupTestFiles(FileToCreate, config.isDebug);

      const dataToTest = await getProjectTestData(config, () => prepareBaseSumFileMap(config));

      expect({ ...dataToTest }).toStrictEqual({
        config: {
          templateCatalogName: 'templateCatalog',
          sumCatalog: './mock/mockProjectWithImage/.sum/',
          sUpdaterVersion: '^1.0.0-dev.28',
          availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          templateVersion: '1.0.0',
          sumFileMapConfigFileName: 'repositoryMap.json',
          sumFileMapConfig: './mock/mockProjectWithImage/.sum/repositoryMap.json',
          projectCatalog: './mock/mockProjectWithImage/',
          temporaryFolder: './mock/mockProjectWithImage/.sum/temporary/',
          sumConfigFileName: '.sum.config.json',
          sumConfigFilePath: './mock/mockProjectWithImage/.sum.config.json',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateWithImageWithConfig',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateWithImageWithConfig',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateWithImageWithConfig/templateCatalog/repositoryMap.json',
          isDebug: true,
          _: [],
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
          createdFileMap: [],
          sumFileMap: {},
        },
        sumFileMapConfig: {},
        // sumFileMapConfig: {
        //   projectCatalog: './mock/mockTemplateWithImageWithConfig',
        //   templateCatalogName: 'templateCatalog',
        //   templateCatalogPath: './mock/mockTemplateWithImageWithConfig/templateCatalog',
        //   repositoryMapFileName: 'repositoryMap.json',
        //   repositoryMapFilePath: './mock/mockTemplateWithImageWithConfig/templateCatalog/repositoryMap.json',
        //   bumpVersion: true,
        //   isDebug: false,
        //   _: [],
        //   templateVersion: '1.0.0',
        //   fileMap: [
        //     'templateCatalog/.gitignore-default.md',
        //     'templateCatalog/package.json-default.md',
        //     'templateCatalog/tsconfig.json-default.md',
        //     'templateCatalog/yarn.lock-default.md',
        //   ],
        //   templateFileList: [
        //     './.gitignore',
        //     './package.json',
        //     './srcReadme/heroImageReposytory.png',
        //     './tsconfig.json',
        //     './yarn.lock',
        //   ],
        //   rootPathFileList: [
        //     './mock/mockTemplateWithImageWithConfig/.gitignore',
        //     './mock/mockTemplateWithImageWithConfig/package.json',
        //     './mock/mockTemplateWithImageWithConfig/tsconfig.json',
        //     './mock/mockTemplateWithImageWithConfig/yarn.lock',
        //   ],
        //   redOnlyFileList: ['./srcReadme/heroImageReposytory.png'],
        //   createdFileMap: [],
        //   sumFileMap: {},
        //   // sumFileMap: {
        //   //   '.gitignore': {
        //   //     _: {
        //   //       SUMKeySuffix: '_',
        //   //       isCreated: false,
        //   //       path: './mock/mockProjectWithImage/.gitignore',
        //   //       realFilePath: '.gitignore',
        //   //       realPath: './mock/mockProjectWithImage/.gitignore',
        //   //       templateVersion: '1.0.0',
        //   //     },
        //   //     defaultFile: {
        //   //       SUMKeySuffix: 'defaultFile',
        //   //       isCreated: false,
        //   //       path: './mock/mockProjectWithImage/.sum/templateCatalog/.gitignore-default.md',
        //   //       realFilePath: '.gitignore',
        //   //       realPath: './mock/mockProjectWithImage/.gitignore',
        //   //       templateVersion: '1.0.0',
        //   //       SUMSuffixFileName: 'templateCatalog/.gitignore-default.md',
        //   //     },
        //   //   },
        //   //   'package.json': {
        //   //     _: {
        //   //       SUMKeySuffix: '_',
        //   //       isCreated: false,
        //   //       path: './mock/mockProjectWithImage/package.json',
        //   //       realFilePath: 'package.json',
        //   //       realPath: './mock/mockProjectWithImage/package.json',
        //   //       templateVersion: '1.0.0',
        //   //     },
        //   //     defaultFile: {
        //   //       SUMKeySuffix: 'defaultFile',
        //   //       isCreated: false,
        //   //       path: './mock/mockProjectWithImage/.sum/templateCatalog/package.json-default.md',
        //   //       realFilePath: 'package.json',
        //   //       realPath: './mock/mockProjectWithImage/package.json',
        //   //       templateVersion: '1.0.0',
        //   //       SUMSuffixFileName: 'templateCatalog/package.json-default.md',
        //   //     },
        //   //   },
        //   //   'tsconfig.json': {
        //   //     _: {
        //   //       SUMKeySuffix: '_',
        //   //       isCreated: false,
        //   //       path: './mock/mockProjectWithImage/tsconfig.json',
        //   //       realFilePath: 'tsconfig.json',
        //   //       realPath: './mock/mockProjectWithImage/tsconfig.json',
        //   //       templateVersion: '1.0.0',
        //   //     },
        //   //     defaultFile: {
        //   //       SUMKeySuffix: 'defaultFile',
        //   //       isCreated: false,
        //   //       path: './mock/mockProjectWithImage/.sum/templateCatalog/tsconfig.json-default.md',
        //   //       realFilePath: 'tsconfig.json',
        //   //       realPath: './mock/mockProjectWithImage/tsconfig.json',
        //   //       templateVersion: '1.0.0',
        //   //       SUMSuffixFileName: 'templateCatalog/tsconfig.json-default.md',
        //   //     },
        //   //   },
        //   //   'yarn.lock': {
        //   //     _: {
        //   //       SUMKeySuffix: '_',
        //   //       isCreated: false,
        //   //       path: './mock/mockProjectWithImage/yarn.lock',
        //   //       realFilePath: 'yarn.lock',
        //   //       realPath: './mock/mockProjectWithImage/yarn.lock',
        //   //       templateVersion: '1.0.0',
        //   //     },
        //   //     defaultFile: {
        //   //       SUMKeySuffix: 'defaultFile',
        //   //       isCreated: false,
        //   //       path: './mock/mockProjectWithImage/.sum/templateCatalog/yarn.lock-default.md',
        //   //       realFilePath: 'yarn.lock',
        //   //       realPath: './mock/mockProjectWithImage/yarn.lock',
        //   //       templateVersion: '1.0.0',
        //   //       SUMSuffixFileName: 'templateCatalog/yarn.lock-default.md',
        //   //     },
        //   //   },
        //   // },
        // },
        allFiles: [
          './mock/mockProjectWithImage/.gitignore',
          './mock/mockProjectWithImage/.sum.config.json',
          './mock/mockProjectWithImage/README.md',
          './mock/mockProjectWithImage/package.json',
          './mock/mockProjectWithImage/tools/addDependency.js',
          './mock/mockProjectWithImage/tools/addModuleType.js',
          './mock/mockProjectWithImage/tools/test-new.sh',
          './mock/mockProjectWithImage/tools/test.sh',
          './mock/mockProjectWithImage/tools/upload.sh',
          './mock/mockProjectWithImage/tsconfig.json',
          './mock/mockProjectWithImage/yarn.lock',
        ],
        sumConfigFileContent: {
          _: [],
          bumpVersion: true,
          createdFileMap: [],
          fileMap: [
            'templateCatalog/.gitignore-default.md',
            'templateCatalog/package.json-default.md',
            'templateCatalog/tsconfig.json-default.md',
            'templateCatalog/yarn.lock-default.md',
          ],
          isDebug: false,
          projectCatalog: './mock/mockTemplateWithImageWithConfig',
          redOnlyFileList: ['./srcReadme/heroImageReposytory.png'],
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './mock/mockTemplateWithImageWithConfig/templateCatalog/repositoryMap.json',
          rootPathFileList: [
            './mock/mockTemplateWithImageWithConfig/.gitignore',
            './mock/mockTemplateWithImageWithConfig/package.json',
            './mock/mockTemplateWithImageWithConfig/tsconfig.json',
            './mock/mockTemplateWithImageWithConfig/yarn.lock',
          ],
          sumFileMap: {},
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
        sumFileMapConfigContent: null,
      });
    });
  });

  describe('context test', () => {
    let config: ConfigType;
    let sumFileMapConfig: FileMapConfig;

    beforeEach(async () => {
      config = { ...mockConfig.step.prepareBaseSumFileMap };
      sumFileMapConfig = { ...mockSumFileMapConfig.step.prepareBaseSumFileMap };

      await cleanUpFiles({
        sumCatalog: config.sumCatalog,
        directoryPath: config.projectCatalog,
        isDebug: config.isDebug,
      });
    });

    afterEach(async () => {
      await cleanUpFiles({
        sumCatalog: config.sumCatalog,
        directoryPath: config.projectCatalog,
        isDebug: config.isDebug,
      });
    });

    it('should return correct content', async () => {
      await createFile({
        filePath: config.sumConfigFilePath,
        content: JSON.stringify(config),
      });
      await createFile({
        filePath: config.sumFileMapConfig,
        content: JSON.stringify(sumFileMapConfig),
      });

      const result = await prepareBaseSumFileMap(config);
      const allFiles = await searchFilesInDirectory({
        directoryPath: config.projectCatalog,
        excludedFileNames: ['.DS_Store'],
        excludedPhrases: ['.backup'],
      });
      expect({ ...result, allFiles }).toStrictEqual({
        config: mockConfig.step.createConfigFile,
        sumFileMapConfig: mockSumFileMapConfig.step.prepareBaseSumFileMap,
        allFiles: ['./test/mockProject/.sum/repositoryMap.json', './test/mockProject/.sum.config.json'],
      });
    });
  });
});
