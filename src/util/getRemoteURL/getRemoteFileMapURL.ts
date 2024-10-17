import { ConfigType } from '@/feature/config/types';
import { buildURL } from '@/util/formatterRepositoryFileNameUrl';

export function getRemoteFileMapURL(config: ConfigType): string {
  let repositoryURL = config.remoteRepository;
  const fileName = config.sumFileMapConfigFileName;
  const templateCatalogName = config.templateCatalogName;

  // Check if templateCatalogName is in the URL; if not, add it
  if (!repositoryURL.includes(templateCatalogName)) {
    repositoryURL = buildURL({
      baseURL: repositoryURL,
      relativePaths: [templateCatalogName],
    });
  }

  // Add the file name to the URL if it's missing
  if (!repositoryURL.endsWith(fileName)) {
    repositoryURL = buildURL({
      baseURL: repositoryURL,
      relativePaths: [fileName],
    });
  }

  // Update URL to raw GitHub URL format, if applicable
  const isGitHubURL = repositoryURL.includes('github.com');
  return isGitHubURL
    ? repositoryURL.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/').replace('/tree/', '/')
    : repositoryURL.replace(/\/$/, ''); // Remove trailing slash if present
}
