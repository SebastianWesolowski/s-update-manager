import { searchFilesInDirectory } from './searchFilesInDirectory';
import { ConfigTemplateType } from '../config/types';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

interface TestDataResult<T> {
  result: T;
  allFiles: string[];
  repositoryMapFileConfigContent: ConfigTemplateType | null;
}

export async function getTestData<T extends (config: ConfigTemplateType) => Promise<any>>(
  templateConfig: ConfigTemplateType,
  testFunction: T
): Promise<TestDataResult<ReturnType<T>>> {
  const result = await testFunction(templateConfig);
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

  return { ...result, allFiles, repositoryMapFileConfigContent };
}
