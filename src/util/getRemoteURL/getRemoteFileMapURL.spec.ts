import { getRemoteFileMapURL } from './getRemoteFileMapURL';
import { defaultConfig } from '@/feature/config/const';
import { ConfigType } from '@/feature/config/types';

describe('getRemoteFileMapURL', () => {
  let config: ConfigType;

  beforeEach(() => {
    // Resetowanie konfiguracji przed każdym testem
    config = { ...defaultConfig };
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
