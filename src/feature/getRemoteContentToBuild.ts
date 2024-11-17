import { ConfigType } from '@/feature/config/types';
import { sumFile } from '@/feature/updateFileMapConfig';
import { createCatalog } from '@/util/createCatalog';
import { buildURL } from '@/util/formatterRepositoryFileNameUrl';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { wgetAsync } from '@/util/wget';

export const getRemoteContentToBuild = async ({
  config,
  sumObject,
  relativePaths,
  type = 'string',
}: {
  config: ConfigType;
  sumObject?: sumFile;
  relativePaths?: string[];
  type?: 'string' | 'buffer';
}): Promise<string | Buffer | undefined | null> => {
  try {
    const contentUrl = buildURL({
      baseURL: config.remoteRootRepositoryUrl,
      relativePaths: relativePaths?.length ? relativePaths : [sumObject?.SUMSuffixFileName || ''],
    });
    if (!(await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.temporaryFolder }))) {
      await createCatalog(config.temporaryFolder);
    }

    if (type === 'buffer') {
      const response = await fetch(contentUrl);
      const buffer = await response.arrayBuffer();
      return Buffer.from(buffer);
    }

    return await wgetAsync(contentUrl, config.temporaryFolder).then(async (remoteContent) => {
      return remoteContent;
    });
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
};
