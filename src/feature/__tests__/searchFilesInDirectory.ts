import * as fs from 'fs';
import * as path from 'path';

export function searchFilesInDirectory({
  directoryPath,
  phrases,
  excludedFileNames = [],
  excludedPhrases = [],
}: {
  directoryPath: string;
  phrases?: string[];
  excludedFileNames?: string[];
  excludedPhrases?: string[]; // Nowy parametr do wykluczania plików na podstawie fraz w ścieżce
}): string[] {
  const matchingFiles: string[] = [];

  // Pobranie wszystkich plików i folderów w katalogu
  const items = fs.readdirSync(directoryPath);

  items.forEach((item) => {
    const itemPath = path.join(directoryPath, item);

    // Sprawdzenie, czy to plik
    if (fs.statSync(itemPath).isFile()) {
      // Sprawdzenie, czy nazwa pliku znajduje się na liście wykluczeń
      if (excludedFileNames.includes(item)) {
        return; // Pominięcie tego pliku
      }

      // Sprawdzenie, czy ścieżka zawiera którąkolwiek z wykluczających fraz
      if (excludedPhrases.some((phrase) => itemPath.includes(phrase))) {
        return; // Pominięcie tego pliku
      }

      // Sprawdzenie, czy nazwa pliku lub ścieżka zawiera którąkolwiek z fraz
      if (phrases) {
        for (const phrase of phrases) {
          if (itemPath.includes(phrase)) {
            matchingFiles.push(itemPath);
            break; // Przerywamy, jeśli jedna z fraz została znaleziona
          }
        }
      } else {
        matchingFiles.push(itemPath);
      }
    } else if (fs.statSync(itemPath).isDirectory()) {
      // Jeśli to folder, rekurencyjnie przeszukaj jego zawartość
      const nestedMatchingFiles = searchFilesInDirectory({
        directoryPath: itemPath,
        phrases,
        excludedFileNames,
        excludedPhrases, // Przekazujemy dalej wykluczające frazy
      });
      matchingFiles.push(...nestedMatchingFiles);
    }
  });

  return matchingFiles;
}
