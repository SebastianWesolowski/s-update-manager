# Configuration File

The `s-update-manager` tool uses a configuration file to manage various settings and parameters. This document explains how to set up and use the configuration file effectively.

## Configuration File Location

By default, `s-update-manager` looks for a configuration file named `.sum.config.json` in the root directory of your project. You can also specify a custom location using the `--config` CLI parameter.

## File Format

The configuration file should be in JSON format. Here's an example of a basic configuration file:

```json
{
  "templateCatalogName": "templateCatalog",
  "sumCatalog": "./mock/mockProjectToBuild/.sum/",
  "sUpdaterVersion": "../../dist/s-update-manager-1.0.0-dev.27.tgz",
  "availableSUMSuffix": ["-default.md", "-custom.md", "-extend.md"],
  "availableSUMKeySuffix": ["defaultFile", "customFile", "extendFile"],
  "sumFileMapConfigFileName": "repositoryMap.json",
  "sumFileMapConfig": "./mock/mockProjectToBuild/.sum/repositoryMap.json",
  "projectCatalog": "./mock/mockProjectToBuild/",
  "temporaryFolder": "./mock/mockProjectToBuild/.sum/temporary/",
  "sumConfigFileName": ".sum.config.json",
  "sumConfigFilePath": "./mock/mockProjectToBuild/.sum.config.json",
  "remoteRootRepositoryUrl": "https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate",
  "remoteRepository": "https://github.com/SebastianWesolowski/s-update-manager/tree/dev/mock/mockTemplateToUpdate",
  "remoteFileMapURL": "https://raw.githubusercontent.com/SebastianWesolowski/s-update-manager/dev/mock/mockTemplateToUpdate/templateCatalog/repositoryMap.json",
  "isDebug": true,
  "_": []
}
```

## Hierarchy of Configuration Sources

s-update-manager uses a hierarchical approach to determine the final configuration:

1. Command-line arguments (highest priority)
2. Configuration file
3. Default values (lowest priority)

This means that values specified via CLI arguments will override those in the configuration file, which in turn override the default values.

## Using the Configuration File

To use the configuration file:

1. Config file will create automatically when you run `s-init` command.
2. You can change config file properties by yourself.
3. Run `s-update-manager` commands as usual. The tool will automatically read the configuration file.

## Overriding Configuration with CLI Arguments

You can override any configuration option using CLI arguments. For example:

```bash
s-update --remoteRepository="https://github.com/User/different-repo"
```

This command will use the specified remote repository, overriding any value set in the configuration file.
