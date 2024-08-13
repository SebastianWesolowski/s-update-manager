import path from 'path';

type FilePathArray = string[];

interface FilterOptions {
  includeExtensions?: string[]; // Rozszerzenia plików do uwzględnienia
  excludeExtensions?: string[]; // Rozszerzenia plików do odrzucenia
  ignorePaths?: string[]; // Ścieżki do ignorowania
}

/**
 * Filtruje tablicę ścieżek plików na podstawie podanych opcji.
 *
 * @param files - Tablica ścieżek do plików.
 * @param options - Opcjonalne parametry filtrowania.
 * @returns Tablica ścieżek do przefiltrowanych plików.
 */
export function filterFiles(files: FilePathArray, options: FilterOptions = {}): FilePathArray {
  const { includeExtensions = [], excludeExtensions = [], ignorePaths = [] } = options;

  return files.filter((filePath) => {
    const fileExt = path.extname(filePath).toLowerCase();
    const fileDir = path.dirname(filePath);

    if (ignorePaths.some((ignorePath) => fileDir.startsWith(ignorePath))) {
      return false;
    }

    if (includeExtensions.length > 0 && !includeExtensions.includes(fileExt)) {
      return false;
    }

    if (excludeExtensions.includes(fileExt)) {
      return false;
    }

    return true;
  });
}
