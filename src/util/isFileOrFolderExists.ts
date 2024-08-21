import fs from 'fs';

/**
 * Checks the existence of a file or folder in the file system.
 *
 * @param {string} filePath - The path to the file or folder whose existence is to be checked.
 * @returns {Promise<boolean>} - Returns a Promise representing whether the file or folder exists.
 *                              Resolves to true if it exists, and false otherwise.
 */
export async function isFileOrFolderExists(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.isFile() || stats.isDirectory();
  } catch (error) {
    return false;
  }
}
