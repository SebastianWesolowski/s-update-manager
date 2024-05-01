import path from 'path';
import { format } from 'url';
import { availableTemplate } from '@/init';
import { createFile } from '@/util/createFile';
import { wgetAsync } from '@/util/wget';

export async function downloadConfig(
  template: availableTemplate,
  filePath: string,
  temporaryFolder: string
): Promise<{ fileMap: string[]; templateVersion: string }> {
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
    return await wgetAsync(repositoryMapFileUrl, temporaryFolder).then(async (content) => {
      console.log({ content, repositoryMapFileUrl });
      await createFile({
        filePath: path.join(filePath, REPOSITORY_MAP_FILE_NAME),
        content,
      });

      for (const fileName of JSON.parse(content).fileMap) {
        await wgetAsync(formatterRepositoryFileNameUrl({ fileName }), temporaryFolder).then(async (contentFile) => {
          await createFile({
            filePath: path.join(filePath, fileName),
            content: contentFile,
          });
        });
      }
      return { fileMap: JSON.parse(content).fileMap, templateVersion: JSON.parse(content).templateVersion };
    });
  } catch (err) {
    console.error('Błąd podczas pobierania configu z githuba', err);
    throw err; // Przekaż błąd dalej, aby był obsłużony przez wywołującą funkcję
  }
}
