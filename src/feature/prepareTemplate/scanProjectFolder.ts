import { ConfigTemplateType } from '@/feature/config/types';
import { debugFunction } from '@/util/debugFunction';
import { scanDirectory } from '@/util/scanDirectory';

export const scanProjectFolder = async (
  config: ConfigTemplateType
): Promise<{ config: ConfigTemplateType; fileList: string[] | [] }> => {
  debugFunction(config.isDebug, { config }, '[PrepareTemplate] Scan project folder');

  // Asynchroniczne skanowanie katalogu i filtracja

  return scanDirectory(config.projectCatalog, [config.templateCatalogPath, config.templateCatalogPath])
    .then((fileList) => {
      const cleanupArray = fileList.map((file) => {
        return file.replace(config.projectCatalog.replace('./', ''), '');
      });
      return { config, fileList: cleanupArray }; // Wyświetli przefiltrowane pliki
    })
    .catch((error) => {
      console.error('An error occurred:', error);
      return { config, fileList: [] }; // Wyświetli przefiltrowane plikireturn [];
    });
};
