import { getProjectTestData } from './__tests__/getTestData';
import { cleanUpProjectCatalog, FileToCreateType, setupTestFiles } from './__tests__/prepareFileForTests';
import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig, mockSnpFileMapConfig } from '@/feature/__tests__/const';
import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { ConfigType } from '@/feature/config/types';
import { downloadConfig } from '@/feature/downloadConfig';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';
describe('downloadConfig', () => {
  describe('context mock', () => {
    let config: ConfigType;
    let snpConfigFile: ConfigType;

    beforeEach(async () => {
      config = {
        templateCatalogName: 'templateCatalog',
        snpCatalog: './mock/mockProject/.snp/',
        sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
        availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
        availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
        templateVersion: undefined,
        REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
        snpFileMapConfig: './mock/mockProject/.snp/repositoryMap.json',
        projectCatalog: './mock/mockProject/',
        temporaryFolder: './mock/mockProject/.snp/temporary/',
        snpConfigFileName: 'snp.config.json',
        snpConfigFile: './mock/mockProject/.snp/snp.config.json',
        remoteFileMapURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
        isDebug: true,
        _: [],
      };

      snpConfigFile = {
        templateCatalogName: 'templateCatalog',
        snpCatalog: './mock/mockProject/.snp/',
        sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
        availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
        availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
        REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
        snpFileMapConfig: './mock/mockProject/.snp/repositoryMap.json',
        projectCatalog: './mock/mockProject/',
        temporaryFolder: './mock/mockProject/.snp/temporary/',
        snpConfigFileName: 'snp.config.json',
        snpConfigFile: './mock/mockProject/.snp/snp.config.json',
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
          filePath: config.snpConfigFile,
          content: JSON.stringify(snpConfigFile),
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

      snpConfigFile = {
        ...config,
        remoteFileMapURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate',
      };

      const FileToCreate: FileToCreateType[] = [
        {
          filePath: config.snpConfigFile,
          content: JSON.stringify(snpConfigFile),
        },
      ];
      await setupTestFiles(FileToCreate, config.isDebug);

      const dataToTest = await getProjectTestData(config, () => downloadConfig(config));

      expect({ ...dataToTest }).toStrictEqual({
        config: {
          templateCatalogName: 'templateCatalog',
          snpCatalog: './mock/mockProject/.snp/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          templateVersion: undefined,
          REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
          snpFileMapConfig: './mock/mockProject/.snp/repositoryMap.json',
          projectCatalog: './mock/mockProject/',
          temporaryFolder: './mock/mockProject/.snp/temporary/',
          snpConfigFileName: 'snp.config.json',
          snpConfigFile: './mock/mockProject/.snp/snp.config.json',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate/templateCatalog/repositoryMap.json',
          remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate',
          isDebug: true,
          _: [],
        },
        snpFileMapConfig: {
          createdFileMap: [],
          snpFileMap: {},
        },
        downloadContent: {},
        allFiles: [
          './mock/mockProject/.gitignore',
          './mock/mockProject/.snp/repositoryMap.json',
          './mock/mockProject/.snp/snp.config.json',
          './mock/mockProject/.snp/temporary/repositoryMap.json',
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
        snpConfigFileContent: {
          templateCatalogName: 'templateCatalog',
          snpCatalog: './mock/mockProject/.snp/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
          snpFileMapConfig: './mock/mockProject/.snp/repositoryMap.json',
          projectCatalog: './mock/mockProject/',
          temporaryFolder: './mock/mockProject/.snp/temporary/',
          snpConfigFileName: 'snp.config.json',
          snpConfigFile: './mock/mockProject/.snp/snp.config.json',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate/templateCatalog/repositoryMap.json',
          remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplate',
          isDebug: true,
          _: [],
        },
        snpFileMapConfigContent: {
          createdFileMap: [],
          snpFileMap: {},
        },
      });
    });
    it('mockProject and mockTemplateToUpdate should return mock file', async () => {
      const dataToTest = await getProjectTestData(config, () => downloadConfig(config));

      expect({ ...dataToTest }).toStrictEqual({
        config: {
          templateCatalogName: 'templateCatalog',
          snpCatalog: './mock/mockProject/.snp/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          templateVersion: '1.0.0',
          REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
          snpFileMapConfig: './mock/mockProject/.snp/repositoryMap.json',
          projectCatalog: './mock/mockProject/',
          temporaryFolder: './mock/mockProject/.snp/temporary/',
          snpConfigFileName: 'snp.config.json',
          snpConfigFile: './mock/mockProject/.snp/snp.config.json',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          isDebug: true,
          _: [],
        },
        snpFileMapConfig: {
          createdFileMap: [],
          snpFileMap: {},
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
          './mock/mockProject/.snp/repositoryMap.json',
          './mock/mockProject/.snp/snp.config.json',
          './mock/mockProject/.snp/temporary/repositoryMap.json',
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
        snpConfigFileContent: {
          templateCatalogName: 'templateCatalog',
          snpCatalog: './mock/mockProject/.snp/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
          snpFileMapConfig: './mock/mockProject/.snp/repositoryMap.json',
          projectCatalog: './mock/mockProject/',
          temporaryFolder: './mock/mockProject/.snp/temporary/',
          snpConfigFileName: 'snp.config.json',
          snpConfigFile: './mock/mockProject/.snp/snp.config.json',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          isDebug: true,
          _: [],
        },
        snpFileMapConfigContent: {
          projectCatalog: './',
          snpFileMap: {},
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
          filePath: config.snpFileMapConfig,
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
            snpFileMap: {},
          }),
        },
      ];
      await setupTestFiles(FileToCreate, config.isDebug);

      const dataToTest = await getProjectTestData(config, () => downloadConfig(config));

      expect({ ...dataToTest }).toStrictEqual({
        config: {
          templateCatalogName: 'templateCatalog',
          snpCatalog: './mock/mockProject/.snp/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          templateVersion: '1.0.0',
          REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
          snpFileMapConfig: './mock/mockProject/.snp/repositoryMap.json',
          projectCatalog: './mock/mockProject/',
          temporaryFolder: './mock/mockProject/.snp/temporary/',
          snpConfigFileName: 'snp.config.json',
          snpConfigFile: './mock/mockProject/.snp/snp.config.json',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          isDebug: true,
          _: [],
        },
        snpFileMapConfig: {
          createdFileMap: [],
          snpFileMap: {},
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
          './mock/mockProject/.snp/repositoryMap.json',
          './mock/mockProject/.snp/snp.config.json',
          './mock/mockProject/.snp/temporary/repositoryMap.json',
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
        snpConfigFileContent: {
          templateCatalogName: 'templateCatalog',
          snpCatalog: './mock/mockProject/.snp/',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
          availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
          snpFileMapConfig: './mock/mockProject/.snp/repositoryMap.json',
          projectCatalog: './mock/mockProject/',
          temporaryFolder: './mock/mockProject/.snp/temporary/',
          snpConfigFileName: 'snp.config.json',
          snpConfigFile: './mock/mockProject/.snp/snp.config.json',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          isDebug: true,
          _: [],
        },
        snpFileMapConfigContent: {
          projectCatalog: './',
          snpFileMap: {},
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
    let snpFileMapConfig: FileMapConfig;

    beforeEach(async () => {
      config = { ...mockConfig.step.createConfigFile };
      snpFileMapConfig = { ...mockSnpFileMapConfig.step.createConfigFile };

      await cleanUpFiles({
        snpCatalog: config.snpCatalog,
        directoryPath: config.projectCatalog,
        isDebug: config.isDebug,
      });
    });

    afterEach(async () => {
      await cleanUpFiles({
        snpCatalog: config.snpCatalog,
        directoryPath: config.projectCatalog,
        isDebug: config.isDebug,
      });
    });

    it('should return correct empty proje content with only snpConfigFile', async () => {
      await createFile({
        filePath: config.snpConfigFile,
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
        snpFileMapConfig: {
          createdFileMap: [],
          snpFileMap: {},
        },
        allFiles: [
          './test/mockProject/.snp/repositoryMap.json',
          './test/mockProject/.snp/snp.config.json',
          './test/mockProject/.snp/temporary/repositoryMap.json',
        ],
      });
    });

    it('should return correct content with both configs file', async () => {
      await createFile({
        filePath: config.snpConfigFile,
        content: JSON.stringify(config),
      });

      await createFile({
        filePath: config.snpFileMapConfig,
        content: JSON.stringify(snpFileMapConfig),
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
        snpFileMapConfig: mockSnpFileMapConfig.step.downloadConfigFile.forInit,
        allFiles: [
          './test/mockProject/.snp/repositoryMap.json',
          './test/mockProject/.snp/snp.config.json',
          './test/mockProject/.snp/temporary/repositoryMap.json',
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
          filePath: config.snpConfigFile,
          content: JSON.stringify(config),
        },
        {
          filePath: config.snpFileMapConfig,
          content: JSON.stringify(snpFileMapConfig),
        },
      ];
      await setupTestFiles(FileToCreate, config.isDebug);

      const dataToTest = await getProjectTestData(config, () => downloadConfig(config));

      expect({ ...dataToTest }).toStrictEqual({
        config: {
          REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
          _: [],
          availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
          isDebug: false,
          projectCatalog: './test/mockProject',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          templateVersion: '1.0.0',
          snpCatalog: './test/mockProject/.snp/',
          snpConfigFile: './test/mockProject/.snp/snp.config.json',
          snpConfigFileName: 'snp.config.json',
          snpFileMapConfig: './test/mockProject/.snp/repositoryMap.json',
          templateCatalogName: 'templateCatalog',
          temporaryFolder: './test/mockProject/.snp/temporary/',
        },
        snpFileMapConfig: {
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
          snpFileMap: {},
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
          './test/mockProject/.snp/repositoryMap.json',
          './test/mockProject/.snp/snp.config.json',
          './test/mockProject/.snp/temporary/repositoryMap.json',
        ],
        snpConfigFileContent: {
          REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
          _: [],
          availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
          isDebug: false,
          projectCatalog: './test/mockProject',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json',
          remoteRepository:
            'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate',
          templateVersion: '1.0.0',
          snpCatalog: './test/mockProject/.snp/',
          snpConfigFile: './test/mockProject/.snp/snp.config.json',
          snpConfigFileName: 'snp.config.json',
          snpFileMapConfig: './test/mockProject/.snp/repositoryMap.json',
          templateCatalogName: 'templateCatalog',
          temporaryFolder: './test/mockProject/.snp/temporary/',
        },
        snpFileMapConfigContent: {
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
          snpFileMap: {},
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
