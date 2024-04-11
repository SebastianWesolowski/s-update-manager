import { format } from 'url';
import { availableTemplate } from '@/init';
import { createFile } from '@/util/createFile';
import { wgetAsync } from '@/util/wget';

export async function downloadConfig(template: availableTemplate, filePath: string): Promise<string[]> {
  const REPOSITORY_MAP_FILE_NAME = 'repositoryMap.json';
  // TODO parametryzacaj tego url
  const repositoryUrl = `https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/${template}`;

  const formatterRepositoryFileNameUrl = ({
    repository,
    fileName,
  }: {
    repository?: string | undefined;
    fileName: string;
  }): string => {
    const urlObj = new URL(repository || repositoryUrl);

    urlObj.pathname = `${urlObj.pathname}/${fileName}`;

    return format(urlObj);
  };

  try {
    const repositoryMapFileUrl = formatterRepositoryFileNameUrl({ fileName: REPOSITORY_MAP_FILE_NAME });

    return await wgetAsync(repositoryMapFileUrl).then(async (content) => {
      await createFile({
        filePath: `${filePath}/${REPOSITORY_MAP_FILE_NAME}`,
        content,
      });

      for (const fileName of JSON.parse(content).fileMap) {
        await wgetAsync(formatterRepositoryFileNameUrl({ fileName })).then(async (contentFile) => {
          console.log(filePath);
          await createFile({
            filePath: `${filePath}/${fileName}`,
            content: contentFile,
          });
        });
      }

      return JSON.parse(content).fileMap;
    });
  } catch (err) {
    console.error('Błąd podczas pobierania configu z githuba', err);
    throw err; // Przekaż błąd dalej, aby był obsłużony przez wywołującą funkcję
  }
}
