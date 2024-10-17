import { createFile } from './createFile';
import { createPath } from './createPath';
import { deletePath } from './deletePath';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';

describe('isFileOrFolderExists', () => {
  afterEach(async () => {
    await deletePath(createPath(['test', 'testFiles']), true);
  });

  it('should return true for an existing file', async () => {
    const filePath = 'test/testFiles/existingFile.txt';
    await createFile({ filePath, content: 'test', options: { createFolder: true } });
    const fileExists = await isFileOrFolderExists({ isDebug: true, filePath });
    expect(fileExists).toBe(true);
  });

  it('should return false for a non-existing file', async () => {
    const filePath = 'test/testFiles/nonExistingFile.txt';
    await deletePath(createPath(filePath), true);
    const fileExists = await isFileOrFolderExists({ isDebug: true, filePath: filePath });
    expect(fileExists).toBe(false);
  });

  it('should handle errors gracefully', async () => {
    // Test for handling errors, e.g., invalid file path
    const filePath = 'test/testFiles/invalid/file/path';
    const fileExists = await isFileOrFolderExists({ isDebug: true, filePath: filePath });
    expect(fileExists).toBe(false); // The function should gracefully handle errors and return false
  });
});
