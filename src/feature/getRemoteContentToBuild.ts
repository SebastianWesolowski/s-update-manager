import { ConfigType } from '@/feature/config/types';
import { sumFile } from '@/feature/updateFileMapConfig';
import { createCatalog } from '@/util/createCatalog';
import { buildURL } from '@/util/formatterRepositoryFileNameUrl';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { wgetAsync } from '@/util/wget';

export const getRemoteContentToBuild = async ({
  config,
  sumObject,
}: {
  config: ConfigType;
  sumObject: sumFile;
}): Promise<string | null | undefined> => {
  try {
    const contentUrl = buildURL({
      baseURL: config.remoteRootRepositoryUrl,
      relativePaths: [sumObject.SUMSuffixFileName],
    });
    if (!(await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.temporaryFolder }))) {
      await createCatalog(config.temporaryFolder);
    }
    return await wgetAsync(contentUrl, config.temporaryFolder).then(async (remoteContent) => {
      return remoteContent;
    });
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
};
