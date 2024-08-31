import { ConfigType } from '@/feature/config/types';
import { snpFile } from '@/feature/updateFileMapConfig';
import { createCatalog } from '@/util/createCatalog';
import { buildURL } from '@/util/formatterRepositoryFileNameUrl';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { wgetAsync } from '@/util/wget';

export const getRemoteContentToBuild = async ({
  config,
  snpObject,
}: {
  config: ConfigType;
  snpObject: snpFile;
}): Promise<string | null | undefined> => {
  try {
    const contentUrl = buildURL({
      baseURL: config.remoteRootRepositoryUrl,
      relativePaths: [snpObject.SNPSuffixFileName],
    });
    if (!(await isFileOrFolderExists(config.temporaryFolder))) {
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
