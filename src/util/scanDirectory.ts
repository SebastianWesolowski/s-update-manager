import { promises as fs } from 'fs';
import { createPath } from '@/util/createPath';

/**
 * Recursively scans a directory and returns an array of file paths.
 *
 * @param {string} dirPath - The path of the directory to scan.
 * @param {string[]} [excludedPaths=[]] - An optional array of file or directory paths to exclude from the scan.
 * @returns {Promise<string[]>} - A promise that resolves to an array of file paths.
 */
export async function scanDirectory(dirPath: string, excludedPaths: string[] = []): Promise<string[]> {
  const filePaths: string[] = [];

  async function scan(currentPath: string): Promise<void> {
    const items = await fs.readdir(currentPath, { withFileTypes: true });

    for (const item of items) {
      const itemPath = createPath([currentPath, item.name]);

      // Check if the current path is in the excluded paths
      if (excludedPaths.some((excludedPath) => itemPath.startsWith(excludedPath))) {
        continue;
      }

      if (item.isDirectory()) {
        await scan(itemPath);
      } else if (item.isFile()) {
        filePaths.push(itemPath);
      }
    }
  }

  try {
    await scan(dirPath);
    return filePaths;
  } catch (error) {
    console.error('Error scanning directory:', error);
    throw error;
  }
}
