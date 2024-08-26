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
  debugFunction(config.isDebug, '=== SNP INIT ===', '[INIT] downloadConfig');
  const snpFileMapConfig: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  try {
    debugFunction(
      config.isDebug,
      {
        remoteRootRepositoryUrl: config.remoteRootRepositoryUrl,
        remoteRepository: config.remoteRepository,
        fileName: config.REPOSITORY_MAP_FILE_NAME,
        remoteFileMapURL: config.remoteFileMapURL,
      },
      '[INIT - downloadConfig]'
    );

    if (!(await isFileOrFolderExists(config.temporaryFolder))) {
      await createCatalog(config.temporaryFolder);
    }
    // TODO config.temporaryFolder is nesesery
    return await wgetAsync(config.remoteFileMapURL, config.temporaryFolder)
      .then(async (snpFileMapConfigContent) => {
        let currentConfig = {};
        const downloadContent: FileMapConfig = parseJSON(snpFileMapConfigContent);

        currentConfig = {
          ...snpFileMapConfig,
          ...downloadContent,
        };

        const combinedConfig = currentConfig as FileMapConfig;

        if (!combinedConfig.createdFileMap) {
          combinedConfig.createdFileMap = [];
        }

        if (!combinedConfig.snpFileMap) {
          combinedConfig.snpFileMap = {};
        }

        await createFile({
          filePath: config.snpFileMapConfig,
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
        return { config: { ...config, templateVersion: combinedConfig.templateVersion }, downloadContent };
      });
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
}
