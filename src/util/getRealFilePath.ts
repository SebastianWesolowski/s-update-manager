import path from 'path';
import { ConfigType } from '@/feature/config/types';
import { createPath } from '@/util/createPath';
import { getRealFileName } from '@/util/getRealFileName';

export const getRealFilePath = ({
  config,
  SNPSuffixFileName,
}: {
  config: ConfigType;
  SNPSuffixFileName: string;
}): string => {
  const realFileName = getRealFileName({ config, contentToCheck: [SNPSuffixFileName] })[0];

  const snpPath = SNPSuffixFileName.replace(config.templateCatalogName, '');
  const directoryPath = path.dirname(snpPath);
  let realFilePath = createPath([directoryPath, realFileName]);

  if (realFilePath.startsWith('/')) {
    realFilePath = realFilePath.slice(1);
  }
  return realFilePath;
};
