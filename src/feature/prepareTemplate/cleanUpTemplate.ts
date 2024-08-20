import { ConfigTemplateType, RepositoryMapFileConfigType } from '@/feature/config/types';
import { debugFunction } from '@/util/debugFunction';
import { deletePath } from '@/util/deletePath';
import { isFileExists } from '@/util/isFileExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJsonFile } from '@/util/updateJsonFile';

export const cleanUpTemplate = async (config: ConfigTemplateType): Promise<ConfigTemplateType> => {
  debugFunction(config.isDebug, { config }, '[PrepareTemplate] cleanUpTemplate');
  if (await isFileExists(config.repositoryMapFilePath)) {
    debugFunction(
      config.isDebug,
      { repositoryMapFilePath: config.repositoryMapFilePath },
      '[PrepareTemplate] repositoryMapFilePath is exist'
    );

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
    debugFunction(
      config.isDebug,
      { templateCatalogPath: config.templateCatalogPath },
      '[PrepareTemplate] templateCatalogPath is exist'
    );
    try {
      await deletePath(config.templateCatalogPath, true);
      return config;
    } catch (error) {
      console.error(`Error isnt exist: ${(error as Error).message}`);
      return config;
    }
  }

  debugFunction(config.isDebug, { config }, '[PrepareTemplate] end cleanUpTemplate');
  return config;
};
