import { ConfigTemplateType, RepositoryMapFileConfigType } from '@/feature/config/types';
import { clearDirectory } from '@/util/clearDirectory';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const cleanUpTemplate = async (config: ConfigTemplateType): Promise<ConfigTemplateType> => {
  debugFunction(config.isDebug, { config }, '[PrepareTemplate] cleanUpTemplate');
  let repositoryMapFileConfig: null | RepositoryMapFileConfigType = null;
  if (await isFileOrFolderExists(config.templateCatalogPath)) {
    if (await isFileOrFolderExists(config.repositoryMapFilePath)) {
      repositoryMapFileConfig = await readFile(config.repositoryMapFilePath).then(async (bufferData) =>
        parseJSON(bufferData.toString())
      );
    }

    await clearDirectory(config.templateCatalogPath);

    const newContent = repositoryMapFileConfig;
    if (newContent !== null) {
      newContent.fileMap = [];
      newContent.templateFileList = [];
      newContent.rootPathFileList = [];

      await createFile({
        filePath: config.repositoryMapFilePath,
        content: JSON.stringify(newContent),
        isDebug: config.isDebug,
        options: {
          overwriteFile: true,
        },
      });
    }
  }

  debugFunction(config.isDebug, { config }, '[PrepareTemplate] end cleanUpTemplate');
  return config;
};
