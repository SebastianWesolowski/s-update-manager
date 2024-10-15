import prettier from 'prettier';
import fs from 'fs';
import { formatJsonWithPrettier } from './formatPrettier'; // assuming the file is named formatJsonWithPrettier.ts

jest.mock('fs');
jest.mock('prettier');

describe('formatJsonWithPrettier', () => {
  const mockReadFileSync = fs.readFileSync as jest.Mock;
  const mockWriteFileSync = fs.writeFileSync as jest.Mock;
  const mockPrettierFormat = prettier.format as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format JSON and write it back to the same file if outputPath is not provided', async () => {
    // Input data and expected output
    const inputPath = 'input.json';
    const outputPath = 'input.json';
    const formattedJson = '{\n  "key": "value"\n}';
    const fileContent = '{"key": "value"}';

    // Mocking file read and formatting
    mockReadFileSync.mockReturnValue(fileContent);
    mockPrettierFormat.mockResolvedValue(formattedJson);

    // Calling the tested function
    await formatJsonWithPrettier(inputPath, outputPath, false);

    // Checking if fs.readFileSync was called with the correct path
    expect(mockReadFileSync).toHaveBeenCalledWith(inputPath, 'utf8');

    // Checking if prettier.format was called with the correct arguments
    expect(mockPrettierFormat).toHaveBeenCalledWith(fileContent, {
      parser: 'json',
      printWidth: 10,
      tabWidth: 2,
      useTabs: false,
    });

    // Checking if fs.writeFileSync was called with the correct path and data
    expect(mockWriteFileSync).toHaveBeenCalledWith(inputPath, formattedJson, 'utf8');
  });

  it('should format JSON and write it to the specified output file', async () => {
    // Input data and expected output
    const inputPath = 'input.json';
    const outputPath = 'output.json';
    const formattedJson = '{\n  "key": "value"\n}';
    const fileContent = '{"key": "value"}';

    // Mocking file read and formatting
    mockReadFileSync.mockReturnValue(fileContent);
    mockPrettierFormat.mockResolvedValue(formattedJson);

    // Calling the tested function
    await formatJsonWithPrettier(inputPath, outputPath, false);

    // Checking if fs.readFileSync was called with the correct path
    expect(mockReadFileSync).toHaveBeenCalledWith(inputPath, 'utf8');

    // Checking if prettier.format was called with the correct arguments
    expect(mockPrettierFormat).toHaveBeenCalledWith(fileContent, {
      parser: 'json',
      printWidth: 10,
      tabWidth: 2,
      useTabs: false,
    });

    expect(mockWriteFileSync).toHaveBeenCalledWith(outputPath, formattedJson, 'utf8');
  });

  it('should log an error if an exception occurs during formatting', async () => {
    // Input data
    const inputPath = 'input.json';
    const outputPath = 'output.json';
    const errorMessage = 'Test error';

    // Mocking file read to throw an exception
    mockReadFileSync.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    // Mocking console.error function
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Calling the tested function, ignoring the error
    try {
      await formatJsonWithPrettier(inputPath, outputPath, true);
    } catch {}

    // Checking if console.error was called with the correct message
    expect(consoleErrorSpy).toHaveBeenCalledWith('An error occurred while formatting JSON:', new Error(errorMessage));

    // Restoring the original behavior of console.error
    consoleErrorSpy.mockRestore();
  });
});
