import semver from 'semver';
import { ConfigTemplateType } from '@/feature/config/types';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { isFileExists } from '@/util/isFileExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const bumpVersion = async (config: ConfigTemplateType): Promise<ConfigTemplateType> => {
  debugFunction(config.isDebug, { config }, '[PrepareTemplate] Bump Version');
  const repositoryMapFileConfig: FileMapConfig = await readFile(config.repositoryMapFilePath).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );
  const currentVersion = repositoryMapFileConfig.templateVersion;
  if (!config.bumpVersion) {
    debugFunction(config.isDebug, { config }, `[PrepareTemplate] stay with current version, ${currentVersion}`);
    return config;
  }

  if (await isFileExists(config.repositoryMapFilePath)) {
    repositoryMapFileConfig.templateVersion = semver.inc(currentVersion, 'patch') || '1.0.0';

    await createFile({
      filePath: config.repositoryMapFilePath,
      content: JSON.stringify(repositoryMapFileConfig),
      isDebug: config.isDebug,
      options: {
        overwriteFile: true,
      },
    });
  }

  return config;
};
