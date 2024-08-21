import { readdir, rmdir, stat, unlink } from 'fs/promises';
import { join } from 'path';

/**
 * Usuwa wszystkie pliki i podkatalogi z danego katalogu.
 *
 * @param directory - Ścieżka do katalogu, z którego mają zostać usunięte wszystkie pliki i podkatalogi.
 * @returns Promise<void> - Zwraca obietnicę, która jest spełniona po usunięciu wszystkich plików i podkatalogów.
 *
 * @throws Error - Jeśli nie można odczytać katalogu lub usunąć pliku/katalogu.
 */
export async function clearDirectory(directory: string): Promise<void> {
  try {
    const files = await readdir(directory);

    const deletionPromises = files.map(async (file) => {
      const filePath = join(directory, file);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory()) {
        // Jeśli to katalog, wywołujemy funkcję rekurencyjnie
        await clearDirectory(filePath);
        // Po wyczyszczeniu katalogu usuwamy go
        await rmdir(filePath);
      } else {
        // Jeśli to plik, usuwamy go
        await unlink(filePath);
      }
    });

    await Promise.all(deletionPromises);
    console.log(`Wszystkie pliki i podkatalogi w katalogu "${directory}" zostały usunięte.`);
  } catch (error: any) {
    throw new Error(`Nie udało się usunąć plików z katalogu: ${error?.message || error}`);
  }
}
