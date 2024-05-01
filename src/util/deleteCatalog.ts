import fs from 'fs';

export async function deleteCatalog(filePath: string, isDebug?: boolean) {
  try {
    await fs.promises.rm(filePath, { recursive: true, force: true });
    if (isDebug) {
      console.log('The catalogue has been removed:', filePath);
    }
  } catch (error) {
    console.error('Error when deleting a directory:', error);
    throw error;
  }
}
