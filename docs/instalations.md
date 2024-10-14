# instalations

## Install

if you want to use update-manager in your project, you need to install it first.

use your favorite package manager to install update-manager.

```bash
npm install s-update-manager
yarn add s-update-manager
pnpm add s-update-manager
bun add s-update-manager
```

etc.

## Choose template repository

before use you have to chose repository with templates.

You have 2 way

- default repos [default-list-repo](default-list-repo.md)
- create your own repo [create-your-own-repo](create-your-own-repo.md)

## setup script

in package.json add script to your project

Assumptions:

- project name on github: your-project-name
- username on github: User
- template name: node

```json
"scripts": {
  "update": "s-update --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'",
  "build": "s-build --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'",
  "init": "s-init --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'"
}
```

Run script depends on your needs

- `init` - initialize project with template
- `build` - build project after [adjust configuration](adjust-configuration.md) files
- `update` - update project if new version of template is avaliable

## CLI parameters

- `-remoteRepository` - remote repository with template
- `-template` - template name
- `-project` - project path
- `-sumConfig` - config configuration path
- `-isDebug` - debug mode
- `-sumCatalog` - config catalog
- `-projectCatalog` - project catalog
- `-sumConfigFileName` - config file name
