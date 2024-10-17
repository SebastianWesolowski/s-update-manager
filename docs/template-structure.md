# Template Structure

This document describes the expected structure of a template repository for use with `s-update-manager`.

## Example Repository Structure

Assumptions:

- Project name on GitHub: your-project-name
- Username on GitHub: User
- Template name: node

```
your-project-name/
└── node/
    ├── .gitignore
    ├── package.json
    ├── README.md
    ├── tsconfig.json
    ...
    └── templateCatalog/  # This directory is created with the `s-prepare-template` script
        ├── .gitignore-default.md
        ├── package.json-default.md
        ├── README.md-default.md
        ├── tsconfig.json-default.md
        ├── yarn.lock-default.md
        ├── repositoryMap.json
        └── tools/
            ├── test.sh-default.md
            └── test-new.sh-default.md
```

## Key Components

1. **Root Directory**: Contains the main project files.
2. **templateCatalog**: This directory is created by the `s-prepare-template` script and contains the template files.
3. **-default.md Files**: These files contain the default content for each project file. They will be used to generate or update the corresponding files in the target project.
4. **repositoryMap.json**: This file contains metadata about the template, including file mappings and version information.

## Usage

For this example, you would provide the remote repository URL in your `s-update-manager` commands like this:

```bash
scripts:{
  ...
  "init": "s-init --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'"
  ...
}
```

## Creating Your Own Template

To create your own template with this structure:

1. Set up your repository with the desired project files.
2. Install `s-update-manager` in your project.
3. Run the `s-prepare-template` script to generate the `templateCatalog` directory and its contents.
4. Commit and push the changes to your repository.

For more detailed instructions, see the [Create Your Own Repo](create-your-own-repo.md) guide.

## Next Steps

- Learn how to [prepare your template](prepare-template.md) using the `s-prepare-template` script.
- Understand how to [use your template](howToUse.md) with `s-update-manager`.
- Explore [CLI parameters](cli-parameters.md) for customizing the update process.
