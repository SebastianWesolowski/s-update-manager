import { getProjectTestData } from './__tests__/getTestData';
import { cleanUpProjectCatalog, FileToCreateType, setupTestFiles } from './__tests__/prepareFileForTests';
import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSumFileMapConfig } from '@/feature/__tests__/const';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { ConfigType } from '@/feature/config/types';
import { downloadConfig } from '@/feature/downloadConfig';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';
describe('downloadConfig', () => {
  describe('context mock', () => {
    let config: ConfigType;
    let sumConfigFilePath: ConfigType;

    beforeEach(async () => {
      config = {
        sumIgnoreFilePath: './mock/mockProject/.sumignore',
        sumIgnoreFileName: '.sumignore',
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
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
        isDebug: true,
        _: [],
      };

      sumConfigFilePath = {
        sumIgnoreFilePath: './mock/mockProject/.sumignore',
        sumIgnoreFileName: '.sumignore',
        templateCatalogName: 'templateCatalog',
        sumCatalog: './mock/mockProject/.sum/',
        sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
        availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
        availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
        sumFileMapConfigFileName: 'repositoryMap.json',
        sumFileMapConfig: './mock/mockProject/.sum/repositoryMap.json',
        projectCatalog: './mock/mockProject/',
        temporaryFolder: './mock/mockProject/.sum/temporary/',
        sumConfigFileName: '.sum.config.json',
        sumConfigFilePath: './mock/mockProject/.sum.config.json',
        remoteFileMapURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
        isDebug: true,
        _: [],
      };

      await cleanUpProjectCatalog('mock');

      const FileToCreate: FileToCreateType[] = [
        {
          filePath: config.sumConfigFilePath,
          content: JSON.stringify(sumConfigFilePath),
        },
      ];
      await setupTestFiles(FileToCreate, config.isDebug);
    });

    afterEach(async () => {
      await cleanUpProjectCatalog('mock');
    });

    it('mockProject empty project', async () => {
      config = {
        ...config,
        remoteFileMapURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate',
      };

      sumConfigFilePath = {
        ...config,
        remoteFileMapURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate',
      };

      const FileToCreate: FileToCreateType[] = [
        {
          filePath: config.sumConfigFilePath,
          content: JSON.stringify(sumConfigFilePath),
        },
      ];
      await setupTestFiles(FileToCreate, config.isDebug);

      const dataToTest = await getProjectTestData(config, () => downloadConfig(config));

      expect({ ...dataToTest }).toStrictEqual({
        config: {
          sumIgnoreFilePath: './mock/mockProject/.sumignore',
          sumIgnoreFileName: '.sumignore',
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
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate',
          isDebug: true,
          _: [],
        },
        sumFileMapConfig: {
          createdFileMap: [],
          sumFileMap: {},
        },
        downloadContent: {},
        allFiles: [
          './mock/mockProject/.gitignore',
          './mock/mockProject/.sum/repositoryMap.json',
          './mock/mockProject/.sum/temporary/repositoryMap.json',
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
          sumIgnoreFilePath: './mock/mockProject/.sumignore',
          sumIgnoreFileName: '.sumignore',
          templateCatalogName: 'templateCatalog',
          sumCatalog: './mock/mockProject/.sum/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
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
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate',
          isDebug: true,
          _: [],
        },
        sumFileMapConfigContent: {
          createdFileMap: [],
          sumFileMap: {},
        },
      });
    });
    it('mockProject and mockTemplateToUpdate should return mock file', async () => {
      const dataToTest = await getProjectTestData(config, () => downloadConfig(config));

      expect({ ...dataToTest }).toStrictEqual({
        config: {
          sumIgnoreFilePath: './mock/mockProject/.sumignore',
          sumIgnoreFileName: '.sumignore',
          templateCatalogName: 'templateCatalog',
          sumCatalog: './mock/mockProject/.sum/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          templateVersion: '1.0.0',
          sumFileMapConfigFileName: 'repositoryMap.json',
          sumFileMapConfig: './mock/mockProject/.sum/repositoryMap.json',
          projectCatalog: './mock/mockProject/',
          temporaryFolder: './mock/mockProject/.sum/temporary/',
          sumConfigFileName: '.sum.config.json',
          sumConfigFilePath: './mock/mockProject/.sum.config.json',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          isDebug: true,
          _: [],
        },
        sumFileMapConfig: {
          createdFileMap: [],
          sumFileMap: {},
          projectCatalog: './',
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './templateCatalog/repositoryMap.json',
          bumpVersion: true,
          isDebug: false,
          _: [],
          templateVersion: '1.0.0',
          fileMap: [
            'templateCatalog/.gitignore-default.md',
            'templateCatalog/package.json-default.md',
            'templateCatalog/README.md-default.md',
            'templateCatalog/tools/test-new.sh-default.md',
            'templateCatalog/tools/test.sh-default.md',
            'templateCatalog/tsconfig.json-default.md',
            'templateCatalog/yarn.lock-default.md',
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
          rootPathFileList: [
            './mock/mockTemplateToUpdate/.gitignore',
            './mock/mockTemplateToUpdate/package.json',
            './mock/mockTemplateToUpdate/README.md',
            './mock/mockTemplateToUpdate/tools/test-new.sh',
            './mock/mockTemplateToUpdate/tools/test.sh',
            './mock/mockTemplateToUpdate/tsconfig.json',
            './mock/mockTemplateToUpdate/yarn.lock',
          ],
        },

        downloadContent: {
          projectCatalog: './',
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './templateCatalog/repositoryMap.json',
          bumpVersion: true,
          isDebug: false,
          _: [],
          templateVersion: '1.0.0',
          fileMap: [
            'templateCatalog/.gitignore-default.md',
            'templateCatalog/package.json-default.md',
            'templateCatalog/README.md-default.md',
            'templateCatalog/tools/test-new.sh-default.md',
            'templateCatalog/tools/test.sh-default.md',
            'templateCatalog/tsconfig.json-default.md',
            'templateCatalog/yarn.lock-default.md',
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
          rootPathFileList: [
            './mock/mockTemplateToUpdate/.gitignore',
            './mock/mockTemplateToUpdate/package.json',
            './mock/mockTemplateToUpdate/README.md',
            './mock/mockTemplateToUpdate/tools/test-new.sh',
            './mock/mockTemplateToUpdate/tools/test.sh',
            './mock/mockTemplateToUpdate/tsconfig.json',
            './mock/mockTemplateToUpdate/yarn.lock',
          ],
        },
        allFiles: [
          './mock/mockProject/.gitignore',
          './mock/mockProject/.sum/repositoryMap.json',
          './mock/mockProject/.sum/temporary/repositoryMap.json',
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
          sumIgnoreFilePath: './mock/mockProject/.sumignore',
          sumIgnoreFileName: '.sumignore',
          templateCatalogName: 'templateCatalog',
          sumCatalog: './mock/mockProject/.sum/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          sumFileMapConfigFileName: 'repositoryMap.json',
          sumFileMapConfig: './mock/mockProject/.sum/repositoryMap.json',
          projectCatalog: './mock/mockProject/',
          temporaryFolder: './mock/mockProject/.sum/temporary/',
          sumConfigFileName: '.sum.config.json',
          sumConfigFilePath: './mock/mockProject/.sum.config.json',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          isDebug: true,
          _: [],
        },
        sumFileMapConfigContent: {
          projectCatalog: './',
          sumFileMap: {},
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './templateCatalog/repositoryMap.json',
          bumpVersion: true,
          isDebug: false,
          _: [],
          templateVersion: '1.0.0',
          createdFileMap: [],
          fileMap: [
            'templateCatalog/.gitignore-default.md',
            'templateCatalog/package.json-default.md',
            'templateCatalog/README.md-default.md',
            'templateCatalog/tools/test-new.sh-default.md',
            'templateCatalog/tools/test.sh-default.md',
            'templateCatalog/tsconfig.json-default.md',
            'templateCatalog/yarn.lock-default.md',
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
          rootPathFileList: [
            './mock/mockTemplateToUpdate/.gitignore',
            './mock/mockTemplateToUpdate/package.json',
            './mock/mockTemplateToUpdate/README.md',
            './mock/mockTemplateToUpdate/tools/test-new.sh',
            './mock/mockTemplateToUpdate/tools/test.sh',
            './mock/mockTemplateToUpdate/tsconfig.json',
            './mock/mockTemplateToUpdate/yarn.lock',
          ],
        },
      });
    });

    it('should return mock file when repositoryMap exist', async () => {
      const FileToCreate: FileToCreateType[] = [
        {
          filePath: config.sumFileMapConfig,
          content: JSON.stringify({
            templateVersion: '1.0.0',
            fileMap: [
              'templateCatalog/.gitignore-default.md',
              'templateCatalog/package.json-default.md',
              'templateCatalog/tools/newTest.sh-default.md',
              'templateCatalog/tools/test.sh-default.md',
              'templateCatalog/tsconfig.json-default.md',
              'templateCatalog/yarn.lock-default.md',
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
            rootPathFileList: [
              './mock/mockProject/.gitignore',
              './mock/mockProject/package.json',
              './mock/mockProject/README.md',
              './mock/mockProject/tools/test-new.sh',
              './mock/mockProject/tools/test.sh',
              './mock/mockProject/tsconfig.json',
              './mock/mockProject/yarn.lock',
            ],
            createdFileMap: [],
            sumFileMap: {},
          }),
        },
      ];
      await setupTestFiles(FileToCreate, config.isDebug);

      const dataToTest = await getProjectTestData(config, () => downloadConfig(config));

      expect({ ...dataToTest }).toStrictEqual({
        config: {
          sumIgnoreFilePath: './mock/mockProject/.sumignore',
          sumIgnoreFileName: '.sumignore',
          templateCatalogName: 'templateCatalog',
          sumCatalog: './mock/mockProject/.sum/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          templateVersion: '1.0.0',
          sumFileMapConfigFileName: 'repositoryMap.json',
          sumFileMapConfig: './mock/mockProject/.sum/repositoryMap.json',
          projectCatalog: './mock/mockProject/',
          temporaryFolder: './mock/mockProject/.sum/temporary/',
          sumConfigFileName: '.sum.config.json',
          sumConfigFilePath: './mock/mockProject/.sum.config.json',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          isDebug: true,
          _: [],
        },
        sumFileMapConfig: {
          createdFileMap: [],
          sumFileMap: {},
          projectCatalog: './',
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './templateCatalog/repositoryMap.json',
          bumpVersion: true,
          isDebug: false,
          _: [],
          templateVersion: '1.0.0',
          fileMap: [
            'templateCatalog/.gitignore-default.md',
            'templateCatalog/package.json-default.md',
            'templateCatalog/README.md-default.md',
            'templateCatalog/tools/test-new.sh-default.md',
            'templateCatalog/tools/test.sh-default.md',
            'templateCatalog/tsconfig.json-default.md',
            'templateCatalog/yarn.lock-default.md',
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
          rootPathFileList: [
            './mock/mockTemplateToUpdate/.gitignore',
            './mock/mockTemplateToUpdate/package.json',
            './mock/mockTemplateToUpdate/README.md',
            './mock/mockTemplateToUpdate/tools/test-new.sh',
            './mock/mockTemplateToUpdate/tools/test.sh',
            './mock/mockTemplateToUpdate/tsconfig.json',
            './mock/mockTemplateToUpdate/yarn.lock',
          ],
        },

        downloadContent: {
          projectCatalog: './',
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './templateCatalog/repositoryMap.json',
          bumpVersion: true,
          isDebug: false,
          _: [],
          templateVersion: '1.0.0',
          fileMap: [
            'templateCatalog/.gitignore-default.md',
            'templateCatalog/package.json-default.md',
            'templateCatalog/README.md-default.md',
            'templateCatalog/tools/test-new.sh-default.md',
            'templateCatalog/tools/test.sh-default.md',
            'templateCatalog/tsconfig.json-default.md',
            'templateCatalog/yarn.lock-default.md',
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
          rootPathFileList: [
            './mock/mockTemplateToUpdate/.gitignore',
            './mock/mockTemplateToUpdate/package.json',
            './mock/mockTemplateToUpdate/README.md',
            './mock/mockTemplateToUpdate/tools/test-new.sh',
            './mock/mockTemplateToUpdate/tools/test.sh',
            './mock/mockTemplateToUpdate/tsconfig.json',
            './mock/mockTemplateToUpdate/yarn.lock',
          ],
        },
        allFiles: [
          './mock/mockProject/.gitignore',
          './mock/mockProject/.sum/repositoryMap.json',
          './mock/mockProject/.sum/temporary/repositoryMap.json',
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
          sumIgnoreFilePath: './mock/mockProject/.sumignore',
          sumIgnoreFileName: '.sumignore',
          templateCatalogName: 'templateCatalog',
          sumCatalog: './mock/mockProject/.sum/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          sumFileMapConfigFileName: 'repositoryMap.json',
          sumFileMapConfig: './mock/mockProject/.sum/repositoryMap.json',
          projectCatalog: './mock/mockProject/',
          temporaryFolder: './mock/mockProject/.sum/temporary/',
          sumConfigFileName: '.sum.config.json',
          sumConfigFilePath: './mock/mockProject/.sum.config.json',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          isDebug: true,
          _: [],
        },
        sumFileMapConfigContent: {
          projectCatalog: './',
          sumFileMap: {},
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './templateCatalog/repositoryMap.json',
          bumpVersion: true,
          isDebug: false,
          _: [],
          templateVersion: '1.0.0',
          createdFileMap: [],
          fileMap: [
            'templateCatalog/.gitignore-default.md',
            'templateCatalog/package.json-default.md',
            'templateCatalog/README.md-default.md',
            'templateCatalog/tools/test-new.sh-default.md',
            'templateCatalog/tools/test.sh-default.md',
            'templateCatalog/tsconfig.json-default.md',
            'templateCatalog/yarn.lock-default.md',
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
          rootPathFileList: [
            './mock/mockTemplateToUpdate/.gitignore',
            './mock/mockTemplateToUpdate/package.json',
            './mock/mockTemplateToUpdate/README.md',
            './mock/mockTemplateToUpdate/tools/test-new.sh',
            './mock/mockTemplateToUpdate/tools/test.sh',
            './mock/mockTemplateToUpdate/tsconfig.json',
            './mock/mockTemplateToUpdate/yarn.lock',
          ],
        },
      });
    });
  });

  describe('context test', () => {
    let config: ConfigType;
    let sumFileMapConfig: FileMapConfig;

    beforeEach(async () => {
      config = { ...mockConfig.step.createConfigFile };
      sumFileMapConfig = { ...mockSumFileMapConfig.step.createConfigFile };

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

    it('should return correct empty proje content with only sumConfigFilePath', async () => {
      await createFile({
        filePath: config.sumConfigFilePath,
        content: JSON.stringify(config),
      });

      const result = await downloadConfig(config);
      const allFiles = await searchFilesInDirectory({
        directoryPath: config.projectCatalog,
        excludedFileNames: ['.DS_Store'],
        excludedPhrases: ['.backup'],
      });

      expect({ ...result, allFiles }).toStrictEqual({
        config: {
          ...mockConfig.step.downloadConfigFile.forInit,
          templateVersion: undefined,
        },
        downloadContent: {},
        sumFileMapConfig: {
          createdFileMap: [],
          sumFileMap: {},
        },
        allFiles: [
          './test/mockProject/.sum/repositoryMap.json',
          './test/mockProject/.sum/temporary/repositoryMap.json',
          './test/mockProject/.sum.config.json',
        ],
      });
    });

    it('should return correct content with both configs file', async () => {
      await createFile({
        filePath: config.sumConfigFilePath,
        content: JSON.stringify(config),
      });

      await createFile({
        filePath: config.sumFileMapConfig,
        content: JSON.stringify(sumFileMapConfig),
      });

      const result = await downloadConfig(config);
      const allFiles = await searchFilesInDirectory({
        directoryPath: config.projectCatalog,
        excludedFileNames: ['.DS_Store'],
        excludedPhrases: ['.backup'],
      });
      expect({ ...result, allFiles }).toStrictEqual({
        config: {
          ...mockConfig.step.downloadConfigFile.forInit,
        },
        downloadContent: {},
        sumFileMapConfig: mockSumFileMapConfig.step.downloadConfigFile.forInit,
        allFiles: [
          './test/mockProject/.sum/repositoryMap.json',
          './test/mockProject/.sum/temporary/repositoryMap.json',
          './test/mockProject/.sum.config.json',
        ],
      });
    });

    it('should return correct content with both configs file and fullfiled project', async () => {
      config = {
        ...config,
        remoteFileMapURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
      };

      const FileToCreate: FileToCreateType[] = [
        {
          filePath: config.sumConfigFilePath,
          content: JSON.stringify(config),
        },
        {
          filePath: config.sumFileMapConfig,
          content: JSON.stringify(sumFileMapConfig),
        },
      ];
      await setupTestFiles(FileToCreate, config.isDebug);

      const dataToTest = await getProjectTestData(config, () => downloadConfig(config));

      expect({ ...dataToTest }).toStrictEqual({
        config: {
          sumIgnoreFilePath: './test/mockProject/.sumignore',
          sumIgnoreFileName: '.sumignore',
          sumFileMapConfigFileName: 'repositoryMap.json',
          _: [],
          availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
          isDebug: false,
          projectCatalog: './test/mockProject',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          templateVersion: '1.0.0',
          sumCatalog: './test/mockProject/.sum/',
          sumConfigFilePath: './test/mockProject/.sum.config.json',
          sumConfigFileName: '.sum.config.json',
          sumFileMapConfig: './test/mockProject/.sum/repositoryMap.json',
          templateCatalogName: 'templateCatalog',
          temporaryFolder: './test/mockProject/.sum/temporary/',
        },
        sumFileMapConfig: {
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
            './mock/mockTemplateToUpdate/.gitignore',
            './mock/mockTemplateToUpdate/package.json',
            './mock/mockTemplateToUpdate/README.md',
            './mock/mockTemplateToUpdate/tools/test-new.sh',
            './mock/mockTemplateToUpdate/tools/test.sh',
            './mock/mockTemplateToUpdate/tsconfig.json',
            './mock/mockTemplateToUpdate/yarn.lock',
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
          templateVersion: '1.0.0',
          sumFileMap: {},
          createdFileMap: [],
          projectCatalog: './',
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './templateCatalog/repositoryMap.json',
          bumpVersion: true,
          isDebug: false,
          _: [],
        },
        downloadContent: {
          projectCatalog: './',
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './templateCatalog/repositoryMap.json',
          bumpVersion: true,
          isDebug: false,
          _: [],
          templateVersion: '1.0.0',
          fileMap: [
            'templateCatalog/.gitignore-default.md',
            'templateCatalog/package.json-default.md',
            'templateCatalog/README.md-default.md',
            'templateCatalog/tools/test-new.sh-default.md',
            'templateCatalog/tools/test.sh-default.md',
            'templateCatalog/tsconfig.json-default.md',
            'templateCatalog/yarn.lock-default.md',
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
          rootPathFileList: [
            './mock/mockTemplateToUpdate/.gitignore',
            './mock/mockTemplateToUpdate/package.json',
            './mock/mockTemplateToUpdate/README.md',
            './mock/mockTemplateToUpdate/tools/test-new.sh',
            './mock/mockTemplateToUpdate/tools/test.sh',
            './mock/mockTemplateToUpdate/tsconfig.json',
            './mock/mockTemplateToUpdate/yarn.lock',
          ],
        },
        allFiles: [
          './test/mockProject/.sum/repositoryMap.json',
          './test/mockProject/.sum/temporary/repositoryMap.json',
          './test/mockProject/.sum.config.json',
        ],
        sumConfigFileContent: {
          sumIgnoreFilePath: './test/mockProject/.sumignore',
          sumIgnoreFileName: '.sumignore',
          sumFileMapConfigFileName: 'repositoryMap.json',
          _: [],
          availableSUMKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          availableSUMSuffix: ['-default.md', '-custom.md', '-extend.md'],
          isDebug: false,
          projectCatalog: './test/mockProject',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          templateVersion: '1.0.0',
          sumCatalog: './test/mockProject/.sum/',
          sumConfigFilePath: './test/mockProject/.sum.config.json',
          sumConfigFileName: '.sum.config.json',
          sumFileMapConfig: './test/mockProject/.sum/repositoryMap.json',
          templateCatalogName: 'templateCatalog',
          temporaryFolder: './test/mockProject/.sum/temporary/',
        },
        sumFileMapConfigContent: {
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
            './mock/mockTemplateToUpdate/.gitignore',
            './mock/mockTemplateToUpdate/package.json',
            './mock/mockTemplateToUpdate/README.md',
            './mock/mockTemplateToUpdate/tools/test-new.sh',
            './mock/mockTemplateToUpdate/tools/test.sh',
            './mock/mockTemplateToUpdate/tsconfig.json',
            './mock/mockTemplateToUpdate/yarn.lock',
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
          templateVersion: '1.0.0',
          sumFileMap: {},
          createdFileMap: [],
          projectCatalog: './',
          templateCatalogName: 'templateCatalog',
          templateCatalogPath: './templateCatalog',
          repositoryMapFileName: 'repositoryMap.json',
          repositoryMapFilePath: './templateCatalog/repositoryMap.json',
          bumpVersion: true,
          isDebug: false,
          _: [],
        },
      });
    });
  });
});
