# Reusable workflow for PRs; to eject, you can replace this file with
# https://github.com/PLACEHOLDER_GITHUB_USER/PLACEHOLDER_GITHUB_USER/blob/main/.github/workflows/pr.yml
name: Pull Request

on: [pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x, 21.x]

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm run lint:check
      - run: npm run build:prod --if-present
      - run: npm test:check
