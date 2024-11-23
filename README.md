# s-update-manager

<a href="https://github.com/SebastianWesolowski/starter-npm-package"><img align="left" width="440" height="180" alt="s-update-manager package" src="srcReadme/heroImageReposytory.png"></a>

## Important Links

- [![npm package][npm-img]][npm-url]
- [![Build Status][build-img]][build-url]
- [Author page](https://wesolowski.dev)

<br>
<br>

## Table of Contents

- [What is s-update-manager?](docs/why.md)
- [Instalations](docs/instalations.md)
  - [How to use](docs/howToUse.md)
  - [default list repo](docs/default-list-repo.md)
  - [create your own repo](docs/create-your-own-repo.md)
  - [template structure](docs/template-structure.md)
  - [CLI parameters](docs/cli-parameters.md)
  - [config File](docs/config-file.md)
  - [ignore File](docs/ignore-file.md)
  - [Adjust configuration](docs/adjust-configuration.md)
- [How to use](docs/howToUse.md)
- [Known Problems](docs/knowProblems.md)

- [Development process](docs/development.md)

## What is s-update-manager?

s-update-manager is a tool designed to maintain project configurations based on an external repository. It allows you to maintain a single repository with a default configuration that can be propagated to all your projects while still allowing for customization.

For more details on why this tool was created and how it works, check out our [Why document](docs/why.md).

## Installation

To install s-update-manager, use your favorite package manager:

```bash
npm install s-update-manager
# or
yarn add s-update-manager
```

For detailed installation instructions, see our [Installation Guide](docs/instalations.md).

## Usage

After installation, you can use s-update-manager by setting up scripts in your `package.json`:

```json
"scripts": {
  "update": "s-update --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'",
  "build": "s-build --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'",
  "init": "s-init --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'"
}
```

### Ignore file

If you want to block download someone form remote reposytory, you can create `.sumignore` it works similarly to `.gitignore`. More detailed in [ignore file](docs/ignore-file.md)

For more detailed usage instructions, check out our [How to Use guide](docs/howToUse.md).

## Documentation

- [Why use s-update-manager?](docs/why.md)
- [Installation Guide](docs/instalations.md)
- [How to Use](docs/howToUse.md)
- [CLI Parameters](docs/cli-parameters.md)
- [Create Your Own Repo](docs/create-your-own-repo.md)
- [Prepare Template](docs/prepare-template.md)
- [Template Structure](docs/template-structure.md)
- [Adjust Configuration](docs/adjust-configuration.md)
- [Default List of Repos](docs/default-list-repo.md)

## Development

For information on the development process and available scripts, see our [Development guide](docs/development.md).

## Known Issues

For a list of known issues and their workarounds, please refer to our [Known Problems document](docs/knowProblems.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

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
