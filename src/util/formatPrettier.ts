import prettier from 'prettier';
import fs from 'fs';

export async function formatJsonWithPrettier(inputPath: string, outputPath?: string, isDebug = false): Promise<void> {
  try {
    const fileContent = fs.readFileSync(inputPath, 'utf8');
    await prettier
      .format(fileContent, {
        parser: 'json',
        printWidth: 10,
        tabWidth: 2,
        useTabs: false,
      })
      .then((json) => {
        const finalOutputPath = outputPath || inputPath;
        fs.writeFileSync(finalOutputPath, json, 'utf8');
        if (isDebug) {
          console.log('JSON has been formatted and saved to', finalOutputPath);
        }
      });
  } catch (error) {
    if (isDebug) {
      console.error('An error occurred while formatting JSON:', error);
    }
  }
}
