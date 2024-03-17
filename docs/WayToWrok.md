# How work with branch

### release
send package to `main` branch

after release just install package.
`yarn add package-name` or install from public git repository `yarn add username/repo#folder/path`


### pre release
send package to `dev` branch~

You can install packages to test with one of the following commands 

`yarn add package-name@1.0.0-dev.1`
`yarn add package-name@next`


## check local preview package

just use `build:package` and look at the folder dist/package

## update via commit

Show differences between two commits
`git diff --name-only 66096206^..74f700b1`
 
or use tool/upload
