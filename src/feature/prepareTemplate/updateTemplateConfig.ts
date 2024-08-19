import { defaultRepositoryMapFileConfig } from '../config/const';
import { ConfigTemplateType, RepositoryMapFileConfigType } from '@/feature/config/types';
import { debugFunction } from '@/util/debugFunction';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJsonFile } from '@/util/updateJsonFile';

export const updateTemplateConfig = async ({
  config,
  fileList,
  templateFileList,
}: {
  config: ConfigTemplateType;
  fileList: string[] | [];
  templateFileList: string[] | [];
}): Promise<RepositoryMapFileConfigType> => {
  debugFunction(config.isDebug, { config }, '[PrepareTemplate] updateTemplateConfig');
  const repositoryMapFileConfig: RepositoryMapFileConfigType = await readFile(config.repositoryMapFilePath).then(
    async (bufferData) => parseJSON(bufferData.toString())
  );
  const newContent = repositoryMapFileConfig;
  const replaceFile = true;
  newContent.fileMap = fileList;
  newContent.templateFileList = templateFileList;

  return (
    ((await updateJsonFile({
      filePath: config.repositoryMapFilePath,
      config,
      newContent,
      replaceFile,
    })) as RepositoryMapFileConfigType) || defaultRepositoryMapFileConfig
  );
};
