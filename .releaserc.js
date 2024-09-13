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
        writerOpts: {
          groupBy: 'scIssue',
          commitsSort: ['scIssue', 'type'],
          helpers,
          commitGroupsSort: 'title',
          transform: (commit, context) => {
            if (commit.type === 'feat') {
              commit.type = 'Features';
            } else if (commit.type === 'fix') {
              commit.type = 'Bug Fixes';
            } else if (commit.type === 'build') {
              commit.type = 'Dependencies and Other Build Updates';
            }

            if (typeof commit.hash === 'string') {
              commit.shortHash = commit.hash.substring(0, 7);
            }

            if (typeof commit.subject === 'string') {
              let url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl;

              // Extract SC issue number
              const scMatch = commit.subject.match(/\[?(SC-\d+)\]?/);
              if (scMatch) {
                const scIssue = scMatch[1];
                commit.scIssue = scIssue;
                // Replace SC issue with linked version
                commit.subject = commit.subject.replace(
                  /\[?(SC-\d+)\]?/,
                  `[[${scIssue}](https://linear.app/wesolowskidev/issue/${scIssue})]`
                );
              } else {
                commit.scIssue = 'Other tasks'; // Assign to "Other tasks" if no SC- issue is found
              }

              if (url) {
                commit.commitUrl = `${url}/commit/${commit.hash}`;
              }
            }

            return commit;
          },
          commitPartial: '- {{subject}} ([{{shortHash}}]({{commitUrl}}))\n',
          commitGroupsSort: (a, b) => {
            const aMatch = typeof a.title === 'string' && a.title.match(/SC-(\d+)/);
            const bMatch = typeof b.title === 'string' && b.title.match(/SC-(\d+)/);

            if (aMatch && bMatch) {
              return parseInt(aMatch[1]) - parseInt(bMatch[1]);
            }

            // Ensure "Other tasks" comes last
            if (a.title === 'Other tasks') return 1;
            if (b.title === 'Other tasks') return -1;

            return a.title.localeCompare(b.title);
          },
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
