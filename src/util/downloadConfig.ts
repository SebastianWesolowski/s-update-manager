import path from 'path';
import { format } from 'url';
import { BuildConfig, ConfigType, createPath } from '@/feature/defaultConfig';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { parseJSON } from '@/util/parseJSON';
import { wgetAsync } from '@/util/wget';

export async function downloadConfig(config: ConfigType): Promise<BuildConfig> {
  const { template, temporaryFolder, isDebug, snpCatalog, remoteRepository, REPOSITORY_MAP_FILE_NAME } = config;
  const repositoryUrl = `${remoteRepository}${template}`;
  const formatterRepositoryFileNameUrl = ({
    repository,
    fileName,
  }: {
    repository: string;
    fileName: string;
  }): string => {
    const urlObj = new URL(repository);

    urlObj.pathname = `${urlObj.pathname}/${fileName}`;

    return format(urlObj);
  };

  try {
    const repositoryMapFileUrl = formatterRepositoryFileNameUrl({
      repository: repositoryUrl,
      fileName: REPOSITORY_MAP_FILE_NAME,
    });
    return await wgetAsync(repositoryMapFileUrl, temporaryFolder).then(async (content) => {
      debugFunction(isDebug, { content, repositoryMapFileUrl, REPOSITORY_MAP_FILE_NAME }, 'download from remote repo');
      await createFile({
        filePath: createPath([snpCatalog, REPOSITORY_MAP_FILE_NAME]),
        content,
      });

      for (const fileName of parseJSON(content).fileMap) {
        await wgetAsync(formatterRepositoryFileNameUrl({ repository: repositoryUrl, fileName }), temporaryFolder).then(
          async (contentFile) => {
            await createFile({
              filePath: createPath([snpCatalog, fileName]),
              content: contentFile,
            });
          }
        );
      }

      const organizeFileMap = (map: string[]): { map: string[]; files: Record<string, string[]> } => {
        const files = {};

        map.forEach((file) => {
          const fileName = file.substring(0, file.lastIndexOf('-'));

          if (!files[fileName]) {
            files[fileName] = [];
          }
          files[fileName].push(path.join(config.snpCatalog, file));
        });
        return { map, files };
      };

      return {
        fileMap: organizeFileMap(parseJSON(content).fileMap),
        templateVersion: parseJSON(content).templateVersion,
      };
    });
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
}
