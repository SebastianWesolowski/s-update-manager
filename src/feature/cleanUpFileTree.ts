import { AvailableSNPKeySuffixTypes, ConfigType, createPath } from '@/feature/defaultConfig';
import { FileMapConfig, snpFile, updateDetailsFileMapConfig2 } from '@/feature/updateFileMapConfig';
import { deletePath } from '@/util/deletePath';
import { getRealFileName } from '@/util/getRealFileName';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const cleanUpFileTree = async (config: ConfigType): Promise<ConfigType> => {
  let snpFileMapConfig: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  try {
    if (
      snpFileMapConfig.createdFileMap.length > 0 &&
      snpFileMapConfig.fileMap.length > 0 &&
      snpFileMapConfig.snpFileMap &&
      Object.keys(snpFileMapConfig?.snpFileMap).length > 0
    ) {
      const realFilesMap = new Map<string, any>();

      snpFileMapConfig.fileMap.forEach((file) => {
        const realName = getRealFileName({ config, contentToCheck: [file] })[0];
        if (!realFilesMap.has(realName)) {
          realFilesMap.set(realName, file);
        }
      });

      const realFiles = Array.from(realFilesMap.keys());
      let temporarySnpFileMap = snpFileMapConfig.snpFileMap;

      realFiles.forEach((file) => {
        delete temporarySnpFileMap[file];
      });

      temporarySnpFileMap = {
        'package.json': {
          customFile: {
            SNPKeySuffix: 'customFile',
            isCreated: true,
            path: './test/fakeProjectRootfolder/.snp/README.md-custom.md',
            realFileName: 'README.md',
            realPath: './test/fakeProjectRootfolder/README.md',
            templateVersion: '1.0.0',
            SNPSuffixFileName: 'README.md-custom.md',
          },
          extendFile: {
            SNPKeySuffix: 'extendFile',
            isCreated: true,
            path: './test/fakeProjectRootfolder/.snp/README.md-extend.md',
            realFileName: 'README.md',
            realPath: './test/fakeProjectRootfolder/README.md',
            templateVersion: '1.0.0',
            SNPSuffixFileName: 'README.md-extend.md',
          },
          defaultFile: {
            SNPKeySuffix: 'defaultFile',
            isCreated: true,
            path: './test/fakeProjectRootfolder/.snp/package.json-default.md',
            realFileName: 'package.json',
            realPath: './test/fakeProjectRootfolder/package.json',
            templateVersion: '1.0.0',
            SNPSuffixFileName: 'package.json-default.md',
          },
          instructionsFile: {
            SNPKeySuffix: 'instructionsFile',
            isCreated: true,
            path: './test/fakeProjectRootfolder/.snp/package.json-instructions.md',
            realFileName: 'package.json',
            realPath: './test/fakeProjectRootfolder/package.json',
            templateVersion: '1.0.0',
            SNPSuffixFileName: 'package.json-instructions.md',
          },
        },
      };
      const fileToClean: snpFile[] = [];

      for (const realNameFile in temporarySnpFileMap) {
        for (const SNPKeySuffix in temporarySnpFileMap[realNameFile]) {
          fileToClean.push(temporarySnpFileMap[realNameFile][SNPKeySuffix]);
        }
      }

      for (const snpFile of fileToClean) {
        await deletePath(createPath(snpFile.path), config.isDebug).then(async () => {
          snpFileMapConfig = await updateDetailsFileMapConfig2({
            snpFileMapConfig,
            config,
            operation: 'deleteFile',
            SNPKeySuffix: snpFile.SNPKeySuffix as AvailableSNPKeySuffixTypes | '_',
            realFileName: snpFile.realFileName,
          });
        });
      }
    }

    return config;
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
};
