import fs from 'fs';

export async function readFile(filePath: string, isDebug = false): Promise<string> {
  if (!fs.existsSync(filePath)) {
    const errorMessage = `File ${filePath} does not exist.`;
    if (isDebug) {
      console.error(errorMessage);
      console.error(new Error().stack); // Wyświetl stos wywołań dla debugowania
    }
    return ''; // Zwróć pustą zawartość, gdy plik nie istnieje
  }

  try {
    return await fs.promises.readFile(filePath, 'utf8');
  } catch (err) {
    if (isDebug) {
      console.error(`Error while reading file ${filePath}`, err);
      console.error(new Error().stack); // Wyświetl stos wywołań dla debugowania
    }
    throw err; // Przekaż błąd dalej, aby był obsłużony przez wywołującą funkcję
  }
}
