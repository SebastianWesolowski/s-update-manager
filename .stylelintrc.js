const browsersList = require('./tools/transform-browser-list/index')('./.browserslistrc');

module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-tailwindcss',
    'stylelint-config-rational-order-fix',
  ],
  plugins: [
    'stylelint-scss',
    'stylelint-no-unresolved-module',
    'stylelint-no-unsupported-browser-features',
    'stylelint-order',
    'stylelint-config-rational-order-fix/plugin',
  ],
  rules: {
    'order/properties-order': [],
    'plugin/rational-order': [
      true,
      {
        'border-in-box-model': false,
        'empty-line-between-groups': false,
      },
    ],
    'selector-class-pattern': '^[a-zA-Z0-9-_]+$',
    'plugin/no-unresolved-module': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'variants', 'responsive', 'screen'],
      },
    ],
    'no-descending-specificity': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'variants', 'responsive', 'screen'],
      },
    ],
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        browsers: browsersList,
        ignorePartialSupport: true,
      },
    ],
    'scss/double-slash-comment-whitespace-inside': 'never',
    'comment-no-empty': null,
    'scss/comment-no-empty': true,
  },
};
