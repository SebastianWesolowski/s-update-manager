import deepmerge from 'deepmerge';
import { readFile } from 'fs-extra';
import { createFile } from '@/util/createFile';

export async function updateJson({ filePath, newContent }: { filePath: string; newContent: object }): Promise<void> {
  try {
    return readFile(filePath).then(async (bufferData) => {
      const jsonContent = JSON.parse(bufferData.toString());
      const newJsonContent = deepmerge(jsonContent, newContent);

      await createFile({
        filePath,
        content: JSON.stringify(newJsonContent),
      });
    });
  } catch (err) {
    console.error(`Błąd podczas odczytu pliku ${filePath}`, err);
    throw err; // Przekaż błąd dalej, aby był obsłużony przez wywołującą funkcję
  }
}
