import { AvailableSNPSuffixTypes, ConfigType } from '@/feature/config/types';
import { FileMapConfig, snpFileMapObjectType, updateDetailsFileMapConfig2 } from '@/feature/updateFileMapConfig';
import { createPath } from '@/util/createPath';
import { debugFunction } from '@/util/debugFunction';
import { formatSnp } from '@/util/formatSnp';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export async function scanExtraFile(
  config: ConfigType
): Promise<{ config: ConfigType; snpFileMapConfig: FileMapConfig }> {
  debugFunction(config.isDebug, 'start', '[INIT] scanExtraFile');
  let snpFileMapConfig: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  if (snpFileMapConfig.snpFileMap) {
    for (const SNPKeySuffix of config.availableSNPKeySuffix) {
      if (SNPKeySuffix === 'defaultFile') {
        continue;
      }

      for (const [realFilePath] of Object.entries(snpFileMapConfig.snpFileMap || {}) as [
        string,
        snpFileMapObjectType,
      ][]) {
        const snpSuffix = formatSnp(SNPKeySuffix, 'suffix') as AvailableSNPSuffixTypes;
        const SNPSuffixFilePath = createPath([config.snpCatalog, config.templateCatalogName, realFilePath + snpSuffix]);
        if (await isFileOrFolderExists({ isDebug: config.isDebug, filePath: SNPSuffixFilePath })) {
          const SNPSuffixFileName = createPath([realFilePath + snpSuffix]);
          snpFileMapConfig = await updateDetailsFileMapConfig2({
            snpFileMapConfig,
            config,
            operation: 'addConfigSuffixFile',
            SNPKeySuffix,
            SNPSuffixFileName,
            isCreated: true,
            path: SNPSuffixFilePath,
            realFilePath,
            realPath: createPath([config.projectCatalog, realFilePath]),
            templateVersion: snpFileMapConfig.templateVersion,
          });
        }
      }
    }
  }
  debugFunction(config.isDebug, config, '[INIT] scanExtraFile - end');
  return { config, snpFileMapConfig };
}
