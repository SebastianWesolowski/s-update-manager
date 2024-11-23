# Ignore File

The ignore file is a text file similar to `.gitignore` that contains a list of files and directories that should be ignored by the update manager.

These files and directories will be ignored during both the [Updating](howToUse.md#updating) and [Building](howToUse.md#building) processes.

The ignore file is located in the root of the project, named `.sumignore`, and works similarly to `.gitignore`.

## Example

```
tools/
```

This means that the `tools` directory will be ignored during both the update and build processes. The contents of this directory will not be used to build files during updates. However, the system will still create the corresponding `-default.md` file for documentation purposes.

## Use case

For example, if you use the nstartetNpmPackage package template [nodeTemplate](https://github.com/SebastianWesolowski/s-template/tree/main/templates/startetNpmPackage/node), it includes a `tools` directory in the root containing a `customize.sh` script. This script is only needed during initial setup and can be ignored after the repository is fully configured. Adding `tools/` to your `.sumignore` file ensures this directory is excluded from future updates.
