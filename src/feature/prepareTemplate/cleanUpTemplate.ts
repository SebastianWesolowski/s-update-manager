import { ConfigTemplateType, RepositoryMapFileConfigType } from '@/feature/config/types';
import { deletePath } from '@/util/deletePath';
import { isFileExists } from '@/util/isFileExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJsonFile } from '@/util/updateJsonFile';

export const cleanUpTemplate = async (config: ConfigTemplateType): Promise<ConfigTemplateType> => {
  if (await isFileExists(config.repositoryMapFilePath)) {
    const repositoryMapFileConfig: RepositoryMapFileConfigType = await readFile(config.repositoryMapFilePath).then(
      async (bufferData) => parseJSON(bufferData.toString())
    );
    const newContent = repositoryMapFileConfig;
    const replaceFile = true;
    newContent.fileMap = [];
    newContent.templateFileList = [];

    await updateJsonFile({
      filePath: config.repositoryMapFilePath,
      config,
      newContent,
      replaceFile,
    });
  }

  if (await isFileExists(config.templateCatalogPath)) {
    try {
      await deletePath(config.templateCatalogPath, true);
      return config;
    } catch (error) {
      console.error(`Error isnt exist: ${(error as Error).message}`);
      return config;
    }
  }

  return config;
};
