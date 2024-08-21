import { ConfigTemplateType, RepositoryMapFileConfigType } from '@/feature/config/types';
import { debugFunction } from '@/util/debugFunction';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJsonFile } from '@/util/updateJsonFile';

export const updateTemplateConfig = async ({
  config,
  fileList,
  templateFileList,
  rootPathFileList,
}: {
  config: ConfigTemplateType;
  fileList: string[] | [];
  templateFileList: string[] | [];
  rootPathFileList: string[] | [];
}): Promise<{ config: ConfigTemplateType }> => {
  debugFunction(config.isDebug, { config }, '[PrepareTemplate] updateTemplateConfig');
  const repositoryMapFileConfig: RepositoryMapFileConfigType = await readFile(config.repositoryMapFilePath).then(
    async (bufferData) => parseJSON(bufferData.toString())
  );
  const newContent = repositoryMapFileConfig;
  const replaceFile = true;
  newContent.fileMap = fileList;
  newContent.templateFileList = templateFileList;
  newContent.rootPathFileList = rootPathFileList;

  await updateJsonFile({
    filePath: config.repositoryMapFilePath,
    config,
    newContent,
    replaceFile,
  });

  debugFunction(config.isDebug, { config, fileList, templateFileList }, '[PrepareTemplate] END updateTemplateConfig');
  return { config };
};
