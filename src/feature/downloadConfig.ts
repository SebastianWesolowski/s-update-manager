import { ConfigType } from '@/feature/config/types';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createCatalog } from '@/util/createCatalog';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { objectToBuffer } from '@/util/objectToBuffer';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { wgetAsync } from '@/util/wget';

export async function downloadConfig(config: ConfigType): Promise<{
  downloadContent: FileMapConfig;
  config: ConfigType;
}> {
  debugFunction(config.isDebug, '=== SUM INIT ===', '[INIT] downloadConfig');
  const sumFileMapConfig: FileMapConfig = await readFile(config.sumFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  try {
    debugFunction(
      config.isDebug,
      {
        remoteRootRepositoryUrl: config.remoteRootRepositoryUrl,
        remoteRepository: config.remoteRepository,
        fileName: config.sumFileMapConfigFileName,
        remoteFileMapURL: config.remoteFileMapURL,
      },
      '[INIT - downloadConfig]'
    );

    // TODO [SC-18] Ensure temporaryFolder config is nesesery
    if (!(await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.temporaryFolder }))) {
      await createCatalog(config.temporaryFolder);
    }

    // TODO [SC-79] chenge testTamplete repo to mock
    return await wgetAsync(config.remoteFileMapURL, config.temporaryFolder)
      .then(async (sumFileMapConfigContent) => {
        let currentConfig = {};
        const downloadContent: FileMapConfig = parseJSON(sumFileMapConfigContent);

        currentConfig = {
          ...sumFileMapConfig,
          ...downloadContent,
        };

        const combinedConfig = currentConfig as FileMapConfig;

        if (!combinedConfig.createdFileMap) {
          combinedConfig.createdFileMap = [];
        }

        if (!combinedConfig.sumFileMap) {
          combinedConfig.sumFileMap = {};
        }

        await createFile({
          filePath: config.sumFileMapConfig,
          content: objectToBuffer(combinedConfig),
          options: {
            overwriteFile: true,
          },
        });
        return { combinedConfig, downloadContent };
      })
      .then(({ combinedConfig, downloadContent }) => {
        debugFunction(
          config.isDebug,
          { ...config, templateVersion: combinedConfig.templateVersion },
          '[INIT] downloadConfig - end'
        );
        return {
          config: { ...config, templateVersion: combinedConfig.templateVersion },
          sumFileMapConfig: combinedConfig,
          downloadContent,
        };
      });
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
}
