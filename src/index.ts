import fs from 'fs';
import * as path from 'path';
import { createFile } from '@/util/createFile';
import { isFolderExist } from '@/util/isFolderExist';
import { wgetAsync } from '@/util/wget';

const rootCatalog = path.join('./snp/test');

const configTemplate = ['README.md', '.github/PULL_REQUEST_TEMPLATE.md'];

type PackageConfig = {
  instructions: string;
  default: string;
  extends: string;
  custom: string;
};

type Config = Record<
  string,
  {
    name: string;
    filePackage: PackageConfig;
    sequence: string[];
  }
>;

const config: Config = {
  'README.md': {
    name: 'README.md',
    filePackage: {
      instructions: 'README.md-instructions.md',
      default: 'README.md-default.md',
      extends: 'README.md-extends.md',
      custom: 'README.md-custom.md',
    },
    sequence: ['default', 'extends', 'custom'],
  },
};

export const init = async ({ files, rootCatalog }: { files: string[] | string; rootCatalog?: string }) => {
  const rootDir = rootCatalog ? rootCatalog : path.dirname('./');
  const snpRootFolder = path.join(rootDir, 'snp');

  await isFolderExist({
    folderPath: snpRootFolder,
    createFolder: true,
  });

  await createFile({
    filePath: `${snpRootFolder}/snp.config.json`,
    content: JSON.stringify({ version: '2.0.0', template: 'node' }),
  });
};
export const upgrade = async ({ files, rootCatalog }: { files: string[] | string; rootCatalog?: string }) => {
  const fileList = Array.isArray(files) ? files : [files];
  const rootDir = rootCatalog ? rootCatalog : path.dirname('./');

  for (const file of fileList) {
    const { filePackage, sequence, name } = config[file];

    for (const key of Object.keys(filePackage)) {
      const currentPath = path.join(rootDir, filePackage[key]);

      // const content = await getContent();

      const url = `https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/${filePackage[key]}`;
      const content = await wgetAsync(url);
      const createdFile = await createFile({ filePath: currentPath, content });

      console.log({
        key,
        filePackageKey: filePackage[key],
        createdFile,
      });
    }

    // Create an array to store file contents
    const fileContents: string[] = [];

    // Read contents of each file and push into the array
    for (const sequenceFile of sequence) {
      const filePath = path.join(rootDir, filePackage[sequenceFile]);
      const content = await fs.promises.readFile(filePath, 'utf-8');
      fileContents.push(content);
    }

    const concatenatedContent = fileContents.join('\n');
    const newFilePath = path.join(rootDir, name);
    await fs.promises.writeFile(newFilePath, concatenatedContent, 'utf-8');

    ////get config
    //// join cintent
    //// write content
  }
};

init({ files: configTemplate[0], rootCatalog }).then((r) => console.log('init'));
// upgrade({ files: configTemplate[0], rootCatalog: rootCatalog + '/snp/test' });

// try {
//    createFile({filePath: './snp/test/readme.md', content: 'lorem ipsum dolor'}).then(r =>);
//   // Handle the result here
// } catch (error) {
//   console.log(error);
//   // Handle errors here
// }
//
// try {
//   const fileContent = fs.readFileSync(inputFile, 'utf-8');
//
//   // Znajdź indeksy początku i końca sekcji do zbudowania głównego pliku
//   const startIndex = fileContent.indexOf('<!-- Zaczynamy Sekcję do Zbudowania Głównego Pliku -->');
//   const endIndex = fileContent.indexOf('<!-- Koniec Sekcji do Zbudowania Głównego Pliku -->');
//
//   if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
//     // Wyodrębnij instrukcję
//     const instructionPart = fileContent.substring(0, startIndex);
//
//     // Wyodrębnij główną zawartość
//     const contentPart = fileContent.substring(startIndex, endIndex);
//
//     // Zapisz do osobnych plików
//     fs.writeFileSync(outputInstructionFile, instructionPart.trim());
//     fs.writeFileSync(outputContentFile, contentPart.trim());
//
//     console.log('Pliki zostały utworzone.');
//   } else {
//     console.log('Brak odpowiednich oznaczeń w pliku z częścią.');
//   }
// } catch (error) {
//   console.error(`Błąd odczytu pliku: ${error.message}`);
// }
