import { ConfigType } from '@/feature/config/types';
import { FileMapConfig } from '@/feature/updateFileMapConfig';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';
import { isEmptyObject } from '@/util/isEmptyObject';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';
// TODO Remove it unused
const validateSuffixes = (suffixes: string[]): void => {
  const pattern = /^-.*\.md$/;
  const invalidSuffixes: string[] = [];

  suffixes.forEach((suffix) => {
    if (!pattern.test(suffix)) {
      invalidSuffixes.push(suffix);
    }
  });

  if (invalidSuffixes.length > 0) {
    console.error('Invalid suffix patterns found:');
    invalidSuffixes.forEach((suffix) => {
      console.error(`Invalid suffix pattern: ${suffix}. Suffix must start with '-' and end with '.md'.`);
    });
  } else {
    console.log('All suffixes are valid.');
  }
};

const getKeyFromSuffix = (suffix: string): string => {
  const keyBase = suffix.replace(/^-/, '').replace(/\.md$/, '').replace(/\./g, '');
  return `${keyBase}File`;
};
export const scanExtraFileFromConfig = async (config: ConfigType): Promise<ConfigType> => {
  const snpFileMapConfig: FileMapConfig = await readFile(config.snpFileMapConfig).then(async (bufferData) =>
    parseJSON(bufferData.toString())
  );

  const suffixes = config.availableSNPSuffix;
  validateSuffixes(suffixes);
  for (const suffix of suffixes) {
    const key = getKeyFromSuffix(suffix);

    for (const keyFileName in snpFileMapConfig.snpFileMap) {
      if (isEmptyObject(snpFileMapConfig.snpFileMap[keyFileName][key])) {
        const filePath = createPath([config.snpCatalog, `${keyFileName}${suffix}`]);

        await createFile({
          filePath,
          content: '',
          isDebug: config.isDebug,
        }).then(async () => {
          if (snpFileMapConfig.snpFileMap) {
            // await updateDetailsFileMapConfig({ config, operation: 'createFile', value: filePath, snpFileMapConfig });
          }
        });
      }
    }
  }

  return config;
};
