import * as fs from 'fs/promises';
import * as path from 'path';

interface FilterOptions {
  includeExtensions?: string[]; // Rozszerzenia plików do uwzględnienia
  excludeExtensions?: string[]; // Rozszerzenia plików do odrzucenia
  ignorePaths?: string[]; // Ścieżki do ignorowania
}

interface ScanOptions {
  includeHiddenFiles?: boolean;
}

type FilePathArray = string[];

/**
 * Asynchronicznie skanuje katalog i zwraca tablicę ścieżek do wszystkich plików.
 *
 * @param dir - Ścieżka do katalogu, który ma być przeskanowany.
 * @param options - Opcjonalne parametry skanowania.
 * @param filterFn - Funkcja filtrująca, która ma być zastosowana do ścieżek plików.
 * @returns Promise z tablicą ścieżek do przefiltrowanych plików.
 */
export async function scanDirectory(
  dir: string,
  options: ScanOptions = {},
  filterFn: (filePath: string) => boolean = () => true // Domyślnie brak filtrowania
): Promise<FilePathArray> {
  const { includeHiddenFiles = false } = options;
  let fileList: FilePathArray = [];

  try {
    // Sprawdź, czy katalog istnieje
    try {
      await fs.access(dir);
    } catch {
      throw new Error(`Directory does not exist: ${dir}`);
    }

    // Odczytaj zawartość katalogu
    const files = await fs.readdir(dir);

    for (const file of files) {
      if (!includeHiddenFiles && file.startsWith('.')) {
        continue;
      }

      const fullPath = path.join(dir, file);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        // Rekurencyjnie skanuj katalog
        fileList = fileList.concat(await scanDirectory(fullPath, options, filterFn));
      } else if (stat.isFile() && filterFn(fullPath)) {
        // Dodaj ścieżkę do pliku, jeśli pasuje do filtru
        fileList.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory: ${dir}`, error);
    throw error;
  }

  return fileList;
}
