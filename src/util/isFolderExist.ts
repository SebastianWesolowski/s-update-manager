import { constants, promises as fsPromises } from 'fs';
import path from 'path';

/**
 * Checks if a folder exists at the given path.
 * If the folder does not exist and createFolder is true, it creates the folder.
 * @param {string} folderPath - The path of the folder to check.
 * @param {boolean} createFolder - If true, create the folder if it doesn't exist.
 * @returns {Promise<boolean>} - Returns true if the folder exists or is created successfully, otherwise false.
 */
export async function isFolderExist({
  folderPath,
  createFolder,
}: {
  folderPath: string;
  createFolder: boolean;
}): Promise<boolean> {
  try {
    const folders = folderPath.split(path.sep);

    for (let i = 1; i <= folders.length; i++) {
      const partialPath = path.join(...folders.slice(0, i));
      try {
        await fsPromises.access(partialPath, constants.R_OK | constants.W_OK);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT' && createFolder) {
          await fsPromises.mkdir(partialPath);
        } else {
          throw error;
        }
      }
    }

    return true;
  } catch (error) {
    console.error(`Error checking or creating folder: ${(error as Error).message}`);
    return false;
  }
}
