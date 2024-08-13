import { ConfigTemplateType } from '@/feature/config/types';
import { debugFunction } from '@/util/debugFunction';
import { scanDirectory } from '@/util/scanDirectory';

export const scanProjectFolder = async (
  config: ConfigTemplateType
): Promise<{ config: ConfigTemplateType; fileList: string[] } | { config: ConfigTemplateType; fileList: [] }> => {
  debugFunction(config.isDebug, { config }, '[PrepareTemplate] Scan project folder');

  const filterFn = (filePath: string): boolean => {
    // Przykładowa funkcja filtrująca - dostosuj według potrzeb
    return !filePath.endsWith('.DS_Store'); // Odrzuca pliki .DS_Store
  };

  // Asynchroniczne skanowanie katalogu i filtracja
  scanDirectory(config.projectCatalog, { includeHiddenFiles: true }, filterFn)
    .then((fileList) => {
      const cleanupArray = fileList.map((file) => {
        return file.replace(config.projectCatalog.replace('./', ''), '');
      });
      return { config, fileList: cleanupArray }; // Wyświetli przefiltrowane pliki
    })
    .catch((error) => {
      console.error('An error occurred:', error);
    });
  return { config, fileList: [] }; // Wyświetli przefiltrowane plikireturn [];
};
