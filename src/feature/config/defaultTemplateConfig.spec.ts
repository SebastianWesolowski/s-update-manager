import { defaultTemplateArgs } from '@/feature/args/const';
import { defaultTemplateConfig } from '@/feature/config/const';
import {
  getTemplateConfig,
  regenerateTemplateConfig,
  updateTemplateKeyConfig,
} from '@/feature/config/defaultTemplateConfig';
import { ConfigTemplateType, PartialConfig } from '@/feature/config/types';

// Test suite for the init function
describe('template configuration functions', () => {
  it('regenerateTemplateConfig - should return the expected file configuration', async () => {
    // Mock template configuration to override specific fields
    const mockTemplateConfig = {
      isDebug: false,
    };

    // Expected result after merging default and mock configurations
    const expectedConfig = {
      ...defaultTemplateConfig,
      ...mockTemplateConfig,
      repositoryMapFilePath: './templateCatalog/repositoryMap.json',
      templateCatalogPath: './templateCatalog',
    };

    // Generate the actual configuration using the regeneration function
    const result = regenerateTemplateConfig({
      ...defaultTemplateConfig,
      ...mockTemplateConfig,
    });

    // Assertion to verify the result matches the expected configuration
    expect(result).toStrictEqual(expectedConfig);
  });
  it('updateTemplateKeyConfig - should return the expected file configuration', async () => {
    const mockTemplateConfig = {
      isDebug: false,
    };

    const keyToUpdate: PartialConfig<ConfigTemplateType> = {
      isDebug: true,
    };

    const config = {
      ...mockTemplateConfig,
      ...defaultTemplateConfig,
    };

    // regenerateTemplateConfig is used inside updateTemplateKeyConfig
    const expectedConfig = regenerateTemplateConfig({
      ...defaultTemplateConfig,
      ...mockTemplateConfig,
      isDebug: true,
    });

    // Generate the actual configuration using the regeneration function
    const result = updateTemplateKeyConfig(config, keyToUpdate);

    expect(result).toStrictEqual(expectedConfig);
  });

  it('getTemplateConfig - should return the expected file configuration', async () => {
    const expectedConfig = {
      _: [],
      bumpVersion: true,
      isDebug: true,
      projectCatalog: './mock/mockTemplate',
      repositoryMapFileName: 'repositoryMap.json',
      repositoryMapFilePath: './mock/mockTemplate/templateCatalog/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
      templateCatalogPath: './mock/mockTemplate/templateCatalog',
    };

    const result: ConfigTemplateType = getTemplateConfig(defaultTemplateArgs);

    expect(result).toStrictEqual(expectedConfig);
  });
});
