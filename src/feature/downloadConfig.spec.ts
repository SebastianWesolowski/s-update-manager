import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockSnpFileMapConfig_step_init, mockSnpFileMapConfig_step_initSave } from '@/feature/__tests__/const';
import { defaultConfig } from '@/feature/config/const';
import { ConfigType } from '@/feature/config/types';
import { downloadConfig } from '@/feature/downloadConfig';

describe('downloadConfig', () => {
  let config: ConfigType;

  beforeEach(async () => {
    config = { ...defaultConfig };
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

  it('should return correct content', async () => {
    const result = await downloadConfig(config);

    expect(result).toStrictEqual({
      config: {
        ...config,
      },
      downloadContent: mockSnpFileMapConfig_step_init,
      snpFileMapConfig: mockSnpFileMapConfig_step_initSave,
    });
  });
});
