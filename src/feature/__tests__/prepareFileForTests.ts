import { cleanUpSinglePath } from './cleanForTests';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';

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
      isDebug,
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
  templateCase: 'templateCatalog' | 'templateCatalogUpdate' | 'templateCatalogWithImage' = 'templateCatalog'
) => {
  let projectCatalog;
  if (templateCase === 'templateCatalog') {
    projectCatalog = 'mockTemplate';
  } else if (templateCase === 'templateCatalogWithImage') {
    projectCatalog = 'mockTemplateWithImage';
  } else {
    projectCatalog = 'mockTemplateUpdate';
  }
  let folder = `${projectCatalog}/templateCatalog`;

  if (type === 'test') {
    folder = folder.replace('/templateCatalog', '');
    await cleanUpSinglePath({
      path: `./test/${folder}`,
      isDebug: true,
    });
    return;
  }

  const folderNodeModule = `${projectCatalog}/node_modules`;
  const folderTools = `${projectCatalog}/tools`;
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
  folderCase: 'mockProject' | 'mockProjectToBuild' | 'mockProjectToUpdate' = 'mockProject'
) => {
  const rootPath = getCleanupPath(type, folderCase, step);
  let sumPath = '';
  if (folderCase === 'mockProject') {
    sumPath = createPath([rootPath, '.sum']);
  }

  await deletePath(createPath([rootPath, '.sum.config.json']), true);

  await cleanUpSinglePath({
    path: sumPath !== '' ? sumPath : rootPath,
    isDebug: true,
  });
};
