import path from 'path';
import { ConfigTemplateType } from '@/feature/config/types';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';
import { readFile } from '@/util/readFile';

export const prepareTemplateFile = async ({
  config,
  fileList,
}: {
  config: ConfigTemplateType;
  fileList: string[] | [];
}): Promise<{
  config: ConfigTemplateType;
  fileList: string[] | [];
  templateFileList: string[] | [];
}> => {
  const templateFileList: string[] = [];
  for (const filePath of fileList) {
    const fileName = path.basename(filePath) + '-default.md';
    const fileDir = path.dirname(filePath);
    const templateFilePath = createPath([config.templateCatalogPath, filePath]);
    templateFileList.push(templateFilePath);
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

  return { config, templateFileList, fileList };
};
