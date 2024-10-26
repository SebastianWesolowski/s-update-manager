const helpers = require('handlebars-helpers')();
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
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'build', section: 'Dependencies and Other Build Updates', hidden: false },
            { type: 'chore', section: 'Other tasks', hidden: false },
          ],
        },
        writerOpts: {
          groupBy: 'scIssue',
          commitsSort: ['scIssue', 'type'],
          helpers,
          commitGroupsSort: (a, b) => {
            if (a.title === 'Other tasks') return 1;
            if (b.title === 'Other tasks') return -1;

            const aMatch = a.title && a.title.match(/SC-(\d+)/);
            const bMatch = b.title && b.title.match(/SC-(\d+)/);

            if (aMatch && bMatch) {
              return parseInt(aMatch[1]) - parseInt(bMatch[1]);
            }

            return (a.title || '').localeCompare(b.title || '');
          },
          transform: (commit, context) => {
            if (commit.type === 'feat') {
              commit.type = 'Features';
            } else if (commit.type === 'fix') {
              commit.type = 'Bug Fixes';
            } else if (commit.type === 'build') {
              commit.type = 'Dependencies and Other Build Updates';
            } else if (commit.type === null || !commit.type || commit.type === 'chore') {
              commit.type = 'Other tasks';
            }

            if (typeof commit.hash === 'string') {
              commit.shortHash = commit.hash.substring(0, 7);
            }

            if (typeof commit.subject === 'string' || commit.subject === null) {
              let url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl;

              // Extract SC issue number

              if (commit.message && commit.subject === null) {
                commit.subject = commit.message;
              }

              const scMatch = commit.subject ? commit.subject.match(/\[?(SC-\d+)\]?/) : null;
              if (scMatch) {
                const scIssue = scMatch[1];
                commit.scIssue = scIssue;
                // Replace SC issue with linked version
                commit.subject = commit.subject.replace(
                  /\[?(SC-\d+)\]?/,
                  `[[${scIssue}](https://linear.app/wesolowskidev/issue/${scIssue})]`
                );
              } else {
                commit.scIssue = 'Other tasks';
              }

              if (url) {
                commit.commitUrl = `${url}/commit/${commit.hash}`;
              }
            }

            return commit;
          },
          commitPartial: '- {{subject}} ([{{shortHash}}]({{commitUrl}}))\n',
          mainTemplate: `{{> header}}

{{#each commitGroups}}

### {{#if (eq title "Other tasks")}}Other tasks{{else}}[{{title}}](https://linear.app/wesolowskidev/issue/{{title}}){{/if}}

{{#each commits}}
{{> commit root=@root}}
{{/each}}

{{/each}}
{{> footer}}`,
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
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
    '@semantic-release/npm',
  ],
};
