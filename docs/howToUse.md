# How to Use s-update-manager

After installing `s-update-manager` and initializing your project, you have two main options for using the tool:

1. Develop your base configuration and update the project using the `update` script.
2. Use a remote configuration and customize it for specific project needs using the file structure described in [Adjust Configuration](adjust-configuration.md). You can rebuild the files using the `build` script.

## Usage

### Initialization

To initialize your project with a template, use the `init` script in your `package.json` file:

```json
"scripts": {
  "init": "s-init --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'"
}
```

Run the initialization script:

```bash
npm run init
# or
yarn init
```

### Updating

To update your project with the latest template changes, use the `update` script:

```json
"scripts": {
  "update": "s-update --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'"
}
```

Run the update script:

```bash
npm run update
# or
yarn update
```

### Building

If you've made changes to your configuration files, use the `build` script to rebuild your project:

```json
"scripts": {
  "build": "s-build --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'"
}
```

Run the build script:

```bash
npm run build
# or
yarn build
```

## Customizing Templates

To customize templates for your specific project needs, refer to the [Adjust Configuration](adjust-configuration.md) guide.

## CLI Parameters

For a full list of available CLI parameters and how to use them, see the [CLI Parameters](cli-parameters.md) documentation.

## Creating Your Own Template Repository

If you want to create and use your own template repository, follow the guide on [Creating Your Own Repo](create-your-own-repo.md).

## Next Steps

- Learn about the [template structure](template-structure.md) used by s-update-manager.
- Explore how to [prepare your own template](prepare-template.md) for use with s-update-manager.
- Check out the [default list of repositories](default-list-repo.md) available for use with s-update-manager.
