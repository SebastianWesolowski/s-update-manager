import { AvailableSNPKeySuffixTypes, ConfigType } from '@/feature/config/types';
import { formatSnp } from '@/feature/formatSnp';
import { FileMapConfig, updateDetailsFileMapConfig2 } from '@/feature/updateFileMapConfig';
import { createPath } from '@/util/createPath';
import { getRealFileName } from '@/util/getRealFileName';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export async function prepareBaseSnpFileMap(config: ConfigType): Promise<ConfigType> {
  let snpFileMapConfig: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  try {
    if (snpFileMapConfig.snpFileMap && snpFileMapConfig.fileMap) {
      for (const SNPSuffixFileName of snpFileMapConfig.fileMap) {
        const realFileName = getRealFileName({ config, contentToCheck: [SNPSuffixFileName] })[0];
        const SNPKeySuffix = formatSnp(SNPSuffixFileName, 'key') as AvailableSNPKeySuffixTypes;

        if (snpFileMapConfig.snpFileMap) {
          if (!snpFileMapConfig.snpFileMap[realFileName]) {
            snpFileMapConfig = await updateDetailsFileMapConfig2({
              snpFileMapConfig,
              config,
              operation: 'createRealFileName',
              realFileName,
            });
          }

          if (snpFileMapConfig.snpFileMap && !snpFileMapConfig.snpFileMap[realFileName]['_']) {
            snpFileMapConfig = await updateDetailsFileMapConfig2({
              snpFileMapConfig,
              config,
              operation: 'addConfigSuffixFile',
              SNPKeySuffix: '_',
              isCreated: false,
              path: createPath([config.projectCatalog, realFileName]),
              realFileName,
              realPath: createPath([config.projectCatalog, realFileName]),
              templateVersion: snpFileMapConfig.templateVersion,
            });
          }

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

    return config;
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
}
