import { createFile } from '@/util/createFile';

describe('createFile', () => {
  it('should create a file when given filePath and content', async () => {
    const filePath = 'test/testFiles/file.txt';
    const content = 'Hello, this is the content.';
    const result = await createFile({ filePath, content });
    expect(result).toBe(filePath);
    // Add additional assertions to check if the file actually exists, and its content matches the expected content
  });

  it('should create a file when given folderPath, fileName, and content', async () => {
    const folderPath = 'test/testFiles';
    const fileName = 'file.txt';
    const content = 'Hello, this is the content.';
    const result = await createFile({ folderPath, fileName, content });
    expect(result).toBe(`${folderPath}/${fileName}`);
    // Add additional assertions to check if the file actually exists, and its content matches the expected content
  });

  it('should throw an error when neither filePath nor (folderPath and fileName) is provided', async () => {
    const content = 'Hello, this is the content.';
    await expect(createFile({ content })).rejects.toThrow(
      "Either 'filePath' or both 'folderPath' and 'fileName' are required."
    );
  });

  it('should log a warning and return the file path if the file already exists', async () => {
    const existingFilePath = 'test/testFiles/existingFile.txt';
    const existingContent = 'Existing file content';

    // Create an existing file
    await createFile({ filePath: existingFilePath, content: existingContent });

    // Attempt to create the file again
    const result = await createFile({ filePath: existingFilePath, content: 'New content' });

    expect(result).toBe(existingFilePath);
    // Add additional assertions to check if the warning is logged
  });

  // Cleanup after tests if necessary
  afterAll(() => {
    // Perform cleanup, like deleting the created test files or folders
  });
});
