import { AvailableSUMKeySuffixTypes, ConfigType } from '@/feature/config/types';
import { FileMapConfig, sumFile, updateDetailsFileMapConfig2 } from '@/feature/updateFileMapConfig';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';
import { getRealFilePath } from '@/util/getRealFilePath';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const cleanUpFileTree = async (config: ConfigType): Promise<ConfigType> => {
  let sumFileMapConfig: FileMapConfig = await readFile(config.sumFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  try {
    if (
      sumFileMapConfig.createdFileMap.length > 0 &&
      sumFileMapConfig.fileMap.length > 0 &&
      sumFileMapConfig.sumFileMap &&
      Object.keys(sumFileMapConfig?.sumFileMap).length > 0
    ) {
      const realFilesMap = new Map<string, any>();

      sumFileMapConfig.fileMap.forEach((SUMSuffixFileName) => {
        const realFilePath = getRealFilePath({ config, SUMSuffixFileName });
        if (!realFilesMap.has(realFilePath)) {
          realFilesMap.set(realFilePath, SUMSuffixFileName);
        }
      });

      const realFiles = Array.from(realFilesMap.keys());
      const temporarySumFileMap = sumFileMapConfig.sumFileMap;

      realFiles.forEach((file) => {
        delete temporarySumFileMap[file];
      });

      const fileToClean: sumFile[] = [];

      for (const realNameFile in temporarySumFileMap) {
        for (const SUMKeySuffix in temporarySumFileMap[realNameFile]) {
          fileToClean.push(temporarySumFileMap[realNameFile][SUMKeySuffix]);
        }
      }
      if (fileToClean.length > 0) {
        for (const sumFile of fileToClean) {
          await deletePath(createPath(sumFile.path), config.isDebug).then(async () => {
            sumFileMapConfig = await updateDetailsFileMapConfig2({
              sumFileMapConfig,
              config,
              operation: 'deleteFile',
              SUMKeySuffix: sumFile.SUMKeySuffix as AvailableSUMKeySuffixTypes | '_',
              realFilePath: sumFile.realFilePath,
            });
          });
        }
      } else {
        console.log('żaden plik nie został wyczyszczony');
      }
    }

    return config;
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
};
