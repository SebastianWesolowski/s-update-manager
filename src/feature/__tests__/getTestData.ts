import { searchFilesInDirectory } from './searchFilesInDirectory';
import { ConfigTemplateType, ConfigType } from '../config/types';
import { FileMapConfig } from '../updateFileMapConfig';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

interface TestDataResult<T> {
  allFiles: string[];
  repositoryMapFileConfigContent: ConfigTemplateType | null;
}

interface ProjectTestDataResult<T> {
  allFiles: string[];
  sumConfigFileContent: ConfigType | null;
  sumFileMapConfigContent: FileMapConfig | null;
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

export async function getProjectTestData<T extends object>(
  config: ConfigType,
  testFunction: ((config: ConfigType) => Promise<T>) | (() => Promise<T>)
): Promise<T & ProjectTestDataResult<T>> {
  const result =
    testFunction.length === 0
      ? await (testFunction as () => Promise<T>)()
      : await (testFunction as (config: ConfigType) => Promise<T>)(config);

  const allFiles = await searchFilesInDirectory({
    directoryPath: config.projectCatalog,
    excludedFileNames: ['.DS_Store'],
    excludedPhrases: ['.backup'],
    excludeFolders: ['node_modules'],
  });

  let sumConfigFileContent: ConfigType | null = null;
  let sumFileMapConfigContent: FileMapConfig | null = null;

  if (await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.sumConfigFile })) {
    try {
      const bufferData = await readFile(config.sumConfigFile);
      sumConfigFileContent = await parseJSON(bufferData.toString());
    } catch (error) {
      console.error('Error reading or parsing repository map file:', error);
    }
  }

  if (await isFileOrFolderExists({ isDebug: config.isDebug, filePath: config.sumFileMapConfig })) {
    try {
      const bufferData = await readFile(config.sumFileMapConfig);
      sumFileMapConfigContent = await parseJSON(bufferData.toString());
    } catch (error) {
      console.error('Error reading or parsing repository map file:', error);
    }
  }

  return {
    ...result,
    allFiles,
    sumConfigFileContent,
    sumFileMapConfigContent,
  };
}
