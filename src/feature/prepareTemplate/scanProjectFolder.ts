import { ConfigTemplateType } from '@/feature/config/types';
import { createPath } from '@/util/createPath';
import { debugFunction } from '@/util/debugFunction';
import { scanDirectory } from '@/util/scanDirectory';

export const scanProjectFolder = async (
  config: ConfigTemplateType
): Promise<{ config: ConfigTemplateType; fileList: string[] | [] }> => {
  debugFunction(config.isDebug, { config }, '[PrepareTemplate - scanProjectFolder START]');

  const excludePaths = [
    createPath([config.projectCatalog, '.DS_Store']).replace('./', ''),
    createPath([config.projectCatalog, config.repositoryMapFileName]).replace('./', ''),
    createPath([config.projectCatalog, config.templateCatalogName]).replace('./', ''),
  ];

  return scanDirectory(config.projectCatalog, excludePaths)
    .then((fileList) => {
      debugFunction(config.isDebug, { config, fileList }, '[PrepareTemplate - scanDirectory - START]');
      const cleanupArray = fileList.map((file) => {
        return file.replace(config.projectCatalog + '/', '');
      });
      debugFunction(config.isDebug, { config, fileList, cleanupArray }, '[PrepareTemplate - scanDirectory - END]');
      debugFunction(config.isDebug, { config }, '[PrepareTemplate - scanProjectFolder END]');
      return { config, fileList: cleanupArray }; // Wyświetli przefiltrowane pliki
    })
    .catch((error) => {
      console.error('An error occurred:', error);
      return { config, fileList: [] }; // Wyświetli przefiltrowane plikireturn [];
    });
};
