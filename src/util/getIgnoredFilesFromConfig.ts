import { createPath } from './createPath';
import { readFile } from './readFile';
import { ConfigType } from '@/feature/config/types';
import { FileMapConfig } from '@/feature/updateFileMapConfig';

interface GetIgnoredFilesFromConfigParams {
  config: ConfigType;
  sumFileMapConfig: FileMapConfig;
}

/**
 * Checks if a file path matches a gitignore-style pattern
 */
function matchesPattern(filePath: string, pattern: string): boolean {
  // Convert gitignore pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.') // Escape dots
    .replace(/\*/g, '.*') // Convert * to .*
    .replace(/\?/g, '.'); // Convert ? to .

  const regex = new RegExp(`^${regexPattern}$`);

  // For extension patterns like "*.json", also check against just the filename
  if (pattern.startsWith('*.')) {
    const fileName = filePath.split('/').pop() || '';
    return regex.test(fileName);
  }

  return regex.test(filePath);
}

/**
 * Reads .sumignore file and returns list of ignored files based on patterns
 * @param params Configuration parameters including project config and file map
 * @returns Array of ignored file paths
 */
export async function getIgnoredFilesFromConfig({
  config,
  sumFileMapConfig,
}: GetIgnoredFilesFromConfigParams): Promise<string[]> {
  if (!sumFileMapConfig.sumFileMap) {
    return [];
  }

  const sumIgnoreConfig = await readFile(createPath([config.sumIgnoreFilePath])).then(async (bufferData) => {
    const content = bufferData.toString();
    if (content === '') return null;
    return content.split('\n');
  });

  if (!sumIgnoreConfig) {
    return [];
  }

  const ignoredFiles: string[] = [];

  for (const ignorePattern of sumIgnoreConfig) {
    const trimmedPattern = ignorePattern.trim();
    if (!trimmedPattern || trimmedPattern.startsWith('#')) continue;

    if (trimmedPattern.endsWith('/')) {
      // Handle directory patterns
      const basePattern = trimmedPattern.replace(/\/$/, '');
      Object.keys(sumFileMapConfig.sumFileMap).forEach((filePath) => {
        if (filePath.startsWith(basePattern + '/')) {
          ignoredFiles.push(filePath);
        }
      });
    } else {
      // Handle file patterns (including wildcards)
      Object.keys(sumFileMapConfig.sumFileMap).forEach((filePath) => {
        if (matchesPattern(filePath, trimmedPattern)) {
          ignoredFiles.push(filePath);
        }
      });
    }
  }

  return [...new Set(ignoredFiles)]; // Remove duplicates
}
