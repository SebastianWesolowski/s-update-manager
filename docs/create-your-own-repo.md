# Create Your Own Repository

The `s-update-manager` package provides features for adding your own template repository. Here's how to create and use your own repository:

## Steps to Create Your Own Repository

1. Create a new repository on GitHub for your template.
2. Install `s-update-manager` in your local project.
3. Use the [`s-prepare-template`](prepare-template.md) script to create the template structure. This will generate the necessary files and folders as described in the [template structure](template-structure.md) documentation.
4. Update your GitHub repository with the generated template structure.
5. Provide the remote repository URL to the `s-update-manager` script as the `-remoteRepository` parameter.

## Example

Let's say you've created a repository named "my-custom-template" under your GitHub username "YourUsername". After preparing the template structure, your repository URL would look like this:

```
https://github.com/YourUsername/my-custom-template/tree/main/templateCatalog
```

You would then use this URL in your `package.json` scripts:

```json
"scripts": {
  "update": "s-update --remoteRepository='https://github.com/YourUsername/my-custom-template/tree/main/templateCatalog'",
  "build": "s-build --remoteRepository='https://github.com/YourUsername/my-custom-template/tree/main/templateCatalog'",
  "init": "s-init --remoteRepository='https://github.com/YourUsername/my-custom-template/tree/main/templateCatalog'"
}
```

## Next Steps

After creating your custom template repository:

1. Use the `init` script to initialize your project with the template.
2. Use the `build` script to rebuild your project after making changes to the configuration files.
3. Use the `update` script to update your project when you've made changes to the template repository.

For more information on using these scripts, see the [How to Use](howToUse.md) guide.

For details on available CLI parameters, refer to the [CLI Parameters](cli-parameters.md) documentation.
