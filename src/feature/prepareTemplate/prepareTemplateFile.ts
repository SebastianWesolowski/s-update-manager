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
}): Promise<ConfigTemplateType> => {
  for (const filePath of fileList) {
    const fileName = path.basename(filePath) + '-default.md';
    const fileDir = path.dirname(filePath);

    const content = await readFile(createPath([config.projectCatalog, filePath]) || '');

    await createFile({
      filePath: createPath([config.templateCatalogPath, fileDir, fileName]),
      content,
      isDebug: config.isDebug,
      options: {
        overwriteFile: true,
      },
    }).then(async () => {
      console.log('');
    });
  }

  return config;
};
