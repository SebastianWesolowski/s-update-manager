import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';
import { isFolderExist } from '@/util/isFolderExist';

export const cleanUpFiles = async ({
  snpCatalog, //TODO - make it reusable
  directoryPath,
  isDebug,
}: {
  snpCatalog: string;
  directoryPath: string;
  isDebug: boolean;
}): Promise<void> => {
  if (
    await isFolderExist({
      folderPath: snpCatalog,
      createFolder: false,
    })
  ) {
    await deletePath(createPath(snpCatalog), isDebug);
  }

  if (
    await isFolderExist({
      folderPath: directoryPath,
      createFolder: false,
    })
  ) {
    const allFiles = await searchFilesInDirectory({ directoryPath });
    for (const file of allFiles) {
      await deletePath(createPath(file), isDebug);
    }
    await deletePath(createPath(directoryPath), isDebug);
  }
};
