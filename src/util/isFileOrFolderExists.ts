import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

/**
 * Checks the existence of a file or folder in the file system.
 *
 * @param {string} filePath - The path to the file or folder whose existence is to be checked.
 * @param {boolean} [isDebug] - If true, enables debug logging.
 * @returns {Promise<boolean>} - Returns true if the file/folder exists, otherwise false.
 */
export async function isFileOrFolderExists({
  filePath,
  isDebug = false,
}: {
  filePath: string;
  isDebug?: boolean;
}): Promise<boolean> {
  const stat = promisify(fs.stat);
  try {
    const stats = await stat(filePath);
    return stats.isFile() || stats.isDirectory();
  } catch (error) {
    if (isDebug) {
      console.info(`File or folder does not exist or cannot be accessed: ${filePath}. ${(error as Error).message}`);
    }
    return false;
  }
}
