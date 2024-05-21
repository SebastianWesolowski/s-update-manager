import { ConfigType, createPath } from '@/feature/defaultConfig';
import { createFile } from '@/util/createFile';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJson } from '@/util/updateJson';

export const buildFromConfig = async (config: ConfigType): Promise<ConfigType> => {
  const newConfig: ConfigType = await readFile(config.snpConfigFile).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );
  newConfig.fileMap = config.fileMap;

  if (newConfig?.fileMap) {
    newConfig.fileMap.snpFiles = {};
  }

  const buildFile = async (config: ConfigType) => {
    const files = config?.fileMap?.files;

    if (files) {
      const arrayFileNames = Object.keys(files);
      for (const fileName of arrayFileNames) {
        const defaultFilePath = files[fileName].find((element) => element.includes('-default.md')) || '';
        const instructionsFilePath = files[fileName].find((element) => element.includes('-instructions.md')) || '';
        const customFilePath = defaultFilePath.replace('-default.md', '-custom.md');
        const extendFilePath = defaultFilePath.replace('-default.md', '-extend.md');

        const contentDefaultFile = await readFile(defaultFilePath);
        await createFile({
          filePath: createPath([config.projectCatalog, fileName]),
          content: contentDefaultFile,
          isDebug: config.isDebug,
        });

        await createFile({
          filePath: customFilePath,
          content: '',
          isDebug: config.isDebug,
        });

        await createFile({
          filePath: extendFilePath,
          content: '',
          isDebug: config.isDebug,
        });

        if (newConfig?.fileMap && newConfig.fileMap.snpFiles) {
          newConfig.fileMap.snpFiles[fileName] = {
            defaultFile: defaultFilePath,
            instructionsFile: instructionsFilePath,
            customFile: customFilePath,
            extendFile: extendFilePath,
          };
        }
      }
    }

    await updateJson({
      filePath: config.snpConfigFile,
      newContent: newConfig,
      replace: true,
    });
  };
  await buildFile(config);
  return config;
};
