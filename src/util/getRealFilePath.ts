import path from 'path';
import { ConfigType } from '@/feature/config/types';
import { createPath } from '@/util/createPath';
import { getRealFileName } from '@/util/getRealFileName';

export const getRealFilePath = ({
  config,
  SUMSuffixFileName,
}: {
  config: ConfigType;
  SUMSuffixFileName: string;
}): string => {
  const realFileName = getRealFileName({ config, contentToCheck: [SUMSuffixFileName] })[0];

  const sumPath = SUMSuffixFileName.replace(config.templateCatalogName, '');
  const directoryPath = path.dirname(sumPath);
  let realFilePath = createPath([directoryPath, realFileName]);

  if (realFilePath.startsWith('/')) {
    realFilePath = realFilePath.slice(1);
  }
  return realFilePath;
};
