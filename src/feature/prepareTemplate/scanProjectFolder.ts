import path from 'path';
import { searchFilesInDirectory } from '../__tests__/searchFilesInDirectory';
import { ConfigTemplateType } from '@/feature/config/types';
import { createPath } from '@/util/createPath';
import { debugFunction } from '@/util/debugFunction';
import { gitignoreToGlobRules } from '@/util/gitignoreToGlobRules/gitignoreToGlobRules';

export const scanProjectFolder = async (
  templateConfig: ConfigTemplateType
): Promise<{ templateConfig: ConfigTemplateType; templateFileList: string[] | [] }> => {
  debugFunction(templateConfig.isDebug, { templateConfig }, '[PrepareTemplate - scanProjectFolder START]');

  const globRules: string[] = await gitignoreToGlobRules({
    prefix: createPath(templateConfig.projectCatalog) + '/',
    gitignorePath: createPath([templateConfig.projectCatalog, '.gitignore']),
  });

  const excludePaths = [
    ...globRules,
    createPath([templateConfig.projectCatalog, 'test/']),
    createPath([templateConfig.projectCatalog, templateConfig.templateCatalogName]),
  ];
  return searchFilesInDirectory({
    directoryPath: templateConfig.projectCatalog,
    excludePaths: excludePaths,
    excludedFileNames: [createPath(templateConfig.repositoryMapFileName), '.DS_Store'],
    excludedPhrases: ['.backup'],
  })
    .then((fileList) => {
      debugFunction(
        templateConfig.isDebug,
        { templateConfig, fileList },
        '[PrepareTemplate - searchFilesInDirectory - START]'
      );
      const filteredFiles = fileList.map((file) => {
        const relativePath = file.replace(templateConfig.projectCatalog, '');
        const normalizedPath = path.normalize(relativePath).replace(/^[/\\]+/, '');
        return './' + normalizedPath.replace(/\\/g, '/');
      });

      debugFunction(
        templateConfig.isDebug,
        { templateConfig, fileList, filteredFiles },
        '[PrepareTemplate - searchFilesInDirectory - END]'
      );
      debugFunction(templateConfig.isDebug, { templateConfig }, '[PrepareTemplate - scanProjectFolder END]');
      return { templateConfig, templateFileList: filteredFiles };
    })
    .catch((error) => {
      console.error('An error occurred:', error);
      return { templateConfig, templateFileList: [] };
    });
};
