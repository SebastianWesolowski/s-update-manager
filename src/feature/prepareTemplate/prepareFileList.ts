import path from 'path';
import { ConfigTemplateType } from '@/feature/config/types';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';
import { debugFunction } from '@/util/debugFunction';
import { readFile } from '@/util/readFile';

export const prepareFileList = async ({
  config,
  templateFileList,
}: {
  config: ConfigTemplateType;
  templateFileList: string[] | [];
}): Promise<{
  config: ConfigTemplateType;
  fileList: string[] | [];
  templateFileList: string[] | [];
  rootPathFileList: string[] | [];
}> => {
  debugFunction(config.isDebug, { config, templateFileList }, '[PrepareTemplate] prepareTemplateFile');
  const rootPathFileList: string[] = [];
  const fileList: string[] = [];
  for (const filePath of templateFileList) {
    const fileName = path.basename(filePath) + '-default.md';
    const fileDir = path.dirname(filePath);
    const templateFilePath = createPath([config.templateCatalogPath, filePath]);
    rootPathFileList.push(createPath([config.projectCatalog, filePath]));
    fileList.push(createPath([config.templateCatalogName, filePath + '-default.md']));
    const content = await readFile(templateFilePath);

    await createFile({
      filePath: createPath([config.templateCatalogPath, fileDir, fileName]),
      content,
      isDebug: config.isDebug,
      options: {
        overwriteFile: true,
      },
    });
  }

  debugFunction(
    config.isDebug,
    { config, fileList, templateFileList, rootPathFileList },
    '[PrepareTemplate] END prepareTemplateFile'
  );
  return { config, templateFileList, fileList, rootPathFileList };
};
