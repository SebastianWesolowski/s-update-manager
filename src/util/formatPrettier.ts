import prettier from 'prettier';
import fs from 'fs';

export async function formatJsonWithPrettier(inputPath: string, outputPath?: string): Promise<void> {
  try {
    // Odczytaj plik JSON
    const fileContent = fs.readFileSync(inputPath, 'utf8');

    // Sformatuj za pomocą Prettier
    const formattedJson = await prettier.format(fileContent, { parser: 'json' });

    // Jeśli outputPath nie jest podany, użyj inputPath
    const finalOutputPath = outputPath || inputPath;

    // Zapisz sformatowany JSON do pliku
    fs.writeFileSync(finalOutputPath, formattedJson, 'utf8');

    console.log('JSON został sformatowany i zapisany do', finalOutputPath);
  } catch (error) {
    console.error('Wystąpił błąd podczas formatowania JSON:', error);
  }
}
