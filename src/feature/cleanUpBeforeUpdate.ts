import { AvailableSNPKeySuffixTypes, ConfigType } from '@/feature/config/types';
import { formatSnp } from '@/feature/formatSnp';
import { FileMapConfig, snpFile, updateDetailsFileMapConfig2 } from '@/feature/updateFileMapConfig';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';
import { getRealFileName } from '@/util/getRealFileName';
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
        const realName = getRealFileName({ config, contentToCheck: [SNPSuffixFileName] })[0];
        const SNPKeySuffix = formatSnp(SNPSuffixFileName, 'key') as AvailableSNPKeySuffixTypes;
        if (!createdFileRealName.includes([realName, SNPKeySuffix])) {
          createdFileRealName.push([realName, SNPKeySuffix]);
        }
      }
      for (const [realName, SNPKeySuffix] of createdFileRealName) {
        fileToClean.push(snpFileMapConfig.snpFileMap[realName][SNPKeySuffix]);
        if (!fileToClean.includes(snpFileMapConfig.snpFileMap[realName]['_'])) {
          fileToClean.push(snpFileMapConfig.snpFileMap[realName]['_']);
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
          realFileName: snpFile.realFileName,
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
