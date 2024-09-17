import semver from 'semver';
import { defaultRepositoryMapFileConfig } from '../config/const';
import { ConfigTemplateType } from '@/feature/config/types';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const bumpVersion = async (
  templateConfig: ConfigTemplateType
): Promise<{ templateConfig: ConfigTemplateType }> => {
  debugFunction(templateConfig.isDebug, { templateConfig }, '[PrepareTemplate] Bump Version');
  const repositoryMapFileConfig: ConfigTemplateType = await readFile(templateConfig.repositoryMapFilePath).then(
    async (bufferData) => parseJSON(bufferData.toString())
  );
  const currentVersion = repositoryMapFileConfig.templateVersion;
  const safeCurrentVersion = currentVersion || '1.0.0';

  if (!templateConfig.bumpVersion) {
    debugFunction(
      templateConfig.isDebug,
      { templateConfig },
      `[PrepareTemplate] END Bump Version - stay with current version, ${currentVersion}`
    );

    const repositoryMapFilePathContent = {
      ...defaultRepositoryMapFileConfig,
      ...templateConfig,
      ...repositoryMapFileConfig,
    };

    templateConfig = { ...templateConfig, templateVersion: safeCurrentVersion, bumpVersion: true };

    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(repositoryMapFilePathContent),
      isDebug: templateConfig.isDebug,
      options: {
        overwriteFile: true,
      },
    });

    return { templateConfig };
  }

  if (await isFileOrFolderExists({ isDebug: templateConfig.isDebug, filePath: templateConfig.repositoryMapFilePath })) {
    repositoryMapFileConfig.templateVersion = semver.inc(safeCurrentVersion, 'patch') || '1.0.0';
  }

  const repositoryMapFilePathContent = {
    ...defaultRepositoryMapFileConfig,
    ...templateConfig,
    ...repositoryMapFileConfig,
  };
  templateConfig = { ...templateConfig, ...repositoryMapFileConfig };

  await createFile({
    filePath: templateConfig.repositoryMapFilePath,
    content: JSON.stringify(repositoryMapFilePathContent),
    isDebug: templateConfig.isDebug,
    options: {
      overwriteFile: true,
    },
  });

  debugFunction(templateConfig.isDebug, { templateConfig }, '[PrepareTemplate] END Bump Version');
  return { templateConfig };
};
