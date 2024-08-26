# s-update-manager

<a href="https://github.com/SebastianWesolowski/starter-npm-package"><img align="left" width="440" height="180" alt="s-update-manager package" src="srcReadme/heroImageReposytory.png"></a>

## Important Links

- [![npm package][npm-img]][npm-url]
- [![Build Status][build-img]][build-url]
- [Author page](PLACEHOLDER_PAGE_AUTHOR)

<br>

**Remove before final release**
- [Set up your repository](docs/HowToAutoDeploy.md)
- [Way to work](docs/WayToWrok.md)
- [Known issues](docs/knowProblems.md)

---

<br/>

s-update-manager is a npm package for updating a template dependent project

## Install

```bash
npm install s-update-manager
```

## Usage

use s-init script in your package json file
```bash
"init": "s-init --snpConfig ./.snp --template node --project ./ --remoteRepository https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/"
```

use CLI parameters:

`snpConfig: './.snp'`
`template: 'node'`
`project: './tes/fakeProjectRootfolder'`
`remoteRepository: 'https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/'`
`debug: true`

You can see example project in `test/realProject/`


## Badges
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]


[build-img]: https://github.com/SebastianWesolowski/s-update-manager/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/SebastianWesolowski/s-update-manager/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/s-update-manager
[downloads-url]: https://www.npmtrends.com/s-update-manager
[npm-img]: https://img.shields.io/npm/v/s-update-manager
[npm-url]: https://www.npmjs.com/package/s-update-manager
[issues-img]: https://img.shields.io/github/issues/SebastianWesolowski/s-update-manager
[issues-url]: https://github.com/SebastianWesolowski/s-update-manager/issues
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
repository react

