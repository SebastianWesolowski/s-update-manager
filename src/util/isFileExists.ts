import fs from 'fs';

/**
 * Checks the existence of a file in the file system.
 *
 * @param {string} filePath - The path to the file whose existence is to be checked.
 * @returns {Promise<boolean>} - Returns a Promise representing whether the file exists.
 *                              Resolves to true if the file exists, and false otherwise.
 */
export async function isFileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath); // Użyj fs.promises.access lub obsłuż callback
    return true;
  } catch (error) {
    return false;
  }
}
