import { AvailableSUMKeySuffixTypes, ConfigType } from '@/feature/config/types';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJsonFile } from '@/util/updateJsonFile';

export interface sumFile {
  SUMSuffixFileName: string;
  SUMKeySuffix: string;
  isCreated: boolean;
  path: string;
  realFilePath: string;
  realPath: string;
  templateVersion: string;
}

export type sumArrayPathFileSet<T extends string = AvailableSUMKeySuffixTypes & '_'> = {
  [K in T]?: sumFile;
} & { defaultFile: sumFile };

export type sumFileMapObjectType = Record<string, sumArrayPathFileSet> | Record<string, NonNullable<unknown>>;
export interface FileMapConfig {
  createdFileMap: string[];
  manualCreatedFileMap?: string[];
  rootPathFileList?: string[];
  templateVersion: string;
  fileMap: string[];
  templateFileList?: string[];
  redOnlyFileList?: string[];
  sumFileMap?: sumFileMapObjectType;
}

export const updateDetailsFileMapConfig2 = async ({
  realFilePath,
  operation,
  config,
  sumFileMapConfig,
  SUMKeySuffix,
  SUMSuffixFileName,
  isCreated,
  path,
  realPath,
  templateVersion,
}: {
  SUMKeySuffix?: AvailableSUMKeySuffixTypes | '_';
  realFilePath?: string;
  operation:
    | 'addConfigSuffixFile'
    | 'createSuffixFile'
    | 'createSUMRealFile'
    | 'deleteFile'
    | 'removeFileMap'
    | 'createRealFileName';
  config: ConfigType;
  sumFileMapConfig?: FileMapConfig;
  SUMSuffixFileName?: string;
  isCreated?: boolean;
  path?: string;
  realPath?: string;
  templateVersion?: string;
}): Promise<FileMapConfig> => {
  const defaultConfig: FileMapConfig = {
    templateVersion: 'undefined',
    createdFileMap: [],
    fileMap: [],
  };
  // 'addConfigSuffixFile' - adding a new file to the config
  // 'createSuffixFile' - creating a file

  let newFileMapConfig = sumFileMapConfig;
  if (!newFileMapConfig) {
    newFileMapConfig = await readFile(config.sumFileMapConfig).then(async (bufferData) => {
      return parseJSON(bufferData.toString());
    });
  }

  if (newFileMapConfig === undefined || newFileMapConfig.sumFileMap === undefined) {
    return defaultConfig;
  }

  const details = {
    SUMKeySuffix: SUMKeySuffix || '',
    SUMSuffixFileName: SUMSuffixFileName || '',
    isCreated: isCreated || false,
    options: {
      replaceFile: false,
    },
    path: path || '',
    realFilePath: realFilePath || '',
    realPath: realPath || '',
    templateVersion: templateVersion || '1.0.0',
  };

  if (
    operation === 'addConfigSuffixFile' &&
    details.SUMKeySuffix &&
    details.path &&
    details.realFilePath &&
    details.realPath &&
    details.templateVersion
  ) {
    details.options.replaceFile = true;

    if (!newFileMapConfig.sumFileMap[details.realFilePath]) {
      newFileMapConfig.sumFileMap[details.realFilePath] = {};
    }
    if (!newFileMapConfig.sumFileMap[details.realFilePath][details.SUMKeySuffix]) {
      newFileMapConfig.sumFileMap[details.realFilePath][details.SUMKeySuffix] = {};
    }

    newFileMapConfig.sumFileMap[details.realFilePath][details.SUMKeySuffix] = {
      SUMKeySuffix: details.SUMKeySuffix,
      isCreated: details.isCreated,
      path: details.path,
      realFilePath: details.realFilePath,
      realPath: details.realPath,
      templateVersion: details.templateVersion,
    };

    if (details.SUMSuffixFileName) {
      newFileMapConfig.sumFileMap[details.realFilePath][details.SUMKeySuffix].SUMSuffixFileName =
        details.SUMSuffixFileName;
    }
    if (details.SUMKeySuffix !== 'defaultFile' && details.SUMKeySuffix !== '_') {
      if (newFileMapConfig.manualCreatedFileMap === undefined) {
        newFileMapConfig.manualCreatedFileMap = [];
      }
      if (!newFileMapConfig.manualCreatedFileMap.includes(details.path)) {
        newFileMapConfig.manualCreatedFileMap.push(details.path);
      }
    }
  }

  if (operation === 'createRealFileName' && details.realFilePath) {
    details.options.replaceFile = true;
    if (!newFileMapConfig.sumFileMap[details.realFilePath]) {
      newFileMapConfig.sumFileMap = {
        ...newFileMapConfig.sumFileMap,
        [details.realFilePath]: {},
      };
    }
  }

  if (operation === 'removeFileMap') {
    details.options.replaceFile = true;
    newFileMapConfig.fileMap = [];
  }

  if (operation === 'deleteFile' && details.realFilePath && details.SUMKeySuffix) {
    details.options.replaceFile = true;
    if (
      newFileMapConfig.sumFileMap[details.realFilePath][details.SUMKeySuffix].isCreated === false ||
      !newFileMapConfig.sumFileMap[details.realFilePath][details.SUMKeySuffix]
    ) {
      console.log('The file does not exist, it cannot be deleted again');
    }

    const path = newFileMapConfig.sumFileMap[details.realFilePath][details.SUMKeySuffix].path;

    if (path) {
      newFileMapConfig.createdFileMap = newFileMapConfig.createdFileMap.filter((file) => file !== path);
    }
    delete newFileMapConfig.sumFileMap[details.realFilePath][details.SUMKeySuffix];

    if (Object.keys(newFileMapConfig.sumFileMap[details.realFilePath]).length === 0) {
      delete newFileMapConfig.sumFileMap[details.realFilePath];
    }
  }

  if (operation === 'createSUMRealFile' && details.realFilePath) {
    details.options.replaceFile = true;
    if (newFileMapConfig.sumFileMap[details.realFilePath]['_'].isCreated === true) {
      console.log('The file has already been added! Check if it exists and take appropriate action');
    }
    const filePath = newFileMapConfig.sumFileMap[details.realFilePath]['_'].path;

    if (!newFileMapConfig.createdFileMap.includes(filePath)) {
      newFileMapConfig.createdFileMap.push(filePath);
    }

    newFileMapConfig.sumFileMap[details.realFilePath]['_'].isCreated = true;
  }

  if (operation === 'createSuffixFile' && details.realFilePath && details.SUMKeySuffix) {
    details.options.replaceFile = true;
    if (newFileMapConfig.sumFileMap[details.realFilePath][details.SUMKeySuffix].isCreated === true) {
      console.log('The file has already been added! Check if it exists and take appropriate action');
    }

    const filePath = newFileMapConfig.sumFileMap[details.realFilePath][details.SUMKeySuffix].path;

    if (!newFileMapConfig.createdFileMap.includes(filePath)) {
      newFileMapConfig.createdFileMap.push(filePath);
    }

    newFileMapConfig.sumFileMap[details.realFilePath][details.SUMKeySuffix].isCreated = true;
  }

  return (
    ((await updateJsonFile({
      filePath: config.sumFileMapConfig,
      config,
      newContent: newFileMapConfig,
      replaceFile: details.options.replaceFile,
    })) as FileMapConfig) || defaultConfig
  );
};
