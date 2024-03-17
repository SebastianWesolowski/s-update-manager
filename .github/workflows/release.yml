# Reusable workflow for releases; to eject, you can replace this file with
# https://github.com/SebastianWesolowski/SebastianWesolowski/blob/main/.github/workflows/release.yml
name: Release
on:
  push:
    branches:
      - main
      - master
jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: "📝Checkout"
        uses: actions/checkout@v4
      - run: echo "node_version=$(cat .github/nodejs.version)" >> $GITHUB_ENV

      - name: "Setup 🟢Node ${{ env.node_version }}"
        uses: actions/setup-node@v4
        with:
          node-version: "${{ env.node_version }}"
          cache: 'yarn'

      - name: "📂 Install dependencies"
        run: yarn install --frozen-lockfile --ignore-scripts  --omit=dev

      - name: "🚀Release"
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
