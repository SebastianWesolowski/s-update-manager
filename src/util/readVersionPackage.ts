import { redFile } from '@/util/readFile';

export async function readPackageVersion(filePath: string): Promise<string> {
  try {
    const data = await redFile(filePath);
    const packageJson = JSON.parse(data);

    return packageJson.version;
  } catch (err) {
    console.error('Błąd podczas odczytu pliku package.json', err);
    throw err; // Przekaż błąd dalej, aby był obsłużony przez wywołującą funkcję
  }
}
