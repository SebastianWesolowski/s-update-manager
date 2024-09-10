import fs from 'fs';
import { promisify } from 'util';
import { isFileOrFolderExists } from './isFileOrFolderExists';

/**
 * Creates a new file in the file system.
 *
 * @param {string} filePath - The path to the file to be created.
 * @param {string | Buffer} content - The content to be written to the file.
 * @param {Object} [options] - Additional options for file creation.
 * @param {boolean} [options.overwriteFile=true] - If true, overwrite the file if it already exists.
 * @param {boolean} [options.backupFile=true] - If true, creates a backup of the existing file before overwriting (if applicable).
 * @param {boolean} [isDebug=false] - If true, enables debug logging.
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
  isDebug?: boolean;
}

export async function toCreateFile({
  filePath,
  content,
  options = { overwriteFile: true, backupFile: true },
  isDebug = false,
}: ToCreateFileParams): Promise<void> {
  const { overwriteFile, backupFile } = options;
  const readFile = promisify(fs.readFile);
  const writeFile = promisify(fs.writeFile);

  try {
    const fileExists = await isFileOrFolderExists({ isDebug, filePath });

    if (backupFile && fileExists) {
      const existingContent = await readFile(filePath, 'utf-8');

      if (existingContent !== content.toString()) {
        const backupFilePath = filePath + '.backup';
        await writeFile(backupFilePath, existingContent);
      }
    }

    if (
      ((await isFileOrFolderExists({ isDebug, filePath })) && overwriteFile) ||
      !(await isFileOrFolderExists({ isDebug, filePath }))
    ) {
      // If overwriteFile is true or backupFile is false, overwrite the file or create a new one
      await writeFile(filePath, content);
    }
  } catch (error) {
    if (isDebug) {
      console.error(`Error creating file ${filePath}: ${(error as Error).message}`);
    }
    throw error; // You might want to handle the error differently based on your application's needs
  }
}
