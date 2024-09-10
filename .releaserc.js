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
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
          commitGroupsSort: 'prefix',
          commitsSort: 'subject',
        },
        writerOpts: {
          header: '### ${section}',
          commitPartial: '* ${emoji} [${issue}](${issueUrl}) ${subject} (${commitUrl})',
          issuePrefixes: [{ value: 'SC-', name: 'Linear' }],
        },
        issuePrefixes: ['SC-'],
        issueUrlFormat: 'https://linear.app/wesolowskidev/issue/{{prefix}}{{id}}',
        linkReferences: true,
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
