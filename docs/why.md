# What?

The library is designed to maintain project configurations based on an external repository. You can maintain a single repository with a default configuration that will be propagated to all your projects. Each project is different, so you can always customize your base configuration.

# Why?

During my experience building many packages, maintaining consistent configurations was a challenge. Updating for many packages often led to conflicts with customized configurations. The library helps to find a balance between configuration consistency and customization.

# How?

The library fetches a remote repository and generates local source files based on the files in the repository. If necessary, you can configure the base template configuration for a project using one of the implemented strategies.

At the moment, there are 3 basic strategies implemented:

- **Defaule** - replaces the entire file with the content of the remote repository.
- **Extend** - extends the file with the content of the remote repository.
- **Custom** - allows overwriting the entire file.
