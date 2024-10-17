import { basename, dirname, join } from 'path';
import { isFileOrFolderExists } from './isFileOrFolderExists';
import { isFolderExist } from './isFolderExist';
import { toCreateFile } from './toCreateFile';

interface CreateFileParams {
  filePath?: string;
  folderPath?: string;
  fileName?: string;
  content: string | Buffer; // TODO [SC-84] is this really necessary, what about during folder creation?
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
  // TODO [SC-89] if content is object auto convert to buffer ?
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

    if ((await isFileOrFolderExists({ isDebug, filePath: filePath })) && isDebug) {
      console.warn('File already exists: ' + filePath);
    }

    await toCreateFile({ filePath, content, options });

    return filePath;
  } catch (error) {
    console.error(error);
    return '';
  }
}
