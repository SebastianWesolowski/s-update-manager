import fs from 'fs';
import { basename, dirname, join } from 'path';
import { isFileExists } from './isFileExists';
import { isFolderExist } from './isFolderExist';
import { toCreateFile } from './toCreateFile';

interface CreateFileParams {
  filePath?: string;
  folderPath?: string;
  fileName?: string;
  content: string | Buffer; // czy to napewno potrzebne, com podczas tworzenia folderu ?
  options?: {
    createFolder?: boolean;
    overwriteFile?: boolean;
    backupFile?: boolean;
  };
  isDebug?: boolean;
}

export async function createFile({
  filePath,
  fileName,
  folderPath,
  content,
  options = { createFolder: true, overwriteFile: true, backupFile: true },
  isDebug = false,
}: CreateFileParams): Promise<string> {
  // TODO if content is object auto convert to buffer ?
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

    if ((await isFileExists(filePath)) && isDebug) {
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
