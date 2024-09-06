# Core Tasks

- [ ] Exclude files when using s-prepare-template
- [ ] Write tests for main scripts
- [ ] Translate everything to English
- [ ] Write instructions
- [ ] Describe the order of applying settings arg/local file
- [ ] Remove snp keyword
- [ ] Perform tests for large repos
- [ ] Prepare example repo/script/etc
- [ ] Describe all TODOs
- [ ] Test downloadConfig ? "rootPathFileList": [ -> "./.gitignore.md", ...]

# Beyond MVP

- [ ] Export const cleanUpFiles - snpCatalog - make it reusable
- [ ] cookie: can't load punycode; won't use punycode for domain normalisation
- [ ] Checkout RepositoryMapFileConfigType type is very similar to FileMapConfig
- [ ] Why are arguments and config not linked in types?
- [ ] dryRun flag
- [ ] config.temporaryFolder is necessary
- [ ] Handle updates when new version is in template file, will cleanTree work?
- [ ] Delay in downloading by wgetAsync, some cache etc
- [ ] Add gitignore \*-... !-custom, extend ...generated things shouldn't be in repo
- [ ] Order key in configs is different
- [ ] Improve updateDefaultConfig and add more single cases

# Completed Tasks

- [x] Clean repo of unnecessary things
- [x] Missing addition of custom and ext etc to createdFileMap in new version
- [x] Incorrectly generated SNPSuffixFileName for extend and custom in config
- [x] Extend is generated excessively
- [x] Custom is generated excessively
- [x] Real files are devoid of original paths, everything is generated in roots
- [x] Instruction is unnecessary
- [x] Files are generated to the main directory
- [x] Change structure of file retrieval and use to specific directory
- [x] Fix url to repo
- [x] Difference between remoteRepository and repositoryUrl in config ? to be clarified
- [x] Change repo url from arg to root repo directory
