import { format } from 'url';
import { ConfigType, createPath } from '@/feature/defaultConfig';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';
import { debugFunction } from '@/util/debugFunction';
import { getRealFileName } from '@/util/getRealFileName';
import { objectToBuffer } from '@/util/objectToBuffer';
import { parseJSON } from '@/util/parseJSON';
import { wgetAsync } from '@/util/wget';

export async function downloadConfig(config: ConfigType): Promise<FileMapConfig> {
  const {
    template,
    temporaryFolder,
    isDebug,
    snpCatalog,
    remoteRepository,
    REPOSITORY_MAP_FILE_NAME,
    snpFileMapConfig,
  } = config;
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
    return await wgetAsync(repositoryMapFileUrl, temporaryFolder).then(async (snpFileMapConfigContent) => {
      debugFunction(
        isDebug,
        { snpFileMapConfigContent, repositoryMapFileUrl, REPOSITORY_MAP_FILE_NAME },
        'download from remote repo'
      );

      for (const fileName of parseJSON(snpFileMapConfigContent).fileMap) {
        await wgetAsync(formatterRepositoryFileNameUrl({ repository: repositoryUrl, fileName }), temporaryFolder).then(
          async (contentFile) => {
            await createFile({
              filePath: createPath([snpCatalog, fileName]),
              content: contentFile,
            });
          }
        );
      }

      const realFileName = getRealFileName({ config, contentToCheck: parseJSON(snpFileMapConfigContent).fileMap });

      const updatedContent: FileMapConfig = parseJSON(snpFileMapConfigContent);
      if (!updatedContent.snpFileMap) {
        updatedContent.snpFileMap = {};
      }

      realFileName.forEach((file) => {
        if (updatedContent.snpFileMap) {
          updatedContent.snpFileMap[file] = {
            defaultFile: updatedContent.fileMap.includes(file + '-default.md')
              ? createPath([snpCatalog, `${file}-default.md`])
              : '',
            instructionsFile: updatedContent.fileMap.includes(file + '-instructions.md')
              ? createPath([snpCatalog, `${file}-instructions.md`])
              : '',
            customFile: updatedContent.fileMap.includes(file + '-custom.md')
              ? createPath([snpCatalog, `${file}-custom.md`])
              : '',
            extendFile: updatedContent.fileMap.includes(file + '-extend.md')
              ? createPath([snpCatalog, `${file}-extend.md`])
              : '',
          };

          for (const key in updatedContent.snpFileMap[file]) {
            if (updatedContent.snpFileMap[file][key] === '') {
              delete updatedContent.snpFileMap[file][key];
            }
          }
        }
      });

      await createFile({
        filePath: snpFileMapConfig,
        content: objectToBuffer(updatedContent),
      });

      return updatedContent;
    });
  } catch (err) {
    console.error('Error while downloading config from github', err);
    throw err;
  }
}
