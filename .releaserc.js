module.exports = {
  branches: [
    {
      name: 'main',
      prerelease: false,
    },
    {
      name: 'dev',
      prerelease: true,
    },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          {
            type: 'build',
            scope: 'deps',
            release: 'patch',
          },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        issuePrefixes: ['SC-'],
        issueUrlFormat: 'https://linear.app/wesolowskidev/issue/SC-{{id}}',
        linkReferences: true,
        presetConfig: {
          types: [
            {
              type: 'feat',
              section: 'Features',
            },
            {
              type: 'fix',
              section: 'Bug Fixes',
            },
            {
              type: 'build',
              section: 'Dependencies and Other Build Updates',
              hidden: false,
            },
          ],
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        branches: ['main'],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md'],
        message: 'release: 📦 ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'echo "Preparing release" && yarn build:prod',
      },
    ],
  ],
};
