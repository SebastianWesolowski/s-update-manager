import deepmerge from 'deepmerge';
import { readFile } from 'fs-extra';
import { createFile } from '@/util/createFile';
import { parseJSON } from '@/util/parseJSON';

export async function updateJson({
  filePath,
  newContent,
  replace = false,
}: {
  filePath: string;
  newContent: object;
  replace?: boolean;
}): Promise<void> {
  try {
    return readFile(filePath).then(async (bufferData) => {
      const jsonContent = parseJSON(bufferData.toString());
      const newJsonContent = replace ? newContent : deepmerge(jsonContent, newContent);

      await createFile({
        filePath,
        content: JSON.stringify(newJsonContent),
      });
    });
  } catch (err) {
    console.error(`Error while reading a file ${filePath}`, err);
    throw err;
  }
}
