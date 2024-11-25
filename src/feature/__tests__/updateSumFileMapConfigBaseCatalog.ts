import { FileMapConfig } from '../updateFileMapConfig';

interface PathUpdateOptions {
  oldBasePath: string;
  newBasePath: string;
}

export const updateFileMapConfigPaths = (
  sumFileMapConfig: FileMapConfig,
  options: PathUpdateOptions
): FileMapConfig => {
  const { oldBasePath, newBasePath } = options;

  const updatePath = (path: string): string => {
    if (path.startsWith('./')) {
      return path.replace(oldBasePath, newBasePath);
    }
    return path;
  };

  const newConfig = { ...sumFileMapConfig };

  // Update createdFileMap
  if (newConfig.createdFileMap) {
    newConfig.createdFileMap = newConfig.createdFileMap.map(updatePath);
  }

  // Update sumFileMap paths
  if (newConfig.sumFileMap) {
    newConfig.sumFileMap = Object.entries(newConfig.sumFileMap).reduce((acc, [key, value]) => {
      const updatedValue = Object.entries(value).reduce((innerAcc, [innerKey, innerValue]) => {
        if (typeof innerValue === 'object' && innerValue !== null) {
          return {
            ...innerAcc,
            [innerKey]: {
              ...innerValue,
              path: (innerValue as { path?: string }).path
                ? updatePath((innerValue as { path: string }).path)
                : (innerValue as { path?: string }).path,
              realPath: (innerValue as { realPath?: string }).realPath
                ? updatePath((innerValue as { realPath: string }).realPath)
                : (innerValue as { realPath?: string }).realPath,
            },
          };
        }
        return { ...innerAcc, [innerKey]: innerValue };
      }, {});

      return { ...acc, [key]: updatedValue };
    }, {});
  }

  return newConfig;
};
