import fs from 'fs';

export async function deletePath(targetPath: string, isDebug?: boolean) {
  try {
    const stats = await fs.promises.stat(targetPath);

    if (stats.isDirectory()) {
      await fs.promises.rm(targetPath, { recursive: true, force: true });
      if (isDebug) {
        console.log('The directory has been removed:', targetPath);
      }
      return;
    } else if (stats.isFile()) {
      await fs.promises.unlink(targetPath);
      if (isDebug) {
        console.log('The file has been removed:', targetPath);
      }
      return;
    } else {
      throw new Error(`Unsupported file type at path: ${targetPath}`);
    }
  } catch (error) {
    if (isDebug) {
      console.error('Error when deleting a path:', error);
    }
  }
}
