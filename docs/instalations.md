# Installation Guide for s-update-manager

## Install

To use `s-update-manager `in your project, you need to install it first. Use your favorite package manager to install s-update-manager:

```bash
npm install s-update-manager
# or
yarn add s-update-manager
# or
pnpm add s-update-manager
```

## Choose a Template Repository

Before using s-update-manager, you need to choose a repository with templates. You have two options:

1. Use default repositories: [Default List of Repos](default-list-repo.md)
2. Create your own repo: [Create Your Own Repo](create-your-own-repo.md)

## Set Up Scripts

Add the following scripts to your `package.json` file:

```json
"scripts": {
  "update": "s-update --remoteRepository='https://github.com/User/your-project-name/tree/main/templateCatalog'",
  "build": "s-build --remoteRepository='https://github.com/User/your-project-name/tree/main/templateCatalog'",
  "init": "s-init --remoteRepository='https://github.com/User/your-project-name/tree/main/templateCatalog'"
}
```

Replace `User/your-project-name` with the actual GitHub username and repository name where your template is stored.

## Usage

After setting up the scripts, you can use them as follows:

- `npm run init` or `yarn init`: Initialize your project with the template
- `npm run build` or `yarn build`: Build your project after [adjusting configuration](adjust-configuration.md) files
- `npm run update` or `yarn update`: Update your project if a new version of the template is available

## Next Steps

- For more information on available CLI parameters, see the [CLI Parameters](cli-parameters.md) documentation.
- To learn how to use s-update-manager in your workflow, check out the [How to Use](howToUse.md) guide.
- If you want to customize the template for your project, refer to the [Adjust Configuration](adjust-configuration.md) guide.
