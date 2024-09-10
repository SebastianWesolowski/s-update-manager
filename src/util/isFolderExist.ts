import { access, constants, mkdir } from 'fs';
import path from 'path';
import { promisify } from 'util';

/**
 * Checks if a folder exists at the given path.
 * If the folder does not exist and createFolder is true, it creates the folder.
 * @param {string} folderPath - The path of the folder to check.
 * @param {boolean} createFolder - If true, create the folder if it doesn't exist.
 * @param {boolean} [isDebug] - If true, enables debug logging.
 * @returns {Promise<boolean>} - Returns true if the folder exists or is created successfully, otherwise false.
 */
export async function isFolderExist({
  folderPath,
  createFolder,
  isDebug,
}: {
  folderPath: string;
  createFolder: boolean;
  isDebug?: boolean;
}): Promise<boolean> {
  const accessPromise = promisify(access);
  const mkdirPromise = promisify(mkdir);

  try {
    const folders = folderPath.split(path.sep);

    for (let i = 1; i <= folders.length; i++) {
      const partialPath = path.join(...folders.slice(0, i));
      try {
        await accessPromise(partialPath, constants.R_OK | constants.W_OK);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT' && createFolder) {
          await mkdirPromise(partialPath);
        } else {
          throw error;
        }
      }
    }

    return true;
  } catch (error) {
    if (isDebug) {
      console.info(`Folder does not exist or cannot be accessed: ${folderPath}. ${(error as Error).message}`);
    }
    return false;
  }
}
