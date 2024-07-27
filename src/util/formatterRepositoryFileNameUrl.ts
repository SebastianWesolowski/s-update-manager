import { format } from 'url';

export const formatterRepositoryFileNameUrl = ({
  repositoryUrl,
  fileName,
}: {
  repositoryUrl: string;
  fileName: string;
}): string => {
  const urlObj = new URL(repositoryUrl);

  urlObj.pathname = `${urlObj.pathname}/${fileName}`;

  return format(urlObj);
};
