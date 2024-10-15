import { readdir, rmdir, stat, unlink } from 'fs/promises';
import { join } from 'path';

/**
 * Removes all files and subdirectories from a given directory.
 *
 * @param directory - Path to the directory from which all files and subdirectories should be removed.
 * @returns Promise<void> - Returns a promise that is fulfilled after all files and subdirectories are removed.
 *
 * @throws Error - If the directory cannot be read or a file/directory cannot be deleted.
 */
export async function clearDirectory(directory: string): Promise<void> {
  try {
    const files = await readdir(directory);

    const deletionPromises = files.map(async (file) => {
      const filePath = join(directory, file);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory()) {
        // If it's a directory, call the function recursively
        await clearDirectory(filePath);
        // After clearing the directory, remove it
        await rmdir(filePath);
      } else {
        // If it's a file, delete it
        await unlink(filePath);
      }
    });

    await Promise.all(deletionPromises);
    console.log(`All files and subdirectories in the directory "${directory}" have been deleted.`);
  } catch (error: any) {
    throw new Error(`Failed to delete files from the directory: ${error?.message || error}`);
  }
}
