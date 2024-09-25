import { searchFilesInDirectory } from './searchFilesInDirectory';
import { ConfigTemplateType } from '../config/types';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

interface TestDataResult<T> {
  allFiles: string[];
  repositoryMapFileConfigContent: ConfigTemplateType | null;
}

export async function getTestData<T extends object>(
  templateConfig: ConfigTemplateType,
  testFunction: ((config: ConfigTemplateType) => Promise<T>) | (() => Promise<T>)
): Promise<T & TestDataResult<T>> {
  const result =
    testFunction.length === 0
      ? await (testFunction as () => Promise<T>)()
      : await (testFunction as (config: ConfigTemplateType) => Promise<T>)(templateConfig);

  const allFiles = await searchFilesInDirectory({
    directoryPath: templateConfig.projectCatalog,
    excludedFileNames: ['.DS_Store'],
    excludedPhrases: ['.backup'],
  });

  let repositoryMapFileConfigContent: ConfigTemplateType | null = null;
  if (templateConfig.repositoryMapFilePath) {
    try {
      const bufferData = await readFile(templateConfig.repositoryMapFilePath);
      repositoryMapFileConfigContent = await parseJSON(bufferData.toString());
    } catch (error) {
      console.error('Error reading or parsing repository map file:', error);
    }
  }

  return {
    ...result,
    allFiles,
    repositoryMapFileConfigContent,
  };
}
