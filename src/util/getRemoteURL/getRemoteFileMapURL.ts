import { ConfigType } from '@/feature/config/types';
import { buildURL } from '@/util/formatterRepositoryFileNameUrl';

export function getRemoteFileMapURL(config: ConfigType): string {
  let repositoryURL = config.remoteRepository;
  const fileName = config.REPOSITORY_MAP_FILE_NAME;
  const templateCatalogName = config.templateCatalogName;

  // Sprawdzenie, czy templateCatalogName jest w URL; jeśli nie, dodanie go
  if (!repositoryURL.includes(templateCatalogName)) {
    repositoryURL = buildURL({
      baseURL: repositoryURL,
      relativePaths: [templateCatalogName],
    });
  }

  // Dodanie nazwy pliku do URL, jeśli go brakuje
  if (!repositoryURL.endsWith(fileName)) {
    repositoryURL = buildURL({
      baseURL: repositoryURL,
      relativePaths: [fileName],
    });
  }

  // Aktualizacja URL do formatu surowego URL-a GitHub, jeśli dotyczy
  const isGitHubURL = repositoryURL.includes('github.com');
  return isGitHubURL
    ? repositoryURL.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/').replace('/tree/', '/')
    : repositoryURL.replace(/\/$/, ''); // Usuwanie ewentualnego ukośnika na końcu
}
