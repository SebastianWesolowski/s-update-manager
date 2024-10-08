import { AvailableSUMSuffixTypes, ConfigType } from '@/feature/config/types';
import { FileMapConfig, sumFileMapObjectType, updateDetailsFileMapConfig2 } from '@/feature/updateFileMapConfig';
import { createPath } from '@/util/createPath';
import { debugFunction } from '@/util/debugFunction';
import { formatSum } from '@/util/formatSum';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export async function scanExtraFile(
  config: ConfigType
): Promise<{ config: ConfigType; sumFileMapConfig: FileMapConfig }> {
  debugFunction(config.isDebug, 'start', '[INIT] scanExtraFile');
  let sumFileMapConfig: FileMapConfig = await readFile(config.sumFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  if (sumFileMapConfig.sumFileMap) {
    for (const SUMKeySuffix of config.availableSUMKeySuffix) {
      if (SUMKeySuffix === 'defaultFile') {
        continue;
      }

      for (const [realFilePath] of Object.entries(sumFileMapConfig.sumFileMap || {}) as [
        string,
        sumFileMapObjectType,
      ][]) {
        const sumSuffix = formatSum(SUMKeySuffix, 'suffix') as AvailableSUMSuffixTypes;
        const SUMSuffixFilePath = createPath([config.sumCatalog, config.templateCatalogName, realFilePath + sumSuffix]);
        if (await isFileOrFolderExists({ isDebug: config.isDebug, filePath: SUMSuffixFilePath })) {
          const SUMSuffixFileName = createPath([realFilePath + sumSuffix]);
          sumFileMapConfig = await updateDetailsFileMapConfig2({
            sumFileMapConfig,
            config,
            operation: 'addConfigSuffixFile',
            SUMKeySuffix,
            SUMSuffixFileName,
            isCreated: true,
            path: SUMSuffixFilePath,
            realFilePath,
            realPath: createPath([config.projectCatalog, realFilePath]),
            templateVersion: sumFileMapConfig.templateVersion,
          });
        }
      }
    }
  }
  debugFunction(config.isDebug, config, '[INIT] scanExtraFile - end');
  return { config, sumFileMapConfig };
}
