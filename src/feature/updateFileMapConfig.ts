import path from 'path';
import { AvailableSNPKeySuffixTypes, ConfigType, createPath } from '@/feature/defaultConfig';
import { formatSnp } from '@/feature/formatSnp';
import { debugFunction } from '@/util/debugFunction';
import { getRealFileName } from '@/util/getRealFileName';
import { isFileExists } from '@/util/isFileExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
import { updateJson } from '@/util/updateJson';

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
  snpFileMap?: Record<string, snpArrayPathFileSet> | Record<string, NonNullable<unknown>>;
}

export const updateFileMapConfig = async (
  config: ConfigType,
  newContent: object,
  replaceFile = false
): Promise<FileMapConfig | null> => {
  if (await isFileExists(config.snpFileMapConfig)) {
    return await updateJson({ filePath: config.snpFileMapConfig, newContent, replace: replaceFile }).then(() => {
      if (replaceFile) {
        return newContent as FileMapConfig;
      }
      return readFile(config.snpFileMapConfig).then(async (bufferData) => {
        return parseJSON(bufferData.toString());
      });
    });
  } else {
    debugFunction(
      config?.isDebug,
      `file snpFileMapConfig is not exist ${config.snpFileMapConfig}`,
      '[updateFileMapConfig]'
    );
    return null;
  }
};

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

  return (await updateFileMapConfig(config, newFileMapConfig, details.options.replaceFile)) || defaultConfig;
};

export const updateDetailsFileMapConfig = async ({
  config,
  operation,
  value,
  snpFileMapConfig,
}: {
  config: ConfigType;
  operation: 'deleteFile' | 'createFile' | 'createSuffixFile';
  realFileName;
  value: string | snpFile;
  snpFileMapConfig?: FileMapConfig;
}) => {
  let newFileMapConfig = snpFileMapConfig;

  if (!newFileMapConfig) {
    newFileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) => {
      return parseJSON(bufferData.toString());
    });
  }

  if (newFileMapConfig === undefined) {
    return null;
  }

  const detailsFile = {
    realFileName: '',
    realFileNameFullPath: '',
    snpName: '',
    keySnpSuffix: '',
    snpFullPath: '',
  };

  if (typeof value === 'object') {
    detailsFile.realFileName = value.realFileName;
    detailsFile.realFileNameFullPath = value.realPath;
    detailsFile.snpName = value.SNPSuffixFileName;
    detailsFile.snpFullPath = value.path;
  } else if (value.includes('.snp/')) {
    detailsFile.snpFullPath = value;
    detailsFile.snpName = path.basename(detailsFile.snpFullPath);
  } else {
    detailsFile.snpName = value;
    detailsFile.snpFullPath = createPath([config.snpCatalog, value]);
  }

  detailsFile.keySnpSuffix = formatSnp(detailsFile.snpName, 'key') || '';
  if (!detailsFile.realFileName) {
    detailsFile.realFileName = getRealFileName({ config, contentToCheck: [detailsFile.snpFullPath] })[0];
  }
  if (!detailsFile.realFileNameFullPath) {
    detailsFile.realFileNameFullPath = createPath([config.projectCatalog, detailsFile.realFileName]);
  }

  if (operation === 'createSuffixFile' && newFileMapConfig.snpFileMap) {
  }

  if (operation === 'createFile' && newFileMapConfig.snpFileMap) {
    newFileMapConfig.snpFileMap[detailsFile.realFileName][detailsFile.keySnpSuffix].isCreated = true;
    newFileMapConfig.createdFileMap.push(detailsFile.keySnpSuffix);
  }

  if (operation === 'deleteFile' && newFileMapConfig.snpFileMap) {
    newFileMapConfig.fileMap = newFileMapConfig.fileMap.filter((file) => file !== detailsFile.snpName);

    const snpFileMapEntry = newFileMapConfig.snpFileMap[detailsFile.realFileName];
    if (snpFileMapEntry) {
      delete snpFileMapEntry[detailsFile.keySnpSuffix];

      if (Object.keys(snpFileMapEntry).length === 0) {
        delete newFileMapConfig.snpFileMap[detailsFile.realFileName];
      }
    }
  }
  return await updateFileMapConfig(config, newFileMapConfig, true);
};
