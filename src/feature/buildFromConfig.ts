import { ConfigType, SNPKeySuffixTypes } from '@/feature/config/types';
import { getContentToBuild, getRemoteContentToBuild } from '@/feature/getContnetToBuild';
import {
  FileMapConfig,
  snpArrayPathFileSet,
  snpFile,
  updateDetailsFileMapConfig2,
} from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';
import { debugFunction } from '@/util/debugFunction';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const buildFromConfig = async (
  config: ConfigType
): Promise<{ config: ConfigType; snpFileMapConfig: FileMapConfig }> => {
  debugFunction(config.isDebug, 'start', '[INIT] buildFromConfig');

  let snpFileMapConfig: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  for (const realFilePath in snpFileMapConfig.snpFileMap) {
    if (realFilePath === 'tools/test.sh') {
      console.log('');
    }
    // bo sprawdzamy tylko po default reszta powinn być wygenewoana ręcznie lub korzysta tylko z getContent
    // const SNPKeySuffix = "defaulFile"
    for (const SNPKeySuffix in snpFileMapConfig.snpFileMap[realFilePath]) {
      if (SNPKeySuffix === '_') {
        continue;
      }

      const currentFileObject: snpFile = snpFileMapConfig.snpFileMap[realFilePath][SNPKeySuffix];
      if (!(await isFileOrFolderExists(currentFileObject.path))) {
        await createFile({
          filePath: createPath(currentFileObject.path),
          content: '',
          isDebug: config.isDebug,
          options: {
            overwriteFile: true,
          },
        }).then(async () => {
          snpFileMapConfig = await updateDetailsFileMapConfig2({
            config,
            operation: 'createSuffixFile',
            realFilePath,
            SNPKeySuffix: SNPKeySuffix as SNPKeySuffixTypes,
          });
        });
      }
      // Tutaj nie ma potrzeby występowania innych niż default
      if (snpFileMapConfig.fileMap.includes(currentFileObject.SNPSuffixFileName)) {
        const content = await getRemoteContentToBuild({
          config,
          snpObject: currentFileObject,
        });
        if (content) {
          await createFile({
            filePath: currentFileObject.path,
            content,
            options: {
              overwriteFile: true,
            },
          });
        }
      }
    }

    // const updatedSnpFileMapConfig: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    //   parseJSON(bufferData.toString())
    // );

    const realFileObject = snpFileMapConfig.snpFileMap[realFilePath]['_'];

    if (snpFileMapConfig.snpFileMap) {
      const snpSetObject = snpFileMapConfig.snpFileMap[realFilePath] as snpArrayPathFileSet;
      const content = await getContentToBuild(snpSetObject);

      if (content) {
        await createFile({
          filePath: realFileObject.path,
          content,
          isDebug: config.isDebug,
        }).then(async () => {
          await updateDetailsFileMapConfig2({
            config,
            operation: 'createSNPRealFile',
            realFilePath,
          });
        });
      }
    }
  }

  debugFunction(config.isDebug, { snpFileMapConfig }, '[INIT] buildFromConfig');
  return { config, snpFileMapConfig };
};
