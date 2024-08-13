import { ConfigType, SNPKeySuffixTypes } from '@/feature/config/types';
import { getContentToBuild, getRemoteContentToBuild } from '@/feature/getContnetToBuild';
import {
  FileMapConfig,
  snpArrayPathFileSet,
  snpFile,
  updateDetailsFileMapConfig2,
} from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const buildFromConfig = async (config: ConfigType): Promise<ConfigType> => {
  const snpFileMapConfig: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  for (const realFileName in snpFileMapConfig.snpFileMap) {
    for (const SNPKeySuffix in snpFileMapConfig.snpFileMap[realFileName]) {
      if (SNPKeySuffix === '_') {
        continue;
      }

      const currentFileObject: snpFile = snpFileMapConfig.snpFileMap[realFileName][SNPKeySuffix];
      if (!currentFileObject.isCreated) {
        await createFile({
          filePath: createPath(currentFileObject.path),
          content: '',
          isDebug: config.isDebug,
        }).then(async () => {
          await updateDetailsFileMapConfig2({
            config,
            operation: 'createSuffixFile',
            realFileName,
            SNPKeySuffix: SNPKeySuffix as SNPKeySuffixTypes,
          });
        });
      }

      if (snpFileMapConfig.fileMap.includes(currentFileObject.SNPSuffixFileName)) {
        const content = await getRemoteContentToBuild({
          config,
          snpObject: currentFileObject,
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

    const updatedSnpFileMapConfig: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
      parseJSON(bufferData.toString())
    );

    const realFileObject = snpFileMapConfig.snpFileMap[realFileName]['_'];

    if (updatedSnpFileMapConfig.snpFileMap) {
      const snpSetObject = updatedSnpFileMapConfig.snpFileMap[realFileName] as snpArrayPathFileSet;
      const content = await getContentToBuild(snpSetObject);

      if (content) {
        await createFile({
          filePath: realFileObject.path,
          content,
          isDebug: config.isDebug,
        }).then(async () => {
          await updateDetailsFileMapConfig2({
            config,
            operation: 'createSNPRealFile',
            realFileName,
          });
        });
      }
    }
  }

  return config;
};
