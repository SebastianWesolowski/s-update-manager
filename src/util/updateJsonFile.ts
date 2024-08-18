import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { debugFunction } from '@/util/debugFunction';
import { isFileExists } from '@/util/isFileExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJson } from '@/util/updateJson';

export const updateJsonFile = async ({
  filePath,
  config,
  newContent,
  replaceFile = true,
}: {
  filePath: string;
  config: {
    isDebug: boolean;
  } & Record<string, any>;
  newContent: object;
  replaceFile?: boolean;
}): Promise<FileMapConfig | null> => {
  if (await isFileExists(filePath)) {
    return await updateJson({ filePath: filePath, newContent, replace: replaceFile }).then(() => {
      if (replaceFile) {
        return newContent as FileMapConfig;
      }
      return readFile(filePath).then(async (bufferData) => {
        return parseJSON(bufferData.toString());
      });
    });
  } else {
    debugFunction(config?.isDebug, `file snpFileMapConfig is not exist ${filePath}`, '[updateFileMapConfig]');
    return null;
  }
};
