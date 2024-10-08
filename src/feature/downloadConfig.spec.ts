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
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/mockUpdatedTemplate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',

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
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/mockUpdatedTemplate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
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

    it('empty project', async () => {
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
    it('should return mock file', async () => {
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
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/mockUpdatedTemplate/templateCatalog/repositoryMap.json',
          remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
          isDebug: true,
          _: [],
        },
        snpFileMapConfig: {
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
            './tools/newTest.sh',
            './tools/test.sh',
            './tsconfig.json',
            './yarn.lock',
          ],
          rootPathFileList: [
            './.gitignore',
            './package.json',
            './tools/newTest.sh',
            './tools/test.sh',
            './tsconfig.json',
            './yarn.lock',
          ],
          createdFileMap: [],
          snpFileMap: {},
        },
        downloadContent: {
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
            './tools/newTest.sh',
            './tools/test.sh',
            './tsconfig.json',
            './yarn.lock',
          ],
          rootPathFileList: [
            './.gitignore',
            './package.json',
            './tools/newTest.sh',
            './tools/test.sh',
            './tsconfig.json',
            './yarn.lock',
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
          './mock/mockProject/tools/upload.sh',
          './mock/mockProject/tsconfig.json',
          './mock/mockProject/yarn.lock',
        ],
        snpConfigFileContent: {
          REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
          _: [],
          availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
          isDebug: true,
          projectCatalog: './mock/mockProject/',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/mockUpdatedTemplate/templateCatalog/repositoryMap.json',
          remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          snpCatalog: './mock/mockProject/.snp/',
          snpConfigFile: './mock/mockProject/.snp/snp.config.json',
          snpConfigFileName: 'snp.config.json',
          snpFileMapConfig: './mock/mockProject/.snp/repositoryMap.json',
          templateCatalogName: 'templateCatalog',
          temporaryFolder: './mock/mockProject/.snp/temporary/',
        },
        snpFileMapConfigContent: {
          createdFileMap: [],
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
          snpFileMap: {},
          templateFileList: [
            './.gitignore',
            './package.json',
            './tools/newTest.sh',
            './tools/test.sh',
            './tsconfig.json',
            './yarn.lock',
          ],
          templateVersion: '1.0.0',
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
              './tools/newTest.sh',
              './tools/test.sh',
              './tsconfig.json',
              './yarn.lock',
            ],
            rootPathFileList: [
              './.gitignore',
              './package.json',
              './tools/newTest.sh',
              './tools/test.sh',
              './tsconfig.json',
              './yarn.lock',
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
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/mockUpdatedTemplate/templateCatalog/repositoryMap.json',
          remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
          isDebug: true,
          _: [],
        },
        snpFileMapConfig: {
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
            './tools/newTest.sh',
            './tools/test.sh',
            './tsconfig.json',
            './yarn.lock',
          ],
          rootPathFileList: [
            './.gitignore',
            './package.json',
            './tools/newTest.sh',
            './tools/test.sh',
            './tsconfig.json',
            './yarn.lock',
          ],
          createdFileMap: [],
          snpFileMap: {},
        },
        downloadContent: {
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
            './tools/newTest.sh',
            './tools/test.sh',
            './tsconfig.json',
            './yarn.lock',
          ],
          rootPathFileList: [
            './.gitignore',
            './package.json',
            './tools/newTest.sh',
            './tools/test.sh',
            './tsconfig.json',
            './yarn.lock',
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
          './mock/mockProject/tools/upload.sh',
          './mock/mockProject/tsconfig.json',
          './mock/mockProject/yarn.lock',
        ],
        snpConfigFileContent: {
          REPOSITORY_MAP_FILE_NAME: 'repositoryMap.json',
          _: [],
          availableSNPKeySuffix: ['defaultFile', 'customFile', 'extendFile'],
          availableSNPSuffix: ['-default.md', '-custom.md', '-extend.md'],
          isDebug: true,
          projectCatalog: './mock/mockProject/',
          remoteFileMapURL:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/mockUpdatedTemplate/templateCatalog/repositoryMap.json',
          remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
          remoteRootRepositoryUrl:
            'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
          sUpdaterVersion: '../../dist/s-update-manager-1.0.0-dev.27.tgz',
          snpCatalog: './mock/mockProject/.snp/',
          snpConfigFile: './mock/mockProject/.snp/snp.config.json',
          snpConfigFileName: 'snp.config.json',
          snpFileMapConfig: './mock/mockProject/.snp/repositoryMap.json',
          templateCatalogName: 'templateCatalog',
          temporaryFolder: './mock/mockProject/.snp/temporary/',
        },
        snpFileMapConfigContent: {
          createdFileMap: [],
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
          snpFileMap: {},
          templateFileList: [
            './.gitignore',
            './package.json',
            './tools/newTest.sh',
            './tools/test.sh',
            './tsconfig.json',
            './yarn.lock',
          ],
          templateVersion: '1.0.0',
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

    it('should return correct content with only snpConfigFile', async () => {
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
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/mockUpdatedTemplate/templateCatalog/repositoryMap.json',
        remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
        remoteRootRepositoryUrl:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/tree/dev/test/mockUpdatedTemplate',
      };

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
          ...mockConfig.step.downloadConfigFile.forUpdate,
        },

        downloadContent: mockSnpFileMapConfig.step.downloadConfigFile.downloaded,
        // snpFileMapConfig: mockSnpFileMapConfig.step.downloadConfigFile.updated,

        // downloadContent: {},
        snpFileMapConfig: {
          createdFileMap: [],
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
          snpFileMap: {},
          templateFileList: [
            './.gitignore.md',
            './README.md',
            './package.json',
            './tools/test.sh',
            './tsconfig.json',
            './yarn.lock',
          ],
          templateVersion: '1.0.0',
        },
        allFiles: [
          './test/mockProject/.snp/repositoryMap.json',
          './test/mockProject/.snp/snp.config.json',
          './test/mockProject/.snp/temporary/repositoryMap.json',
        ],
      });
    });
  });
});
