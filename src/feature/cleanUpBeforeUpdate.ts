import { AvailableSNPKeySuffixTypes, ConfigType } from '@/feature/config/types';
import { FileMapConfig, snpFile, updateDetailsFileMapConfig2 } from '@/feature/updateFileMapConfig';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';
import { formatSnp } from '@/util/formatSnp';
import { getRealFilePath } from '@/util/getRealFilePath';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const cleanUpBeforeUpdate = async (config: ConfigType): Promise<ConfigType> => {
  let snpFileMapConfig: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  const fileToClean: snpFile[] = [];

  try {
    if (snpFileMapConfig.snpFileMap && snpFileMapConfig.fileMap) {
      const createdFileRealName: [string, string][] = [];
      for (const SNPSuffixFileName of snpFileMapConfig.fileMap) {
        const realFilePath = getRealFilePath({ config, SNPSuffixFileName });
        const SNPKeySuffix = formatSnp(SNPSuffixFileName, 'key') as AvailableSNPKeySuffixTypes;
        if (!createdFileRealName.includes([realFilePath, SNPKeySuffix])) {
          createdFileRealName.push([realFilePath, SNPKeySuffix]);
        }
      }
      for (const [realFilePath, SNPKeySuffix] of createdFileRealName) {
        fileToClean.push(snpFileMapConfig.snpFileMap[realFilePath][SNPKeySuffix]);
        if (!fileToClean.includes(snpFileMapConfig.snpFileMap[realFilePath]['_'])) {
          fileToClean.push(snpFileMapConfig.snpFileMap[realFilePath]['_']);
        }
      }
    }

    for (const snpFile of fileToClean) {
      await deletePath(createPath(snpFile.path), config.isDebug).then(async () => {
        snpFileMapConfig = await updateDetailsFileMapConfig2({
          snpFileMapConfig,
          config,
          operation: 'deleteFile',
          SNPKeySuffix: snpFile.SNPKeySuffix as AvailableSNPKeySuffixTypes | '_',
          // realFileName: snpFile.realFileName,
          realFilePath: snpFile.realFilePath,
        });
      });
    }

    snpFileMapConfig = await updateDetailsFileMapConfig2({
      snpFileMapConfig,
      config,
      operation: 'removeFileMap',
    });

    return config;
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
};
