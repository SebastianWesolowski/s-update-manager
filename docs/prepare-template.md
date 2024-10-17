# Prepare Template

The `s-prepare-template` script is designed to create a template structure for use with `s-update-manager`.

## How to Create a Template

1. Create a new repository and install `s-update-manager`.
2. You can see an example of a repository with templates at [s-template](https://github.com/SebastianWesolowski/s-template).
3. Use the `s-prepare-template` script to create the template structure. For more details on the structure, see [Template Structure](template-structure.md).
4. Update your repository on GitHub with the generated template structure.
5. Provide the remote repository URL to the `s-update-manager` script as the `-remoteRepository` parameter.

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
