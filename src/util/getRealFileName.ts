import path from 'path';
import { ConfigType } from '@/feature/defaultConfig';

export const getRealFileName = ({
  config,
  contentToCheck,
}: {
  config: ConfigType;
  contentToCheck: string[];
}): string[] => {
  const realFileName = contentToCheck.map((fileName) => {
    config.availableSNPSuffix.forEach((phrase) => {
      fileName = fileName.split(phrase).join('');
    });
    return path.basename(fileName);
  });

  return [...new Set(realFileName)];
};
