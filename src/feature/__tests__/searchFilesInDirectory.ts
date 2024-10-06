import * as fs from 'fs/promises';
import * as path from 'path';

export async function searchFilesInDirectory({
  directoryPath,
  phrases,
  excludedFileNames = [],
  excludedPhrases = [],
  excludePaths = [],
  excludeFolders = [],
}: {
  directoryPath: string;
  phrases?: string[];
  excludedFileNames?: string[];
  excludedPhrases?: string[];
  excludePaths?: string[];
  excludeFolders?: string[];
}): Promise<string[]> {
  //TODO [SC-80] advanced gitignore Rule

  const matchingFiles: string[] = [];

  // Normalize the input path
  const normalizedDirectoryPath = directoryPath.startsWith('/') ? directoryPath : path.join('.', directoryPath);

  // Get all files and folders in the directory
  const items = await fs.readdir(normalizedDirectoryPath);

  // Remove './' from the beginning of paths in excludePaths
  const cleanedExcludePaths = excludePaths.map((path) => (path.startsWith('./') ? path.slice(2) : path));

  for (const item of items) {
    const itemPath = path.join(normalizedDirectoryPath, item);

    if (excludeFolders.includes(item)) {
      continue; // Skip this folder and all its subfolders/files
    }

    // Check if the path is excluded
    if (cleanedExcludePaths.some((excludePath) => itemPath.includes(excludePath))) {
      continue; // Skip this path and all its subfolders/files
    }

    // Check if it's a file
    const stats = await fs.stat(itemPath);
    if (stats.isFile()) {
      // Check if the file name is in the exclusion list
      if (excludedFileNames.includes(item)) {
        continue; // Skip this file
      }

      // Check if the path contains any of the excluding phrases
      if (excludedPhrases.some((phrase) => itemPath.includes(phrase))) {
        continue; // Skip this file
      }

      // Check if the file name or path contains any of the phrases
      if (phrases) {
        for (const phrase of phrases) {
          if (itemPath.includes(phrase)) {
            matchingFiles.push(normalizePath(itemPath));
            break; // Break if one of the phrases is found
          }
        }
      } else {
        matchingFiles.push(normalizePath(itemPath));
      }
    } else if (stats.isDirectory()) {
      // If it's a folder, recursively search its contents, but only if it's not excluded
      if (!cleanedExcludePaths.some((excludePath) => itemPath.includes(excludePath))) {
        const nestedMatchingFiles = await searchFilesInDirectory({
          directoryPath: itemPath,
          phrases,
          excludedFileNames,
          excludedPhrases,
          excludePaths: cleanedExcludePaths,
        });
        matchingFiles.push(...nestedMatchingFiles);
      }
    }
  }

  return matchingFiles;
}

function normalizePath(filePath: string): string {
  // Remove './' from the beginning of the path if it exists
  let normalizedPath = filePath.startsWith('./') ? filePath.slice(2) : filePath;

  // Replace all double slashes with single ones
  normalizedPath = normalizedPath.replace(/\/\//g, '/');

  // Add './' at the beginning if the path doesn't start with '/'
  return normalizedPath.startsWith('/') ? normalizedPath : './' + normalizedPath;
}
