import path from 'path';
import { AvailableSUMKeySuffixTypes, ConfigType } from '@/feature/config/types';
import { FileMapConfig, updateDetailsFileMapConfig2 } from '@/feature/updateFileMapConfig';
import { createPath } from '@/util/createPath';
import { debugFunction } from '@/util/debugFunction';
import { formatSum } from '@/util/formatSum';
import { getIgnoredFilesFromConfig } from '@/util/getIgnoredFilesFromConfig';
import { getRealFileName } from '@/util/getRealFileName';
import { getRealFilePath } from '@/util/getRealFilePath';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export async function prepareBaseSumFileMap(
  config: ConfigType
): Promise<{ config: ConfigType; sumFileMapConfig: FileMapConfig }> {
  debugFunction(config.isDebug, 'start', '[INIT] prepareBaseSumFileMap');
  let sumFileMapConfig: FileMapConfig = await readFile(config.sumFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  try {
    if (sumFileMapConfig.sumFileMap && sumFileMapConfig.fileMap) {
      for (const SUMSuffixFileName of sumFileMapConfig.fileMap) {
        const realFileName = getRealFileName({ config, contentToCheck: [SUMSuffixFileName] })[0];
        const realFilePath = getRealFilePath({ config, SUMSuffixFileName });

        const SUMKeySuffix = formatSum(SUMSuffixFileName, 'key') as AvailableSUMKeySuffixTypes;

        if (sumFileMapConfig.sumFileMap) {
          if (!sumFileMapConfig.sumFileMap[realFilePath]) {
            sumFileMapConfig = await updateDetailsFileMapConfig2({
              sumFileMapConfig,
              config,
              operation: 'createRealFileName',
              realFilePath,
            });
          }

          if (sumFileMapConfig.sumFileMap && !sumFileMapConfig.sumFileMap[realFilePath]['_']) {
            const filePath = createPath([
              config.projectCatalog,
              SUMSuffixFileName.replace(config.templateCatalogName, ''),
            ]);
            const directoryPath = path.dirname(filePath);
            const originalFilePath = createPath([directoryPath, realFileName]);

            sumFileMapConfig = await updateDetailsFileMapConfig2({
              sumFileMapConfig,
              config,
              operation: 'addConfigSuffixFile',
              SUMKeySuffix: '_',
              isCreated: false,
              path: originalFilePath,
              realFilePath,
              realPath: createPath([config.projectCatalog, realFileName]),
              templateVersion: sumFileMapConfig.templateVersion,
            });
          }

          sumFileMapConfig = await updateDetailsFileMapConfig2({
            sumFileMapConfig,
            config,
            operation: 'addConfigSuffixFile',
            SUMKeySuffix,
            SUMSuffixFileName,
            isCreated: false,
            path: createPath([config.sumCatalog, SUMSuffixFileName]),
            realFilePath,
            realPath: createPath([config.projectCatalog, realFilePath]),
            templateVersion: sumFileMapConfig.templateVersion,
          });
        }
      }
    }
    if (sumFileMapConfig.sumFileMap && sumFileMapConfig.redOnlyFileList) {
      for (const readOnlyFile of sumFileMapConfig.redOnlyFileList) {
        const realFileName = getRealFileName({ config, contentToCheck: [readOnlyFile] })[0];
        const realFilePath = getRealFilePath({ config, SUMSuffixFileName: readOnlyFile });

        const filePath = createPath([config.projectCatalog, readOnlyFile.replace(config.templateCatalogName, '')]);
        const directoryPath = path.dirname(filePath);
        const originalFilePath = createPath([directoryPath, realFileName]);

        if (sumFileMapConfig.sumFileMap && !sumFileMapConfig.sumFileMap[realFilePath]) {
          sumFileMapConfig = await updateDetailsFileMapConfig2({
            sumFileMapConfig,
            config,
            operation: 'createRedOnlyFileList',
            SUMKeySuffix: '_',
            isCreated: false,
            path: originalFilePath,
            realFilePath,
            realPath: createPath([config.projectCatalog, realFileName]),
            templateVersion: sumFileMapConfig.templateVersion,
          });
        }
      }
    }

    const ignoredFiles = await getIgnoredFilesFromConfig({ config, sumFileMapConfig });

    if (ignoredFiles) {
      for (const ignoreFile of ignoredFiles) {
        const realFilePath = getRealFilePath({ config, SUMSuffixFileName: ignoreFile });

        if (sumFileMapConfig.sumFileMap && sumFileMapConfig.sumFileMap[realFilePath]) {
          sumFileMapConfig = await updateDetailsFileMapConfig2({
            sumFileMapConfig,
            config,
            operation: 'setIgnoreFile',
            realFilePath,
          });
        }
      }
    }

    debugFunction(config.isDebug, config, '[INIT] prepareBaseSumFileMap');
    return { config, sumFileMapConfig };
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
}
