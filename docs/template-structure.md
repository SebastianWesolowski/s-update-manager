# Template structure

Example repository structure

Assumptions:

- project name on github: your-project-name
- username on github: User
- template name: node

```
your-project-name
└── node
    ├── .gitignore
    ├── package.json
    ├── README.md
    ├── tsconfig.json
    ...
    └── templateCatalog - this is a directory created with `s-prepare-template` script
        ├── .gitignore-default.md
        ├── package.json-default.md
        ├── README.md-default.md
        ├── tsconfig.json-default.md
        ├── yarn.lock-default.md
        ├── repositoryMap.json
        └── tools
            ├── test.sh-default.md
            └── test-new.sh-default.md
```

for that example you can provide remote repository with following command:

`--remoteRepository='https://github.com/User/your-project-name/tree/dev/node/templateCatalog'`
