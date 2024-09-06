import { bumpVersion } from './bumpVersion';
import { cleanUpFiles } from '../__tests__/cleanForTests';
import { ConfigTemplateType } from '../config/types';
import { mockTemplateConfig } from '@/feature/__tests__/const';
import { createFile } from '@/util/createFile';

describe('bumpVersion', () => {
  let templateConfig: ConfigTemplateType;
  beforeEach(async () => {
    templateConfig = { ...mockTemplateConfig.init };

    await cleanUpFiles({
      snpCatalog: templateConfig.templateCatalogPath,
      directoryPath: templateConfig.projectCatalog,
      isDebug: templateConfig.isDebug,
    });
  });

  afterEach(async () => {
    await cleanUpFiles({
      snpCatalog: templateConfig.templateCatalogPath,
      directoryPath: templateConfig.projectCatalog,
      isDebug: templateConfig.isDebug,
    });
  });

  it('should correctly bump version - without config file and templateVersion', async () => {
    const result = await bumpVersion(templateConfig);
    const expectTemplateConfig = { ...mockTemplateConfig.bumpVersion };
    delete expectTemplateConfig.templateVersion;

    expect({ ...result }).toStrictEqual({ templateConfig: expectTemplateConfig });
  });

  it('should correctly bump version - without config file, with existing templateVersion', async () => {
    templateConfig.templateVersion = '1.0.0';

    const result = await bumpVersion(templateConfig);

    expect({ ...result }).toStrictEqual({
      templateConfig: { ...mockTemplateConfig.bumpVersion },
    });
  });

  it('should correctly bump version - with config file', async () => {
    templateConfig.templateVersion = '1.0.0';

    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(templateConfig),
    });

    const result = await bumpVersion(templateConfig);

    expect({ ...result }).toStrictEqual({
      templateConfig: { ...mockTemplateConfig.bumpVersion, templateVersion: '1.0.1' },
    });
  });

  it('should not bump version when bumpVersion is set to false', async () => {
    templateConfig.templateVersion = '1.0.0';
    templateConfig.bumpVersion = false;

    await createFile({
      filePath: templateConfig.repositoryMapFilePath,
      content: JSON.stringify(templateConfig),
    });

    const result = await bumpVersion(templateConfig);

    expect({ ...result }).toStrictEqual({
      templateConfig: { ...mockTemplateConfig.bumpVersion, bumpVersion: false },
    });
  });
});
