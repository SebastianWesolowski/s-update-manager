import { AvailableSNPKeySuffixTypes, ConfigType } from '@/feature/config/types';
import { snpFile } from '@/feature/updateFileMapConfig';
import { formatterRepositoryFileNameUrl } from '@/util/formatterRepositoryFileNameUrl';
import { readFile } from '@/util/readFile';
import { wgetAsync } from '@/util/wget';

export const getRemoteContentToBuild = async ({
  config,
  snpObject,
}: {
  config: ConfigType;
  snpObject: snpFile;
}): Promise<string | null | undefined> => {
  try {
    const repositoryMapFileUrl = formatterRepositoryFileNameUrl({
      repositoryUrl: config.repositoryUrl,
      fileName: snpObject.SNPSuffixFileName,
    });
    return await wgetAsync(repositoryMapFileUrl, config.temporaryFolder).then(async (remoteContent) => {
      return remoteContent;
    });
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
};

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
    //END HERE dopisać pozostale mozliwości
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
