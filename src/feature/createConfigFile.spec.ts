import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig_step_init } from '@/feature/__tests__/const';
import { ConfigType } from '@/feature/config/types';
import { createConfigFile } from '@/feature/createConfigFile';
import { isFileOrFolderExists } from '@/util/isFileOrFolderExists';
import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

describe('createConfigFile', () => {
  let config: ConfigType;

  beforeEach(async () => {
    config = { ...mockConfig_step_init };
    await cleanUpFiles({
      snpCatalog: config.snpCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });
  });

  afterEach(async () => {
    await cleanUpFiles({
      snpCatalog: config.snpCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });
  });

  it('should return correct creation', async () => {
    createConfigFile(config).then(async ({ configFilePath }) => {
      let result: any;
      if (await isFileOrFolderExists(configFilePath)) {
        result = await readFile(configFilePath).then(async (bufferData) => parseJSON(bufferData.toString()));
      }
      expect(result).toStrictEqual({
        config: {
          ...config,
        },
      });
    });
  });
});
