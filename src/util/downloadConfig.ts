import path from 'path';
import { format } from 'url';
import { defaultConfigType } from '@/feature/defaultConfig';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { wgetAsync } from '@/util/wget';

export async function downloadConfig(
  config: defaultConfigType
): Promise<{ fileMap: string[]; templateVersion: string }> {
  const { template, temporaryFolder, isDebug, snpCatalog, remoteRepository } = config;
  const REPOSITORY_MAP_FILE_NAME = 'repositoryMap.json';
  const repositoryUrl = `${remoteRepository}${template}`;
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
      debugFunction(isDebug, { content, repositoryMapFileUrl, REPOSITORY_MAP_FILE_NAME }, 'download from remote repo');
      await createFile({
        filePath: path.join(snpCatalog, REPOSITORY_MAP_FILE_NAME),
        content,
      });

      for (const fileName of JSON.parse(content).fileMap) {
        await wgetAsync(formatterRepositoryFileNameUrl({ fileName }), temporaryFolder).then(async (contentFile) => {
          await createFile({
            filePath: path.join(snpCatalog, fileName),
            content: contentFile,
          });
        });
      }
      return { fileMap: JSON.parse(content).fileMap, templateVersion: JSON.parse(content).templateVersion };
    });
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
}
