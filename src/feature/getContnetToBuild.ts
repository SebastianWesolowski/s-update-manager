import { ConfigType } from '@/feature/defaultConfig';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const getContentToBuild = async ({
  config,
  filePath,
}: {
  config: ConfigType;
  filePath: string;
}): Promise<string | null> => {
  const snpFileMapContent: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  if (snpFileMapContent.snpFileMap) {
    const contentFile = snpFileMapContent.snpFileMap[filePath];

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
