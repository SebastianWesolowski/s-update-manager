import {
  mockConfig_step_initSave,
  mockSnpFileMapConfig_step_initSave,
  mockSnpFileMapConfig_step_prepareBaseSnpFileMap,
} from '@/feature/__tests__/const';
import { ConfigType } from '@/feature/config/types';
import { prepareBaseSnpFileMap } from '@/feature/prepareBaseFile';
import { createFile } from '@/util/createFile';
import { createPath } from '@/util/createPath';
import { deletePath } from '@/util/deletePath';

describe('prepareBaseSnpFileMap', () => {
  let config: ConfigType;

  beforeEach(async () => {
    config = { ...mockConfig_step_initSave };
    await deletePath(createPath(config.snpConfigFile), config.isDebug);
    await deletePath(createPath(config.snpFileMapConfig), config.isDebug);
    await createFile({
      filePath: config.snpConfigFile,
      content: JSON.stringify(mockConfig_step_initSave),
    });
    await createFile({
      filePath: config.snpFileMapConfig,
      content: JSON.stringify(mockSnpFileMapConfig_step_initSave),
    });
  });

  afterEach(async () => {
    await deletePath(createPath(config.snpConfigFile), config.isDebug);
    await deletePath(createPath(config.snpFileMapConfig), config.isDebug);
  });

  it('should return correct content', async () => {
    const result = await prepareBaseSnpFileMap(config);

    expect(result).toStrictEqual({
      config: mockConfig_step_initSave,
      snpFileMapConfig: mockSnpFileMapConfig_step_prepareBaseSnpFileMap,
    });
  });
});
