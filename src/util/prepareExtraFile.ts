import { AvailableSNPSuffixTypes, ConfigType } from '@/feature/config/types';
import { formatSnp } from '@/feature/formatSnp';
import { FileMapConfig, updateDetailsFileMapConfig2 } from '@/feature/updateFileMapConfig';
import { createPath } from '@/util/createPath';
import { debugFunction } from '@/util/debugFunction';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export async function prepareExtraFile(config: ConfigType): Promise<ConfigType> {
  debugFunction(config.isDebug, 'start', '[INIT] prepareExtraFile');
  let snpFileMapConfig: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  for (const SNPKeySuffix of config.availableSNPKeySuffix) {
    if (snpFileMapConfig.snpFileMap) {
      for (const [realFileName, snpPathFileSet] of Object.entries(snpFileMapConfig.snpFileMap)) {
        if (!snpPathFileSet[SNPKeySuffix]) {
          const snpSuffix = formatSnp(SNPKeySuffix, 'suffix') as AvailableSNPSuffixTypes;
          const SNPSuffixFileName = realFileName + snpSuffix;

          snpFileMapConfig = await updateDetailsFileMapConfig2({
            snpFileMapConfig,
            config,
            operation: 'addConfigSuffixFile',
            SNPKeySuffix,
            SNPSuffixFileName,
            isCreated: false,
            path: createPath([config.snpCatalog, SNPSuffixFileName]),
            realFileName,
            realPath: createPath([config.projectCatalog, realFileName]),
            templateVersion: snpFileMapConfig.templateVersion,
          });
        }
      }
    }
  }
  debugFunction(config.isDebug, config, '[INIT] prepareExtraFile - end');
  return config;
}
