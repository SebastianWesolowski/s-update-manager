module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['breaking', 'chore', 'ci', 'clean', 'config', 'docs', 'feat', 'fix', 'refactor', 'release', 'test'],
    ],
    'header-max-length': [2, 'always', 128],
    'header-min-length': [2, 'always', 3],
  },
};
