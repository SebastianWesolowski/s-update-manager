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
      filePath: config.sumConfigFilePath,
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
      remoteRepository: 'https://github.com/SebastianWesolowski/s-template/tree/main/templates/node',
      templateCatalogName: 'templateCatalog',
    };
    config = { ...config, ...mockConfig };

    const result = getRemoteFileMapURL(config);

    expect(result).toBe(
      'https://raw.githubusercontent.com/SebastianWesolowski/s-template/main/templates/node/templateCatalog/repositoryMap.json'
    );
  });

  it('should return correct URL for GitHub nested folder', () => {
    const mockConfig = {
      remoteRepository:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-template/refs/heads/refs/heads/main/templates/node/templateCatalog/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
    };
    config = { ...config, ...mockConfig };

    const result = getRemoteFileMapURL(config);

    expect(result).toBe(
      'https://raw.githubusercontent.com/SebastianWesolowski/s-template/refs/heads/refs/heads/main/templates/node/templateCatalog/repositoryMap.json'
    );
  });

  it('should return correct URL for GitHub nested folder', () => {
    const mockConfig = {
      remoteRepository: 'https://raw.githubusercontent.com/SebastianWesolowski/s-template/main/templates/node/',
      templateCatalogName: 'templateCatalog',
    };
    config = { ...config, ...mockConfig };

    const result = getRemoteFileMapURL(config);

    expect(result).toBe(
      'https://raw.githubusercontent.com/SebastianWesolowski/s-template/refs/heads/refs/heads/main/templates/node/templateCatalog/repositoryMap.json'
    );
  });

  it('should return correct URL for GitHub file path', () => {
    const mockConfig = {
      remoteRepository:
        'https://github.com/SebastianWesolowski/s-template/tree/main/templates/node/templateCatalog/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
    };
    config = { ...config, ...mockConfig };

    const result = getRemoteFileMapURL(config);

    expect(result).toBe(
      'https://raw.githubusercontent.com/SebastianWesolowski/s-template/main/templates/node/templateCatalog/repositoryMap.json'
    );
  });

  it('should return correct URL for raw data', () => {
    const mockConfig = {
      remoteRepository:
        'https://raw.githubusercontent.com/SebastianWesolowski/s-template/main/templates/node/templateCatalog/repositoryMap.json',
      templateCatalogName: 'templateCatalog',
    };
    config = { ...config, ...mockConfig };

    const result = getRemoteFileMapURL(config);

    expect(result).toBe(
      'https://raw.githubusercontent.com/SebastianWesolowski/s-template/main/templates/node/templateCatalog/repositoryMap.json'
    );
  });
});
