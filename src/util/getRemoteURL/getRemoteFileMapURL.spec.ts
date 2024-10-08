import { getRemoteFileMapURL } from './getRemoteFileMapURL';
import { cleanUpFiles } from '@/feature/__tests__/cleanForTests';
import { mockConfig } from '@/feature/__tests__/const';
import { ConfigType } from '@/feature/config/types';
import { createFile } from '@/util/createFile';

describe('getRemoteFileMapURL', () => {
  let config: ConfigType;

  beforeEach(async () => {
    config = { ...mockConfig.step.createConfigFile };

    await cleanUpFiles({
      sumCatalog: config.sumCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });

    await createFile({
      filePath: config.sumConfigFile,
      content: JSON.stringify(config),
    });
  });

  afterEach(async () => {
    await cleanUpFiles({
      sumCatalog: config.sumCatalog,
      directoryPath: config.projectCatalog,
      isDebug: config.isDebug,
    });
  });

  it('should return correct URL for GitHub root folder', () => {
    const mockConfig = {
      remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/template/node',
      templateCatalogName: 'templateCatalog',
    };
    config = { ...config, ...mockConfig };

    const result = getRemoteFileMapURL(config);

    expect(result).toBe(
      'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/template/node/templateCatalog/repositoryMap.json'
    );
  });

  it('should return correct URL for GitHub nested folder', () => {
    const mockConfig = {
      remoteRepository:
        'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/template/node/templateCatalog',
      templateCatalogName: 'templateCatalog',
    };
    config = { ...config, ...mockConfig };

    const result = getRemoteFileMapURL(config);

    expect(result).toBe(
      'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/template/node/templateCatalog/repositoryMap.json'
    );
  });

  it('should return correct URL for GitHub nested folder', () => {
    const mockConfig = {
      remoteRepository: 'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/test/testTemplate',
      templateCatalogName: 'templateCatalog',
    };
    config = { ...config, ...mockConfig };

    const result = getRemoteFileMapURL(config);

    expect(result).toBe(
      'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/test/testTemplate/templateCatalog/repositoryMap.json'
    );
  });

  it('should return correct URL for GitHub file path', () => {
    const mockConfig = {
      remoteRepository:
        'https://github.com/SebastianWesolowski/s-update-manager/tree/dev/template/node/templateCatalog/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
    };
    config = { ...config, ...mockConfig };

    const result = getRemoteFileMapURL(config);

    expect(result).toBe(
      'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/template/node/templateCatalog/repositoryMap.json'
    );
  });

  it('should return correct URL for raw data', () => {
    const mockConfig = {
      remoteRepository:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/template/node/templateCatalog/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
    };
    config = { ...config, ...mockConfig };

    const result = getRemoteFileMapURL(config);

    expect(result).toBe(
      'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/template/node/templateCatalog/repositoryMap.json'
    );
  });
});
