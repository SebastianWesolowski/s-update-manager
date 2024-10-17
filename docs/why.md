# What?

The `s-update-manager` library is designed to maintain project configurations based on an external repository. You can maintain a single repository with a default configuration that will be propagated to all your projects. Each project is different, so you can always customize your base configuration.

# Why s-update-manager?

## What is it?

s-update-manager is a library designed to maintain project configurations based on an external repository. It allows you to maintain a single repository with a default configuration that can be propagated to all your projects, while still allowing for customization of individual projects.

## Why use it?

During my experience building many packages, maintaining consistent configurations across projects was a challenge. Updating configurations for multiple packages often led to conflicts with customized settings. s-update-manager helps find a balance between configuration consistency and customization.

## How does it work?

The library fetches a remote repository and generates local source files based on the files in that repository. You can configure the base template configuration for a project using one of three implemented strategies:

1. **Default** - replaces the entire file with the content from the remote repository.
2. **Extend** - extends the file with the content from the remote repository.
3. **Custom** - allows overwriting the entire file with custom content.

For more information on how to use these strategies, see [Adjust Configuration](adjust-configuration.md).

## Getting Started

To get started with s-update-manager:

1. Check out the [Installation Guide](instalations.md) to set up the tool in your project.
2. Read the [How to Use](howToUse.md) documentation to understand the basic workflow.
3. If you want to create your own template repository, follow the guide on [Creating Your Own Repo](create-your-own-repo.md).
4. For a list of available CLI parameters, refer to the [CLI Parameters](cli-parameters.md) documentation.

By using s-update-manager, you can streamline your project configuration management, saving time and reducing errors across multiple projects.
