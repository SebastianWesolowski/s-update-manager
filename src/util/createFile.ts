import fs from 'fs';
import { basename, dirname, join } from 'path';
import { isFileExists } from './isFileExists';
import { isFolderExist } from './isFolderExist';
import { toCreateFile } from './toCreateFile';

interface CreateFileParams {
  filePath?: string;
  folderPath?: string;
  fileName?: string;
  content: string | Buffer;
  options?: {
    createFolder?: boolean;
    overwriteFile?: boolean;
    backupFile?: boolean;
  };
}

export async function createFile({
  filePath,
  fileName,
  folderPath,
  content,
  options = { createFolder: true, overwriteFile: true, backupFile: true },
}: CreateFileParams): Promise<string> {
  if (!filePath && (!folderPath || !fileName)) {
    throw new Error("Either 'filePath' or both 'folderPath' and 'fileName' are required.");
  }

  fileName = filePath ? basename(filePath) : (fileName as string);
  folderPath = filePath ? dirname(filePath) : (folderPath as string);

  if (!filePath) {
    filePath = join(folderPath as string, fileName as string);
  }

  try {
    await isFolderExist({
      folderPath,
      createFolder: options?.createFolder || true,
    });

    if (await isFileExists(filePath)) {
      console.warn('File already exists: ' + filePath);
    }

    await toCreateFile({ filePath, content, options });

    return filePath;
  } catch (error) {
    console.error(error);
    return '';
  }
}

async function handleCallback(err: NodeJS.ErrnoException | null): Promise<boolean> {
  if (err) {
    console.log(`error: ${err.message}`);
    return false;
  }

  return true;
}

async function writeNewFile(filePath: string, content: string | Buffer): Promise<string> {
  try {
    await fs.promises.writeFile(filePath, content);
    return filePath;
  } catch (error) {
    throw error;
  }
}

async function toCreateFolder(folderPath: string): Promise<boolean> {
  try {
    await fs.promises.mkdir(folderPath, { recursive: true });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
