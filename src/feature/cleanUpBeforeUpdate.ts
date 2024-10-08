import { AvailableSUMKeySuffixTypes, ConfigType } from '@/feature/config/types';
import { FileMapConfig, sumFile, updateDetailsFileMapConfig2 } from '@/feature/updateFileMapConfig';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';
import { formatSum } from '@/util/formatSum';
import { getRealFilePath } from '@/util/getRealFilePath';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const cleanUpBeforeUpdate = async (
  config: ConfigType
): Promise<{ config: ConfigType; deletedPath: string[]; sumFileMapConfig: FileMapConfig }> => {
  let sumFileMapConfig: FileMapConfig = await readFile(config.sumFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  const fileToClean: sumFile[] = [];
  const deletedPath: string[] = [];

  try {
    if (sumFileMapConfig.sumFileMap && sumFileMapConfig.fileMap) {
      const createdFileRealName: [string, string][] = [];
      for (const SUMSuffixFileName of sumFileMapConfig.fileMap) {
        const realFilePath = getRealFilePath({ config, SUMSuffixFileName });
        const SUMKeySuffix = formatSum(SUMSuffixFileName, 'key') as AvailableSUMKeySuffixTypes;
        if (!createdFileRealName.includes([realFilePath, SUMKeySuffix])) {
          createdFileRealName.push([realFilePath, SUMKeySuffix]);
        }
      }
      for (const [realFilePath, SUMKeySuffix] of createdFileRealName) {
        fileToClean.push(sumFileMapConfig.sumFileMap[realFilePath][SUMKeySuffix]);
        if (!fileToClean.includes(sumFileMapConfig.sumFileMap[realFilePath]['_'])) {
          fileToClean.push(sumFileMapConfig.sumFileMap[realFilePath]['_']);
        }
      }
    }

    for (const sumFile of fileToClean) {
      await deletePath(createPath(sumFile.path), config.isDebug)
        .then(async () => {
          sumFileMapConfig = await updateDetailsFileMapConfig2({
            sumFileMapConfig,
            config,
            operation: 'deleteFile',
            SUMKeySuffix: sumFile.SUMKeySuffix as AvailableSUMKeySuffixTypes | '_',
            // realFileName: sumFile.realFileName,
            realFilePath: sumFile.realFilePath,
          });
          return sumFile.path;
        })
        .then((path) => {
          deletedPath.push(path);
        });
    }

    sumFileMapConfig = await updateDetailsFileMapConfig2({
      sumFileMapConfig,
      config,
      operation: 'removeFileMap',
    });

    return { config, deletedPath, sumFileMapConfig };
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
};
