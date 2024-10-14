# How to use

After installation and project initialization

You have 2 options:

1. Develop your base configuration and update the project using the script `"update": "s-update ... "`
2. Use remote configuration and customize it for special project needs using the file structure [adjust-configuration](adjust-configuration.md). You can rebuild the files using the script `"build": "s-build ... "`

## Usage

use s-init script in your package json file

```bash
"init": "s-init --sumConfig ./.sum --template node --project ./ --remoteRepository https://raw.githubusercontent.com/SebastianWesolowski/testTemplate/main/template/"
```
