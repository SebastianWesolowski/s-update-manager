import fs from 'fs';

export async function redFile(filePath: string): Promise<string> {
  try {
    return await fs.promises.readFile(filePath, 'utf8');
  } catch (err) {
    console.error(`Błąd podczas odczytu pliku ${filePath}`, err);
    throw err; // Przekaż błąd dalej, aby był obsłużony przez wywołującą funkcję
  }
}
