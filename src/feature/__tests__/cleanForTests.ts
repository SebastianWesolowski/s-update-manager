import { searchFilesInDirectory } from '@/feature/__tests__/searchFilesInDirectory';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';

export const cleanUpFiles = async ({
  snpCatalog,
  directoryPath,
  isDebug,
}: {
  snpCatalog: string;
  directoryPath: string;
  isDebug: boolean;
}): Promise<void> => {
  await deletePath(createPath(snpCatalog), isDebug);
  const allFiles = searchFilesInDirectory({ directoryPath });
  console.log(allFiles);
  // for (const file of allFiles) {
  //   await deletePath(createPath(file), isDebug);
  // }
};
