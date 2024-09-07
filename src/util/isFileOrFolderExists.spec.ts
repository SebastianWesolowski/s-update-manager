import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';

describe('isFileOrFolderExists', () => {
  it('should return true for an existing file', async () => {
    const filePath = 'test/testFiles/existingFile.txt';
    const fileExists = await isFileOrFolderExists(filePath);
    expect(fileExists).toBe(true);
  });

  it('should return false for a non-existing file', async () => {
    const filePath = 'test/testFiles/nonExistingFile.txt';
    const fileExists = await isFileOrFolderExists(filePath);
    expect(fileExists).toBe(false);
  });

  it('should handle errors gracefully', async () => {
    // Test for handling errors, e.g., invalid file path
    const filePath = 'test/testFiles/invalid/file/path';
    const fileExists = await isFileOrFolderExists(filePath);
    expect(fileExists).toBe(false); // The function should gracefully handle errors and return false
  });
});
