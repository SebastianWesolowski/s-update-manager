import { ConfigTemplateType, RepositoryMapFileConfigType } from '@/feature/config/types';
import { clearDirectory } from '@/util/clearDirectory';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const cleanUpTemplate = async (
  templateConfig: ConfigTemplateType
): Promise<{ templateConfig: ConfigTemplateType }> => {
  debugFunction(templateConfig.isDebug, { templateConfig }, '[PrepareTemplate] cleanUpTemplate');
  let repositoryMapFileConfig: null | RepositoryMapFileConfigType = null;
  if (await isFileOrFolderExists(templateConfig.templateCatalogPath)) {
    if (await isFileOrFolderExists(templateConfig.repositoryMapFilePath)) {
      repositoryMapFileConfig = await readFile(templateConfig.repositoryMapFilePath).then(async (bufferData) =>
        parseJSON(bufferData.toString())
      );
    }

    await clearDirectory(templateConfig.templateCatalogPath);

    const newContent = repositoryMapFileConfig;
    if (newContent !== null) {
      newContent.fileMap = [];
      newContent.templateFileList = [];
      newContent.rootPathFileList = [];

      await createFile({
        filePath: templateConfig.repositoryMapFilePath,
        content: JSON.stringify(newContent),
        isDebug: templateConfig.isDebug,
        options: {
          overwriteFile: true,
        },
      });
    }
  }

  debugFunction(templateConfig.isDebug, { templateConfig }, '[PrepareTemplate] end cleanUpTemplate');
  return { templateConfig };
};
