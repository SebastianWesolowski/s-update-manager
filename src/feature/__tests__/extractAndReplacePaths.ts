/**
 * Extracts the `path` values from the `defaultFile` objects in the provided file map and replaces the suffix if specified.
 *
 * @param fileMap - An object containing file configurations.
 * @param suffixToReplace - The suffix string to be replaced. Defaults to `-default.md`.
 * @param newSuffix - The new suffix string to replace the old one. Defaults to an empty string.
 * @returns An array of paths with the specified suffix replaced.
 */
export const extractAndReplacePaths = (
  fileMap: Record<string, any>,
  suffixToReplace = '-default.md',
  newSuffix = ''
): string[] => {
  return Object.values(fileMap).map((file) => {
    const path = file.defaultFile.path;
    return path.replace(suffixToReplace, newSuffix);
  });
};
