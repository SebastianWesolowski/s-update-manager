import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { isFolderExist } from '@/util/isFolderExist';

export const cleanUpFiles = async ({
  snpCatalog,
  directoryPath,
  isDebug,
}: {
  snpCatalog: string;
  directoryPath: string;
  isDebug: boolean;
}): Promise<void> => {
  if (
    await isFileOrFolderExists({
      filePath: snpCatalog,
      isDebug,
    })
  ) {
    await deletePath(createPath(snpCatalog), isDebug);
  }

  if (
    await isFileOrFolderExists({
      filePath: directoryPath,
      isDebug,
    })
  ) {
    const allFiles = await searchFilesInDirectory({ directoryPath });
    for (const file of allFiles) {
      await deletePath(createPath(file), isDebug);
    }
    await deletePath(createPath(directoryPath), isDebug);
  }
};

export const cleanUpSinglePath = async ({ path, isDebug }: { path: string; isDebug: boolean }): Promise<void> => {
  if (await isFileOrFolderExists({ filePath: path, isDebug })) {
    await deletePath(createPath(path), isDebug);
  }
};

export const cleanUpSpecificFiles = async ({
  files,
  isDebug,
}: {
  files: string[];
  isDebug: boolean;
}): Promise<void> => {
  for (const file of files) {
    if (await isFolderExist({ folderPath: file, createFolder: false })) {
      await deletePath(createPath(file), isDebug);
    }
  }
};
