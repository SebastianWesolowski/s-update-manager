import { ConfigType } from '@/feature/defaultConfig';
import { getFilePathsFromConfig } from '@/feature/getFilePathsFromConfig';
import { readFile } from '@/util/readFile';

export const getContentToBuild = async ({
  config,
  filePath,
}: {
  config: ConfigType;
  filePath: string;
}): Promise<string | null> => {
  const fileSet = await getFilePathsFromConfig({ config });

  if (fileSet) {
    const contentFile = fileSet[filePath];

    if (contentFile['customFile']) {
      return await readFile(contentFile['customFile']);
    }

    if (contentFile['extendFile']) {
      return (await readFile(contentFile['defaultFile'])) + '\n' + (await readFile(contentFile['extendFile']));
    }

    return await readFile(contentFile['defaultFile']);
  } else {
    return null;
  }
};
