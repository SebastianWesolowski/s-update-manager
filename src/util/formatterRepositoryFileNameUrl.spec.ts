import { buildURL } from './formatterRepositoryFileNameUrl';

describe('buildURL', () => {
  describe('regular URLs', () => {
    it('should correctly combine base URL with relative paths', () => {
      const result = buildURL({
        baseURL: 'https://example.com/api/',
        relativePaths: ['users', 'profile'],
      });

      expect(result).toBe('https://example.com/api/users/profile');
    });

    it('should handle query parameters correctly', () => {
      const result = buildURL({
        baseURL: 'https://example.com/api/',
        relativePaths: ['search'],
        queryParams: { q: 'test', page: '1' },
      });

      expect(result).toBe('https://example.com/api/search?q=test&page=1');
    });

    it('should handle hash fragments correctly', () => {
      const result = buildURL({
        baseURL: 'https://example.com/docs/',
        relativePaths: ['guide'],
        hash: '#section-1',
      });

      expect(result).toBe('https://example.com/docs/guide#section-1');
    });

    it('should handle paths with leading and trailing slashes', () => {
      const result = buildURL({
        baseURL: 'https://example.com/api/',
        relativePaths: ['/users/', '/profile/'],
      });

      expect(result).toBe('https://example.com/api/users/profile');
    });
  });

  describe('GitHub URLs', () => {
    it('should add refs/heads for GitHub raw URLs', () => {
      const result = buildURL({
        baseURL: 'https://raw.githubusercontent.com/owner/repo/main/',
        relativePaths: ['src', 'file.ts'],
      });

      expect(result).toBe('https://raw.githubusercontent.com/owner/repo/refs/heads/main/src/file.ts');
    });

    it('should handle GitHub URLs with query parameters and hash', () => {
      const result = buildURL({
        baseURL: 'https://raw.githubusercontent.com/owner/repo/develop/',
        relativePaths: ['docs', 'README.md'],
        queryParams: { token: 'abc123' },
        hash: '#installation',
      });

      expect(result).toBe(
        'https://raw.githubusercontent.com/owner/repo/refs/heads/develop/docs/README.md?token=abc123#installation'
      );
    });

    it('should correctly format GitHub repository URL with template catalog path', () => {
      const result = buildURL({
        baseURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateWithImageWithConfig',
        relativePaths: ['templateCatalog/.gitignore-default.md'],
      });

      expect(result).toBe(
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/refs/heads/dev/mock/mockTemplateWithImageWithConfig/templateCatalog/.gitignore-default.md'
      );
    });

    it('should handle complex GitHub paths with multiple segments', () => {
      const result = buildURL({
        baseURL:
          'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateWithImageWithConfig',
        relativePaths: ['templateCatalog', '.gitignore-default.md'],
      });

      expect(result).toBe(
        'https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/refs/heads/dev/mock/mockTemplateWithImageWithConfig/templateCatalog/.gitignore-default.md'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty query params object', () => {
      const result = buildURL({
        baseURL: 'https://example.com/api/',
        relativePaths: ['users'],
        queryParams: {},
      });

      expect(result).toBe('https://example.com/api/users');
    });

    it('should handle empty hash string', () => {
      const result = buildURL({
        baseURL: 'https://example.com/api/',
        relativePaths: ['users'],
        hash: '',
      });

      expect(result).toBe('https://example.com/api/users');
    });

    it('should handle malformed base URLs', () => {
      expect(() =>
        buildURL({
          baseURL: 'not-a-valid-url',
          relativePaths: ['test'],
        })
      ).toThrow();
    });
  });
});
