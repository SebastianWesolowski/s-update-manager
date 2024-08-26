import { AvailableSNPKeySuffixTypes, ConfigType } from '@/feature/config/types';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJsonFile } from '@/util/updateJsonFile';

export interface snpFile {
  SNPSuffixFileName: string;
  SNPKeySuffix: string;
  isCreated: boolean;
  path: string;
  realFilePath: string;
  realPath: string;
  templateVersion: string;
}

export type snpArrayPathFileSet<T extends string = AvailableSNPKeySuffixTypes & '_'> = {
  [K in T]?: snpFile;
} & { defaultFile: snpFile };

export type snpFileMapObjectType = Record<string, snpArrayPathFileSet> | Record<string, NonNullable<unknown>>;
export interface FileMapConfig {
  createdFileMap: string[];
  manualCreatedFileMap?: string[];
  rootPathFileList?: string[];
  templateVersion: string;
  fileMap: string[];
  templateFileList?: string[];
  snpFileMap?: snpFileMapObjectType;
}

export const updateDetailsFileMapConfig2 = async ({
  realFilePath,
  operation,
  config,
  snpFileMapConfig,
  SNPKeySuffix,
  SNPSuffixFileName,
  isCreated,
  path,
  realPath,
  templateVersion,
}: {
  SNPKeySuffix?: AvailableSNPKeySuffixTypes | '_';
  realFilePath?: string;
  operation:
    | 'addConfigSuffixFile'
    | 'createSuffixFile'
    | 'createSNPRealFile'
    | 'deleteFile'
    | 'removeFileMap'
    | 'createRealFileName';
  config: ConfigType;
  snpFileMapConfig?: FileMapConfig;
  SNPSuffixFileName?: string;
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
  // 'addConfigSuffixFile' - dodanie nowego pliku do configu
  // 'createSuffixFile' - stworzeni pliku

  let newFileMapConfig = snpFileMapConfig;
  if (!newFileMapConfig) {
    newFileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) => {
      return parseJSON(bufferData.toString());
    });
  }

  if (newFileMapConfig === undefined || newFileMapConfig.snpFileMap === undefined) {
    //TODO: create FileMapConfig
    return defaultConfig;
  }

  const details = {
    SNPKeySuffix: SNPKeySuffix || '',
    SNPSuffixFileName: SNPSuffixFileName || '',
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
    details.SNPKeySuffix &&
    details.path &&
    details.realFilePath &&
    details.realPath &&
    details.templateVersion
  ) {
    details.options.replaceFile = true;

    if (!newFileMapConfig.snpFileMap[details.realFilePath]) {
      newFileMapConfig.snpFileMap[details.realFilePath] = {};
    }
    if (!newFileMapConfig.snpFileMap[details.realFilePath][details.SNPKeySuffix]) {
      newFileMapConfig.snpFileMap[details.realFilePath][details.SNPKeySuffix] = {};
    }

    newFileMapConfig.snpFileMap[details.realFilePath][details.SNPKeySuffix] = {
      SNPKeySuffix: details.SNPKeySuffix,
      isCreated: details.isCreated,
      path: details.path,
      realFilePath: details.realFilePath,
      realPath: details.realPath,
      templateVersion: details.templateVersion,
    };

    if (details.SNPSuffixFileName) {
      newFileMapConfig.snpFileMap[details.realFilePath][details.SNPKeySuffix].SNPSuffixFileName =
        details.SNPSuffixFileName;
    }
    if (details.SNPKeySuffix !== 'defaultFile' && details.SNPKeySuffix !== '_') {
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
    if (!newFileMapConfig.snpFileMap[details.realFilePath]) {
      newFileMapConfig.snpFileMap = {
        ...newFileMapConfig.snpFileMap,
        [details.realFilePath]: {},
      };
    }
  }

  if (operation === 'removeFileMap') {
    details.options.replaceFile = true;
    newFileMapConfig.fileMap = [];
  }

  if (operation === 'deleteFile' && details.realFilePath && details.SNPKeySuffix) {
    details.options.replaceFile = true;
    if (
      newFileMapConfig.snpFileMap[details.realFilePath][details.SNPKeySuffix].isCreated === false ||
      !newFileMapConfig.snpFileMap[details.realFilePath][details.SNPKeySuffix]
    ) {
      console.log('plik nie istnieje nie można go ponownie usunac');
    }

    const path = newFileMapConfig.snpFileMap[details.realFilePath][details.SNPKeySuffix].path;

    if (path) {
      newFileMapConfig.createdFileMap = newFileMapConfig.createdFileMap.filter((file) => file !== path);
    }
    delete newFileMapConfig.snpFileMap[details.realFilePath][details.SNPKeySuffix];

    if (Object.keys(newFileMapConfig.snpFileMap[details.realFilePath]).length === 0) {
      delete newFileMapConfig.snpFileMap[details.realFilePath];
    }
  }

  if (operation === 'createSNPRealFile' && details.realFilePath) {
    details.options.replaceFile = true;
    if (newFileMapConfig.snpFileMap[details.realFilePath]['_'].isCreated === true) {
      console.log('plik już byl dodany ! sprawdzic czy istnieje i podjać odpowiednia akcje');
    }
    const filePath = newFileMapConfig.snpFileMap[details.realFilePath]['_'].path;

    if (!newFileMapConfig.createdFileMap.includes(filePath)) {
      newFileMapConfig.createdFileMap.push(filePath);
    }

    newFileMapConfig.snpFileMap[details.realFilePath]['_'].isCreated = true;
  }

  if (operation === 'createSuffixFile' && details.realFilePath && details.SNPKeySuffix) {
    details.options.replaceFile = true;
    if (newFileMapConfig.snpFileMap[details.realFilePath][details.SNPKeySuffix].isCreated === true) {
      console.log('plik już byż dodany ! sprawdzic czy istnieje i podjać odpowiednia akcje');
    }

    const filePath = newFileMapConfig.snpFileMap[details.realFilePath][details.SNPKeySuffix].path;

    if (!newFileMapConfig.createdFileMap.includes(filePath)) {
      newFileMapConfig.createdFileMap.push(filePath);
    }

    newFileMapConfig.snpFileMap[details.realFilePath][details.SNPKeySuffix].isCreated = true;
  }

  return (
    ((await updateJsonFile({
      filePath: config.snpFileMapConfig,
      config,
      newContent: newFileMapConfig,
      replaceFile: details.options.replaceFile,
    })) as FileMapConfig) || defaultConfig
  );
};
