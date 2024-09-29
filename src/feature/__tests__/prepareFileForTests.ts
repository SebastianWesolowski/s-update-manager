import { cleanUpSinglePath } from './cleanForTests';
import { createFile } from '@/util/createFile';

export interface FileToCreateType {
  filePath: string;
  content?: string;
  options?: { createFolder?: boolean };
}

export const setupTestFiles = async (filesToCreate: FileToCreateType[], isDebug: boolean) => {
  for (const file of filesToCreate) {
    await createFile({
      filePath: file.filePath,
      content: file.content ?? `{path: ${file.filePath}}`,
      options: file.options,
    });
  }
};

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
  const folderNodeModule =
    templateCase === 'templateCatalog' ? 'mockTemplate/node_modules' : 'mockTemplateUpdate/node_modules';
  const folderTools = templateCase === 'templateCatalog' ? 'mockTemplate/tools' : 'mockTemplateUpdate/tools';
  const path = getCleanupPath(type, folder, step);
  const pathNodeModules = getCleanupPath(type, folderNodeModule, step);
  const pathTools = getCleanupPath(type, folderTools, step);

  await cleanUpSinglePath({
    path,
    isDebug: true,
  });

  await cleanUpSinglePath({
    path: pathNodeModules,
    isDebug: true,
  });

  await cleanUpSinglePath({
    path: pathTools,
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
