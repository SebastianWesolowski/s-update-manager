import path from 'path';

export const createPath = function (parts: string[] | string, isFolder = false) {
  let joinedPath: string | string[];
  let includeRoot = false;
  const rootRegex = /^\.\/.*$/;
  if (typeof parts === 'string') {
    joinedPath = parts;

    if (rootRegex.test(parts)) {
      includeRoot = true;
    }
  } else {
    if (rootRegex.test(parts.join(''))) {
      includeRoot = true;
    }

    joinedPath = path.join(...parts);
  }

  if (isFolder) {
    joinedPath = path.normalize(joinedPath + path.sep);
  }

  if (includeRoot && joinedPath !== './') {
    joinedPath = './' + path.normalize(joinedPath);
  }

  return joinedPath;
};
