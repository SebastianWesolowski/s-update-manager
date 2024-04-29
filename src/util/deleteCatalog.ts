import fs from 'fs';

export async function deleteCatalog(filePath: string) {
  try {
    await fs.promises.rm(filePath, { recursive: true, force: true });
    console.log('Katalog został usunięty:', filePath);
  } catch (error) {
    console.error('Błąd podczas usuwania katalogu:', error);
    throw error;
  }
}
