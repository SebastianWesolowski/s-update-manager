import { AvailableSUMKeySuffixTypes } from '@/feature/config/types';
import { sumFile } from '@/feature/updateFileMapConfig';
import { readFile } from '@/util/readFile';

export const getContentToBuild = async (
  sumSetObject: {
    [K in AvailableSUMKeySuffixTypes]?: sumFile;
  } & { defaultFile: sumFile }
): Promise<string | null | undefined> => {
  const { defaultFile, customFile, extendFile } = sumSetObject;
  if (
    sumSetObject &&
    [defaultFile.isCreated, customFile?.isCreated, extendFile?.isCreated].some((data) => data !== false)
  ) {
    if (customFile?.isCreated) {
      const contentCustomFile = await readFile(customFile?.path || '');
      if (contentCustomFile.length) {
        return await readFile(customFile?.path || '');
      }
    }

    if (extendFile?.isCreated) {
      const contentExtendFile = await readFile(extendFile?.path || '');
      if (contentExtendFile.length) {
        return (await readFile(defaultFile.path || '')) + '\n' + (await readFile(extendFile.path || ''));
      }
    }
    if (defaultFile.isCreated) {
      return await readFile(defaultFile.path || '');
    }
  } else {
    return null;
  }
};
