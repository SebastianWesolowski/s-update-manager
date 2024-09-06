import semver from 'semver';
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
  if (!templateConfig.bumpVersion) {
    debugFunction(
      templateConfig.isDebug,
      { templateConfig },
      `[PrepareTemplate] END Bump Version - stay with current version, ${currentVersion}`
    );
    return { templateConfig };
  }

  if (await isFileOrFolderExists(templateConfig.repositoryMapFilePath)) {
    const safeCurrentVersion = currentVersion || '1.0.0';
    repositoryMapFileConfig.templateVersion = semver.inc(safeCurrentVersion, 'patch') || '1.0.0';
  }

  templateConfig = { ...templateConfig, ...repositoryMapFileConfig };

  await createFile({
    filePath: templateConfig.repositoryMapFilePath,
    content: JSON.stringify(templateConfig),
    isDebug: templateConfig.isDebug,
    options: {
      overwriteFile: true,
    },
  });

  debugFunction(templateConfig.isDebug, { templateConfig }, '[PrepareTemplate] END Bump Version');
  return { templateConfig };
};
