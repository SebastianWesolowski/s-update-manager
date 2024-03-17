module.exports = {
  disableEmoji: false,
  format: '{type}{scope}: {emoji}{subject}',
  list: ['feat', 'fix', 'clean', 'refactor', 'release', 'ci', 'config', 'chore', 'docs', 'test', 'breaking'],
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: ['type', 'scope', 'subject', 'lerna'],
  scopes: [],
  types: {
    chore: {
      description: 'Build process or auxiliary tool changes',
      emoji: '🔧',
      value: 'chore',
    },
    ci: {
      description: 'CI related changes',
      emoji: '🎡',
      value: 'ci',
    },
    clean: {
      description: 'Sorting or cleaning out the code',
      emoji: '🧹',
      value: 'clean',
    },
    docs: {
      description: 'Documentation only changes',
      emoji: '📚️',
      value: 'docs',
    },
    feat: {
      description: 'A new feature',
      emoji: '✨',
      value: 'feat',
    },
    fix: {
      description: 'A bug fix',
      emoji: '🐛',
      value: 'fix',
    },
    refactor: {
      description: 'A code change that neither fixes a bug or adds a feature',
      emoji: '♻️',
      value: 'refactor',
    },
    release: {
      description: 'Create a release commit',
      emoji: '📦',
      value: 'release',
    },
    test: {
      description: 'Adding missing tests',
      emoji: '🚨',
      value: 'test',
    },
    breaking: {
      description: 'Introducing breaking changes.',
      emoji: '💥',
      value: 'breaking',
    },
    config: {
      description: 'Changing configuration files.',
      emoji: '⚙️',
      value: 'config',
    },
    messages: {
      type: "Select the type of change that you're committing:",
      customScope: 'Select the scope this component affects:',
      subject: 'Write a short, imperative mood description of the change:\n',
      breaking: 'List any breaking changes:\n',
      confirmCommit: 'The packages that this commit has affected\n',
    },
  },
};
