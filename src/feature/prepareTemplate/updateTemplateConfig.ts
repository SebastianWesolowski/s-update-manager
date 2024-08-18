import { ConfigTemplateType, RepositoryMapFileConfigType } from '@/feature/config/types';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { defaultRepositoryMapFileConfig } from '@/prepare-template';
import { debugFunction } from '@/util/debugFunction';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJsonFile } from '@/util/updateJsonFile';

export const updateTemplateConfig = async ({
  config,
  templateFileList,
}: {
  config: ConfigTemplateType;
  templateFileList: string[] | [];
}): Promise<RepositoryMapFileConfigType> => {
  debugFunction(config.isDebug, { config }, '[PrepareTemplate] updateTemplateConfig');
  const repositoryMapFileConfig: FileMapConfig = await readFile(config.repositoryMapFilePath).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );
  const newContent = repositoryMapFileConfig;
  const replaceFile = true;
  newContent.fileMap = templateFileList;

  return (
    ((await updateJsonFile({
      filePath: config.repositoryMapFilePath,
      config,
      newContent,
      replaceFile,
    })) as RepositoryMapFileConfigType) || defaultRepositoryMapFileConfig
  );
};
