import fs from 'fs';
import { isFileOrFolderExists } from './isFileOrFolderExists';

/**
 * Creates a new file in the file system.
 *
 * @param {string} filePath - The path to the file to be created.
 * @param {string | Buffer} content - The content to be written to the file.
 * @param {Object} [options] - Additional options for file creation.
 * @param {boolean} [options.overwriteFile=true] - If true, overwrite the file if it already exists.
 * @param {boolean} [options.backupFile=true] - If true, creates a backup of the existing file before overwriting (if applicable).
 * @returns {Promise<void>} - Returns a Promise that resolves when the file is successfully created.
 *                            Rejects with an error if the file creation fails.
 */

interface ToCreateFileParams {
  filePath: string;
  content: string | Buffer;
  options?: {
    overwriteFile?: boolean;
    backupFile?: boolean;
  };
}

export async function toCreateFile({
  filePath,
  content,
  options = { overwriteFile: true, backupFile: true },
}: ToCreateFileParams): Promise<void> {
  const { overwriteFile, backupFile } = options;

  try {
    const fileExists = await isFileOrFolderExists(filePath);

    if (backupFile && fileExists) {
      const existingContent = await fs.promises.readFile(filePath, 'utf-8');

      if (existingContent !== content.toString()) {
        const backupFilePath = filePath + '.backup';
        await fs.promises.copyFile(filePath, backupFilePath);
      }
    }

    if (((await isFileOrFolderExists(filePath)) && overwriteFile) || !(await isFileOrFolderExists(filePath))) {
      // If overwriteFile is true or backupFile is false, overwrite the file or create a new one
      await fs.promises.writeFile(filePath, content);
    }
  } catch (error) {
    throw error; // You might want to handle the error differently based on your application's needs
  }
}
