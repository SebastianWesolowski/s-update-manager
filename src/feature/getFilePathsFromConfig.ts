import { ConfigType } from '@/feature/defaultConfig';
import { FileMapConfig, snpArrayPathFileSet } from '@/feature/updateFileMapConfig';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const getFilePathsFromConfig = async ({
  config,
}: {
  config: ConfigType;
}): Promise<Record<string, snpArrayPathFileSet> | null> => {
  const snpFileMapContent: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  console.log(snpFileMapContent);

  if (snpFileMapContent.snpFileMap) {
    return snpFileMapContent.snpFileMap;
  } else {
    return null;
  }
};
