import { AvailableSNPKeySuffixTypes, ConfigType } from '@/feature/config/types';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJsonFile } from '@/util/updateJsonFile';

export interface snpFile {
  SNPSuffixFileName: string;
  SNPKeySuffix: string;
  isCreated: boolean;
  path: string;
  realFileName: string;
  realPath: string;
  templateVersion: string;
}

export type snpArrayPathFileSet<T extends string = AvailableSNPKeySuffixTypes & '_'> = {
  [K in T]?: snpFile;
} & { defaultFile: snpFile };

export interface FileMapConfig {
  updatedContent: any;
  templateVersion: string;
  createdFileMap: string[];
  fileMap: string[];
  // templateFileList: string[];
  snpFileMap?: Record<string, snpArrayPathFileSet> | Record<string, NonNullable<unknown>>;
}

export const updateDetailsFileMapConfig2 = async ({
  realFileName,
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
  realFileName?: string;
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
    updatedContent: {},
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
    realFileName: realFileName || '',
    realPath: realPath || '',
    templateVersion: templateVersion || '1.0.0',
  };

  if (
    operation === 'addConfigSuffixFile' &&
    details.SNPKeySuffix &&
    details.path &&
    details.realFileName &&
    details.realPath &&
    details.templateVersion
  ) {
    details.options.replaceFile = true;

    if (!newFileMapConfig.snpFileMap[details.realFileName]) {
      newFileMapConfig.snpFileMap[details.realFileName] = {};
    }
    if (!newFileMapConfig.snpFileMap[details.realFileName][details.SNPKeySuffix]) {
      newFileMapConfig.snpFileMap[details.realFileName][details.SNPKeySuffix] = {};
    }

    newFileMapConfig.snpFileMap[details.realFileName][details.SNPKeySuffix] = {
      SNPKeySuffix: details.SNPKeySuffix,
      isCreated: details.isCreated,
      path: details.path,
      realFileName: details.realFileName,
      realPath: details.realPath,
      templateVersion: details.templateVersion,
    };

    if (details.SNPSuffixFileName) {
      newFileMapConfig.snpFileMap[details.realFileName][details.SNPKeySuffix].SNPSuffixFileName =
        details.SNPSuffixFileName;
    }
  }

  if (operation === 'createRealFileName' && details.realFileName) {
    details.options.replaceFile = true;
    if (!newFileMapConfig.snpFileMap[details.realFileName]) {
      newFileMapConfig.snpFileMap = {
        ...newFileMapConfig.snpFileMap,
        [details.realFileName]: {},
      };
    }
  }

  if (operation === 'removeFileMap') {
    details.options.replaceFile = true;
    newFileMapConfig.fileMap = [];
  }

  if (operation === 'deleteFile' && details.realFileName && details.SNPKeySuffix) {
    details.options.replaceFile = true;
    if (
      newFileMapConfig.snpFileMap[details.realFileName][details.SNPKeySuffix].isCreated === false ||
      !newFileMapConfig.snpFileMap[details.realFileName][details.SNPKeySuffix]
    ) {
      console.log('plik nie istnieje nie można go ponownie usunac');
    }

    const path = newFileMapConfig.snpFileMap[details.realFileName][details.SNPKeySuffix].path;

    if (path) {
      newFileMapConfig.createdFileMap = newFileMapConfig.createdFileMap.filter((file) => file !== path);
    }
    delete newFileMapConfig.snpFileMap[details.realFileName][details.SNPKeySuffix];

    if (Object.keys(newFileMapConfig.snpFileMap[details.realFileName]).length === 0) {
      delete newFileMapConfig.snpFileMap[details.realFileName];
    }
  }

  if (operation === 'createSNPRealFile' && details.realFileName) {
    details.options.replaceFile = true;
    if (newFileMapConfig.snpFileMap[details.realFileName]['_'].isCreated === true) {
      console.log('plik już byl dodany ! sprawdzic czy istnieje i podjać odpowiednia akcje');
    }
    const filePath = newFileMapConfig.snpFileMap[details.realFileName]['_'].path;

    if (!newFileMapConfig.createdFileMap.includes(filePath)) {
      newFileMapConfig.createdFileMap.push(filePath);
    }

    newFileMapConfig.snpFileMap[details.realFileName]['_'].isCreated = true;
  }

  if (operation === 'createSuffixFile' && details.realFileName && details.SNPKeySuffix) {
    details.options.replaceFile = true;
    if (newFileMapConfig.snpFileMap[details.realFileName][details.SNPKeySuffix].isCreated === true) {
      console.log('plik już byż dodany ! sprawdzic czy istnieje i podjać odpowiednia akcje');
    }

    const filePath = newFileMapConfig.snpFileMap[details.realFileName][details.SNPKeySuffix].path;

    if (!newFileMapConfig.createdFileMap.includes(filePath)) {
      newFileMapConfig.createdFileMap.push(filePath);
    }

    newFileMapConfig.snpFileMap[details.realFileName][details.SNPKeySuffix].isCreated = true;
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
