# CLI Parameters

The `s-update-manager` supports several command-line parameters to customize its behavior. Here's a list of available parameters:

- `-remoteRepository`: URL of the remote repository containing the template
- `-template`: Name of the template to use
- `-project`: Path to the project directory
- `-sumConfig`: Path to the configuration file
- `-isDebug`: Enable debug mode (true/false)
- `-sumCatalog`: Path to the configuration catalog
- `-projectCatalog`: Path to the project catalog
- `-sumConfigFileName`: Name of the configuration file

## Example Usage

Here's an example of how to use these CLI parameters:

```bash
s-update-manager \
  -sumConfig='./.sum' \
  -template='node' \
  -project='./mock/mockProject' \
  -remoteRepository='https://github.com/SebastianWesolowski/s-template/tree/main/templates/node' \
  -isDebug=true
```

## Integration with package.json

You can add these parameters to your `package.json` scripts for easy access:

```json
"scripts": {
  "update": "s-update --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'",
  "build": "s-build --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'",
  "init": "s-init --remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'"
}
```

For more information on how to set up these scripts, see the [Installation Guide](instalations.md).

To understand how these parameters affect the update process, refer to the [How to Use](howToUse.md) documentation.
