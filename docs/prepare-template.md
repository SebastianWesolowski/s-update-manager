# Prepare Template

The `s-prepare-template` script is designed to create a template structure for use with `s-update-manager`.

## How to Create a Template

1. Create a new repository and install `s-update-manager`.
2. You can see an example of a repository with templates at [s-template](https://github.com/SebastianWesolowski/s-template).
3. Use the `s-prepare-template` script to create the template structure. For more details on the structure, see [Template Structure](template-structure.md).
4. script automatically create config file and tmplate structure in `templateCatalog` directory
5. Update your repository on GitHub with the generated template structure.
6. Provide the remote repository URL to the `s-update-manager` script as the `-remoteRepository` parameter.

## Config for prepare-template

The `s-prepare-template` created config during prepare process. You can find it in the `templateCatalog` directory. Config file is named `repositoryMap.json`.

it look like this:

```json
{
  "projectCatalog": "./templates/node",
  "templateCatalogName": "templateCatalog",
  "templateCatalogPath": "./templates/node/templateCatalog",
  "repositoryMapFileName": "repositoryMap.json",
  "repositoryMapFilePath": "./templateCatalog/repositoryMap.json",
  "bumpVersion": true,
  "isDebug": false,
  "_": [],
  "templateVersion": "1.0.3",
  "fileMap": [
    "templateCatalog/.gitignore-default.md",
    "templateCatalog/LICENSE-default.md",
    "templateCatalog/README.md-default.md",
    "templateCatalog/changelog.config.js-default.md",
    "templateCatalog/clean-package.config.json-default.md",
    ...
    "templateCatalog/tools/customize.sh-default.md",
    "templateCatalog/tools/upload.sh-default.md",
    "templateCatalog/tsconfig.build.json-default.md",
    "templateCatalog/tsconfig.json-default.md",
    "templateCatalog/yarn.lock-default.md"
  ],
  "templateFileList": [
    "./.gitignore",
    "./LICENSE",
    "./README.md",
    "./changelog.config.js",
    "./clean-package.config.json",
    ...
    "./tools/customize.sh",
    "./tools/upload.sh",
    "./tsconfig.build.json",
    "./tsconfig.json",
    "./yarn.lock"
  ],
  "rootPathFileList": [
    "./templates/node/.gitignore",
    "./templates/node/LICENSE",
    "./templates/node/README.md",
    "./templates/node/changelog.config.js",
    "./templates/node/clean-package.config.json",
    ...
    "./templates/node/tools/customize.sh",
    "./templates/node/tools/upload.sh",
    "./templates/node/tsconfig.build.json",
    "./templates/node/tsconfig.json",
    "./templates/node/yarn.lock"
  ]
}

```

- `projectCatalog`: Path to the project catalog
- `templateCatalogName`: Name of the template catalog
- `templateCatalogPath`: Path to the template catalog
- `repositoryMapFileName`: Name of the repository map file
- `repositoryMapFilePath`: Path to the repository map file
- `bumpVersion`: If true, the template version will be bumped
- `isDebug`: If true, the script will run in debug mode
- `_`: it reserved for cli arguments
- `templateVersion`: Version of the template
- `fileMap`: List of files to be copied from the project catalog to the `templateCatalog`
- `templateFileList`: List of files from real project
- `rootPathFileList`: List of files relatet root catalog repository

## Script Parameters

The `s-prepare-template` script accepts the following parameters:

- `--sDebug`: Enable debug mode
- `--projectCatalog`: Path to the project catalog

## Example

Add the following script to your `package.json`:

```json
"scripts": {
  "prepare-template": "s-prepare-template --sDebug --projectCatalog=./project-catalog"
}
```

Run this script to create the template structure:

```bash
npm run prepare-template
# or
yarn prepare-template
```

## Next Steps

After preparing your template, you can use it with `s-update-manager`. For more information on how to use your custom template, see [Create Your Own Repo](create-your-own-repo.md) and [How to Use](howToUse.md).
