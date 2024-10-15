import { ConfigType, SUMKeySuffixTypes } from '@/feature/config/types';
import { getContentToBuild } from '@/feature/getContnetToBuild';
import { getRemoteContentToBuild } from '@/feature/getRemoteContentToBuild';
import {
  FileMapConfig,
  sumArrayPathFileSet,
  sumFile,
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
): Promise<{ config: ConfigType; sumFileMapConfig: FileMapConfig }> => {
  debugFunction(config.isDebug, 'start', '[INIT] buildFromConfig');

  let sumFileMapConfig: FileMapConfig = await readFile(config.sumFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  for (const realFilePath in sumFileMapConfig.sumFileMap) {
    // because we only check for default, the rest should be generated manually or only use getContent
    // const SUMKeySuffix = "defaultFile"
    for (const SUMKeySuffix in sumFileMapConfig.sumFileMap[realFilePath]) {
      if (SUMKeySuffix === '_') {
        continue;
      }

      const currentFileObject: sumFile = sumFileMapConfig.sumFileMap[realFilePath][SUMKeySuffix];
      if (!(await isFileOrFolderExists({ isDebug: config.isDebug, filePath: currentFileObject.path }))) {
        await createFile({
          filePath: createPath(currentFileObject.path),
          content: '',
          isDebug: config.isDebug,
          options: {
            overwriteFile: true,
          },
        }).then(async () => {
          sumFileMapConfig = await updateDetailsFileMapConfig2({
            config,
            operation: 'createSuffixFile',
            realFilePath,
            SUMKeySuffix: SUMKeySuffix as SUMKeySuffixTypes,
          });
        });
      }
      // There's no need for others than default to appear here
      if (sumFileMapConfig.fileMap.includes(currentFileObject.SUMSuffixFileName)) {
        const content = await getRemoteContentToBuild({
          config,
          sumObject: currentFileObject,
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

    // const updatedSumFileMapConfig: FileMapConfig = await readFile(config.sumFileMapConfig).then(async (bufferData) =>
    //   parseJSON(bufferData.toString())
    // );

    const realFileObject = sumFileMapConfig.sumFileMap[realFilePath]['_'];

    if (sumFileMapConfig.sumFileMap) {
      const sumSetObject = sumFileMapConfig.sumFileMap[realFilePath] as sumArrayPathFileSet;
      const content = await getContentToBuild(sumSetObject);

      if (content) {
        await createFile({
          filePath: realFileObject.path,
          content,
          isDebug: config.isDebug,
        }).then(async () => {
          sumFileMapConfig = await updateDetailsFileMapConfig2({
            config,
            operation: 'createSUMRealFile',
            realFilePath,
          });
        });
      }
    }
  }

  debugFunction(config.isDebug, { sumFileMapConfig }, '[INIT] buildFromConfig');
  return { config, sumFileMapConfig };
};
