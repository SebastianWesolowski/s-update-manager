import prettier from 'prettier';
import fs from 'fs';
import { formatJsonWithPrettier } from './formatPrettier'; // zakładając, że plik nazywa się formatJsonWithPrettier.ts

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
    // Dane wejściowe i oczekiwane wyjście
    const inputPath = 'input.json';
    const outputPath = 'input.json';
    const formattedJson = '{\n  "key": "value"\n}';
    const fileContent = '{"key": "value"}';

    // Mockowanie odczytu pliku i formaterowania
    mockReadFileSync.mockReturnValue(fileContent);
    mockPrettierFormat.mockResolvedValue(formattedJson);

    // Wywołanie testowanej funkcji
    await formatJsonWithPrettier(inputPath, outputPath, false);

    // Sprawdzenie, czy fs.readFileSync zostało wywołane z odpowiednią ścieżką
    expect(mockReadFileSync).toHaveBeenCalledWith(inputPath, 'utf8');

    // Sprawdzenie, czy prettier.format zostało wywołane z odpowiednimi argumentami
    expect(mockPrettierFormat).toHaveBeenCalledWith(fileContent, {
      parser: 'json',
      printWidth: 10,
      tabWidth: 2,
      useTabs: false,
    });

    // Sprawdzenie, czy fs.writeFileSync zostało wywołane z odpowiednią ścieżką i danymi
    expect(mockWriteFileSync).toHaveBeenCalledWith(inputPath, formattedJson, 'utf8');
  });

  it('should format JSON and write it to the specified output file', async () => {
    // Dane wejściowe i oczekiwane wyjście
    const inputPath = 'input.json';
    const outputPath = 'output.json';
    const formattedJson = '{\n  "key": "value"\n}';
    const fileContent = '{"key": "value"}';

    // Mockowanie odczytu pliku i formaterowania
    mockReadFileSync.mockReturnValue(fileContent);
    mockPrettierFormat.mockResolvedValue(formattedJson);

    // Wywołanie testowanej funkcji
    await formatJsonWithPrettier(inputPath, outputPath, false);

    // Sprawdzenie, czy fs.readFileSync zostało wywołane z odpowiednią ścieżką
    expect(mockReadFileSync).toHaveBeenCalledWith(inputPath, 'utf8');

    // Sprawdzenie, czy prettier.format zostało wywołane z odpowiednimi argumentami
    expect(mockPrettierFormat).toHaveBeenCalledWith(fileContent, {
      parser: 'json',
      printWidth: 10,
      tabWidth: 2,
      useTabs: false,
    });

    expect(mockWriteFileSync).toHaveBeenCalledWith(outputPath, formattedJson, 'utf8');
  });

  it('should log an error if an exception occurs during formatting', async () => {
    // Dane wejściowe
    const inputPath = 'input.json';
    const outputPath = 'output.json';
    const errorMessage = 'Test error';

    // Mockowanie odczytu pliku, aby rzucić wyjątek
    mockReadFileSync.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    // Mockowanie funkcji console.error
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Wywołanie testowanej funkcji, ignorując błąd
    try {
      await formatJsonWithPrettier(inputPath, outputPath, true);
    } catch {}

    // Sprawdzenie, czy console.error zostało wywołane z odpowiednim komunikatem
    expect(consoleErrorSpy).toHaveBeenCalledWith('Wystąpił błąd podczas formatowania JSON:', new Error(errorMessage));

    // Przywrócenie pierwotnego zachowania console.error
    consoleErrorSpy.mockRestore();
  });
});
