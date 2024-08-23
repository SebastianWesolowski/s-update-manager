/**
 * Builds a correctly formatted URL by combining a base URL, multiple relative path segments, query parameters, and an optional hash fragment.
 *
 * @param baseURL - The base URL to which the relative paths will be appended. Example: 'https://example.com:8080/api/'.
 * @param relativePaths - An array of relative path segments to append to the base URL. Each segment can start with or without a leading slash. Example: ['abs', 'data'].
 * @param queryParams - An object containing key-value pairs to be added as query parameters. Example: { id: '123', type: 'user' }.
 * @param hash - An optional hash fragment to be appended to the URL. Example: '#overview'.
 * @returns A correctly formatted URL string combining all provided parts.
 *
 * @example
 * const url = buildURL('https://example.com:8080/api/', ['abs', 'data'], { id: '123', type: 'user' }, '#overview');
 * console.log(url); // 'https://example.com:8080/api/abs/data?id=123&type=user#overview'
 */
export const buildURL = ({
  baseURL,
  relativePaths,
  queryParams = {},
  hash = '',
}: {
  baseURL: string;
  relativePaths: string[];
  queryParams?: Record<string, string>;
  hash?: string;
}): string => {
  // Tworzenie obiektu URL z bazowego adresu
  const url = new URL(baseURL);

  // Łączenie ścieżki bazowej z relatywnymi częściami, usuwanie zbędnych ukośników
  const fullPath = relativePaths.map((path) => path.replace(/^\//, '').replace(/\/$/, '')).join('/');

  url.pathname = `${url.pathname.replace(/\/$/, '')}/${fullPath}`;

  // Dodanie parametrów zapytania (jeśli istnieją)
  Object.keys(queryParams).forEach((key) => {
    url.searchParams.append(key, queryParams[key]);
  });

  // Dodanie fragmentu (hash) (jeśli istnieje)
  if (hash) {
    url.hash = hash;
  }

  // Zwrócenie pełnego URL jako string
  return url.toString();
};
