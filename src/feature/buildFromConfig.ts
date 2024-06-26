import { ConfigType, createPath } from '@/feature/defaultConfig';
import { getContentToBuild } from '@/feature/getContnetToBuild';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export const buildFromConfig = async (config: ConfigType): Promise<ConfigType> => {
  const snpFileMap: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  for (const keyFileName in snpFileMap.snpFileMap) {
    const content = await getContentToBuild({ config, filePath: keyFileName });

    if (content) {
      await createFile({
        filePath: createPath([config.projectCatalog, keyFileName]),
        content,
        isDebug: config.isDebug,
      });
    }
  }

  // for (const fileName of snpFileMap.snpFileMap) {
  //   console.log(fileName);
  // }
  //refaktor fileMapConfig to na postawie jego powinny byc budowane pliki
  //updatefilemapconfig utils ktory rozpoczal refaktor
  // sprawdzic pozostale configi i skrypty
  // pytanie czy pliki z update sa poprawnie usuwane

  // newConfig.fileMap = config.fileMap;
  //
  // if (newConfig?.fileMap) {
  //   newConfig.fileMap.snpFiles = {};
  // }
  //
  // const buildFile = async (config: ConfigType) => {
  //   const files = config?.fileMap?.files;
  //
  //   if (files) {
  //     const arrayFileNames = Object.keys(files);
  //     for (const fileName of arrayFileNames) {
  //       const defaultFilePath = files[fileName].find((element) => element.includes('-default.md')) || '';
  //       const instructionsFilePath = files[fileName].find((element) => element.includes('-instructions.md')) || '';
  //       const customFilePath = defaultFilePath.replace('-default.md', '-custom.md');
  //       const extendFilePath = defaultFilePath.replace('-default.md', '-extend.md');
  //
  //       const contentDefaultFile = await readFile(defaultFilePath);
  //       await createFile({
  //         filePath: createPath([config.projectCatalog, fileName]),
  //         content: contentDefaultFile,
  //         isDebug: config.isDebug,
  //       });
  //
  //       await createFile({
  //         filePath: customFilePath,
  //         content: '',
  //         isDebug: config.isDebug,
  //       });
  //
  //       await createFile({
  //         filePath: extendFilePath,
  //         content: '',
  //         isDebug: config.isDebug,
  //       });
  //
  //       if (newConfig?.fileMap && newConfig.fileMap.snpFiles) {
  //         newConfig.fileMap.snpFiles[fileName] = {
  //           defaultFile: defaultFilePath,
  //           instructionsFile: instructionsFilePath,
  //           customFile: customFilePath,
  //           extendFile: extendFilePath,
  //         };
  //       }
  //     }
  //   }
  //
  //   await updateJson({
  //     filePath: createPath([config.projectCatalog, config.REPOSITORY_MAP_FILE_NAME]),
  //     newContent: newConfig,
  //     replace: true,
  //   });
  //
  //   await updateJson({
  //     filePath: config.snpConfigFile,
  //     newContent: newConfig,
  //     replace: true,
  //   });
  // };
  // await buildFile(config);
  return config;
};
