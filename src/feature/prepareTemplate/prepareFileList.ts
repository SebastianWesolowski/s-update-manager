import { isBinaryFile } from 'isbinaryfile';
import path from 'path';
import { ConfigTemplateType } from '@/feature/config/types';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';
import { debugFunction } from '@/util/debugFunction';
import { readFile } from '@/util/readFile';
export const prepareFileList = async ({
  templateConfig,
  templateFileList,
}: {
  templateConfig: ConfigTemplateType;
  templateFileList: string[] | [];
}): Promise<{
  templateConfig: ConfigTemplateType;
  fileList: string[] | [];
  templateFileList: string[] | [];
  rootPathFileList: string[] | [];
  redOnlyFileList: string[] | [];
}> => {
  debugFunction(templateConfig.isDebug, { templateConfig, templateFileList }, '[PrepareTemplate] prepareFileList');
  const rootPathFileList: string[] = [];
  const fileList: string[] = [];
  const redOnlyFileList: string[] = [];
  for (const filePath of templateFileList) {
    const templateFilePath = createPath([templateConfig.projectCatalog, filePath]);
    const content = await readFile(templateFilePath);

    if (await isBinaryFile(templateFilePath, content.length)) {
      redOnlyFileList.push(filePath);
      continue;
    }

    const fileName = path.basename(filePath) + '-default.md';
    const fileDir = path.dirname(filePath);
    rootPathFileList.push(createPath([templateConfig.projectCatalog, filePath]));
    fileList.push(createPath([templateConfig.templateCatalogName, filePath + '-default.md']));
    debugFunction(
      templateConfig.isDebug,
      { content },
      `[PrepareTemplate] readed Content from file ${templateFilePath}`
    );
    await createFile({
      filePath: createPath([templateConfig.templateCatalogPath, fileDir, fileName]),
      content,
      isDebug: templateConfig.isDebug,
      options: {
        overwriteFile: true,
      },
    });
  }

  debugFunction(
    templateConfig.isDebug,
    { templateConfig, fileList, templateFileList, rootPathFileList },
    '[PrepareTemplate] END prepareTemplateFile'
  );
  return { templateConfig, templateFileList, fileList, rootPathFileList, redOnlyFileList };
};
