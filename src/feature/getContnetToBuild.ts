import { AvailableSNPKeySuffixTypes } from '@/feature/config/types';
import { snpFile } from '@/feature/updateFileMapConfig';
import { readFile } from '@/util/readFile';

export const getContentToBuild = async (
  snpSetObject: {
    [K in AvailableSNPKeySuffixTypes]?: snpFile;
  } & { defaultFile: snpFile }
): Promise<string | null | undefined> => {
  const { defaultFile, customFile, extendFile } = snpSetObject;
  if (
    snpSetObject &&
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
