import fs from 'fs';

export async function createCatalog(filePath: string) {
  try {
    await fs.promises.mkdir(filePath, { recursive: true });
    return filePath;
  } catch (error) {
    console.error('Error while creating directory:', error);
    throw error;
  }
}
