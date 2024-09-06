import { searchFilesInDirectory } from '../__tests__/searchFilesInDirectory';
import { ConfigTemplateType } from '@/feature/config/types';
import { createPath } from '@/util/createPath';
import { debugFunction } from '@/util/debugFunction';

export const scanProjectFolder = async (
  templateConfig: ConfigTemplateType
): Promise<{ templateConfig: ConfigTemplateType; templateFileList: string[] | [] }> => {
  debugFunction(templateConfig.isDebug, { templateConfig }, '[PrepareTemplate - scanProjectFolder START]');

  const excludePaths = [
    createPath([templateConfig.projectCatalog, 'node_modules/']),
    createPath([templateConfig.projectCatalog, 'test/']),
    createPath([templateConfig.projectCatalog, templateConfig.templateCatalogName]),
  ];
  return searchFilesInDirectory({
    directoryPath: templateConfig.projectCatalog,
    excludePaths: excludePaths,
    excludedFileNames: [createPath(templateConfig.repositoryMapFileName), '.DS_Store'],
    excludedPhrases: ['.backup'],
  })
    .then((fileList) => {
      debugFunction(
        templateConfig.isDebug,
        { templateConfig, fileList },
        '[PrepareTemplate - searchFilesInDirectory - START]'
      );
      const cleanupArray = fileList.map((file) => {
        return file.replace(templateConfig.projectCatalog + '/', '');
      });
      debugFunction(
        templateConfig.isDebug,
        { templateConfig, fileList, cleanupArray },
        '[PrepareTemplate - searchFilesInDirectory - END]'
      );
      debugFunction(templateConfig.isDebug, { templateConfig }, '[PrepareTemplate - scanProjectFolder END]');
      return { templateConfig, templateFileList: cleanupArray }; // Wyświetli przefiltrowane pliki
    })
    .catch((error) => {
      console.error('An error occurred:', error);
      return { templateConfig, templateFileList: [] }; // Wyświetli przefiltrowane plikireturn [];
    });
};
