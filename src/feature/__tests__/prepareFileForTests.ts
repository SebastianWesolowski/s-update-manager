import { cleanUpSinglePath } from './cleanForTests';
import { createFile } from '@/util/createFile';
// import { ConfigTemplateType } from '../config/types';
// import { createFile } from '@/util/createFile';
// import { deletePath } from '@/util/deletePath';

export interface FileToCreate {
  filePath: string;
  content?: string;
  options?: { createFolder?: boolean };
}

export const setupTestFiles = async (filesToCreate: FileToCreate[], isDebug: boolean) => {
  for (const file of filesToCreate) {
    await createFile({
      filePath: file.filePath,
      content: file.content ?? `{path: ${file.filePath}}`,
      options: file.options,
    });
  }
};

// export const tearDown = async (filesToDeleteAfterTest: string[] = []) => {
//   for (const filePath of filesToDeleteAfterTest) {
//     await cleanUpSinglePath({
//       path: filePath,
//       isDebug: true,
//     });
//   }
// };

const getCleanupPath = (type: 'test' | 'mock', folder: string, step?: string): string => {
  let path = type === 'test' ? `./test/${folder}` : `./mock/${folder}`;

  if (step === 'bumpVersion') {
    path = type === 'test' ? `./test/${folder}` : `./mock/${folder}`;
  } else if (step === 'cleanUpTemplate') {
    path = type === 'test' ? `./test/${folder}` : `./mock/${folder}`;
  } else if (step === 'scanProjectFolder') {
    path = type === 'test' ? `./test/${folder}` : `./mock/${folder}`;
  } else if (step === 'prepareFileList') {
    path = type === 'test' ? `./test/${folder}` : `./mock/${folder}`;
  } else if (step === 'updateTemplateConfig') {
    path = type === 'test' ? `./test/${folder}` : `./mock/${folder}`;
  } else if (step === 'formatJsonWithPrettier') {
    path = type === 'test' ? `./test/${folder}` : `./mock/${folder}`;
  }

  return path;
};

export const cleanUpTemplateCatalog = async (
  type: 'test' | 'mock',
  step?:
    | 'bumpVersion'
    | 'cleanUpTemplate'
    | 'scanProjectFolder'
    | 'prepareFileList'
    | 'updateTemplateConfig'
    | 'formatJsonWithPrettier',
  templateCase: 'templateCatalog' | 'templateCatalogUpdate' = 'templateCatalog'
) => {
  const folder =
    templateCase === 'templateCatalog' ? 'mockTemplate/templateCatalog' : 'mockTemplateUpdate/templateCatalog';
  const path = getCleanupPath(type, folder, step);

  await cleanUpSinglePath({
    path,
    isDebug: true,
  });
};

export const cleanUpProjectCatalog = async (
  type: 'test' | 'mock',
  step?:
    | 'bumpVersion'
    | 'cleanUpTemplate'
    | 'scanProjectFolder'
    | 'prepareFileList'
    | 'updateTemplateConfig'
    | 'formatJsonWithPrettier',
  templateCase: 'templateCatalog' | 'templateCatalogUpdate' = 'templateCatalog'
) => {
  const folder = templateCase === 'templateCatalog' ? 'mockTemplate' : 'mockTemplateUpdate';
  const path = getCleanupPath(type, folder, step);

  await cleanUpSinglePath({
    path,
    isDebug: true,
  });
};
