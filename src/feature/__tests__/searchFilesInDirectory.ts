import * as fs from 'fs/promises';
import * as path from 'path';

export async function searchFilesInDirectory({
  directoryPath,
  phrases,
  excludedFileNames = [],
  excludedPhrases = [],
  excludePaths = [],
}: {
  directoryPath: string;
  phrases?: string[];
  excludedFileNames?: string[];
  excludedPhrases?: string[];
  excludePaths?: string[];
}): Promise<string[]> {
  const matchingFiles: string[] = [];

  // Normalizacja ścieżki wejściowej
  const normalizedDirectoryPath = directoryPath.startsWith('/') ? directoryPath : path.join('.', directoryPath);

  // Pobranie wszystkich plików i folderów w katalogu
  const items = await fs.readdir(normalizedDirectoryPath);

  // Usuwanie './' z początku ścieżek w excludePaths
  const cleanedExcludePaths = excludePaths.map((path) => (path.startsWith('./') ? path.slice(2) : path));

  for (const item of items) {
    const itemPath = path.join(normalizedDirectoryPath, item);

    // Sprawdzenie, czy ścieżka jest wykluczona
    if (cleanedExcludePaths.some((excludePath) => itemPath.includes(excludePath))) {
      continue; // Pominięcie tej ścieżki i wszystkich jej podfolderów/plików
    }

    // Sprawdzenie, czy to plik
    const stats = await fs.stat(itemPath);
    if (stats.isFile()) {
      // Sprawdzenie, czy nazwa pliku znajduje się na liście wykluczeń
      if (excludedFileNames.includes(item)) {
        continue; // Pominięcie tego pliku
      }

      // Sprawdzenie, czy ścieżka zawiera którąkolwiek z wykluczających fraz
      if (excludedPhrases.some((phrase) => itemPath.includes(phrase))) {
        continue; // Pominięcie tego pliku
      }

      // Sprawdzenie, czy nazwa pliku lub ścieżka zawiera którąkolwiek z fraz
      if (phrases) {
        for (const phrase of phrases) {
          if (itemPath.includes(phrase)) {
            matchingFiles.push(normalizePath(itemPath));
            break; // Przerywamy, jeśli jedna z fraz została znaleziona
          }
        }
      } else {
        matchingFiles.push(normalizePath(itemPath));
      }
    } else if (stats.isDirectory()) {
      // Jeśli to folder, rekurencyjnie przeszukaj jego zawartość, ale tylko jeśli nie jest wykluczony
      if (!cleanedExcludePaths.some((excludePath) => itemPath.includes(excludePath))) {
        const nestedMatchingFiles = await searchFilesInDirectory({
          directoryPath: itemPath,
          phrases,
          excludedFileNames,
          excludedPhrases,
          excludePaths: cleanedExcludePaths,
        });
        matchingFiles.push(...nestedMatchingFiles);
      }
    }
  }

  return matchingFiles;
}

function normalizePath(filePath: string): string {
  // Usuń './' z początku ścieżki, jeśli istnieje
  let normalizedPath = filePath.startsWith('./') ? filePath.slice(2) : filePath;

  // Zamień wszystkie podwójne ukośniki na pojedyncze
  normalizedPath = normalizedPath.replace(/\/\//g, '/');

  // Dodaj './' na początku, jeśli ścieżka nie zaczyna się od '/'
  return normalizedPath.startsWith('/') ? normalizedPath : './' + normalizedPath;
}
