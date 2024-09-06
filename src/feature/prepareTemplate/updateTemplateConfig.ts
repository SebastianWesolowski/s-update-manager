import { ConfigTemplateType, RepositoryMapFileConfigType } from '@/feature/config/types';
import { debugFunction } from '@/util/debugFunction';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJsonFile } from '@/util/updateJsonFile';

export const updateTemplateConfig = async ({
  templateConfig,
  fileList,
  templateFileList,
  rootPathFileList,
}: {
  templateConfig: ConfigTemplateType;
  fileList: string[] | [];
  templateFileList: string[] | [];
  rootPathFileList: string[] | [];
}): Promise<{ templateConfig: ConfigTemplateType }> => {
  debugFunction(templateConfig.isDebug, { templateConfig }, '[PrepareTemplate] updateTemplateConfig');
  const repositoryMapFileConfig: RepositoryMapFileConfigType = await readFile(
    templateConfig.repositoryMapFilePath
  ).then(async (bufferData) => parseJSON(bufferData.toString()));
  const newContent = repositoryMapFileConfig;
  const replaceFile = true;
  newContent.fileMap = fileList;
  newContent.templateFileList = templateFileList;
  newContent.rootPathFileList = rootPathFileList;

  await updateJsonFile({
    filePath: templateConfig.repositoryMapFilePath,
    config: templateConfig,
    newContent,
    replaceFile,
  });

  debugFunction(
    templateConfig.isDebug,
    { templateConfig, fileList, templateFileList },
    '[PrepareTemplate] END updateTemplateConfig'
  );
  return { templateConfig };
};
