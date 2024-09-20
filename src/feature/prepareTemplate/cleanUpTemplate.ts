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
  const { isDebug, templateCatalogPath, repositoryMapFilePath } = templateConfig;
  let repositoryMapFileConfig: null | RepositoryMapFileConfigType = null;

  if (await isFileOrFolderExists({ isDebug, filePath: templateCatalogPath })) {
    if (await isFileOrFolderExists({ isDebug, filePath: repositoryMapFilePath })) {
      repositoryMapFileConfig = await readFile(repositoryMapFilePath).then(async (bufferData) =>
        parseJSON(bufferData.toString())
      );
    }

    await clearDirectory(templateCatalogPath);

    const newContent = repositoryMapFileConfig;
    if (newContent !== null) {
      newContent.fileMap = [];
      newContent.templateFileList = [];
      newContent.rootPathFileList = [];

      await createFile({
        filePath: repositoryMapFilePath,
        content: JSON.stringify(newContent),
        isDebug,
        options: {
          overwriteFile: true,
        },
      });
    }
  }

  debugFunction(templateConfig.isDebug, { templateConfig }, '[PrepareTemplate] end cleanUpTemplate');
  return { templateConfig };
};
