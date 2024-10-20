# Adjust configuration and prefix files

`s-update-manager` manages file generation based on 3 types of files:

1. -default.md
2. -extend.md
3. -custom.md

**-default.md**

The -default.md file contains default values retrieved from the template.

**-extend.md**

The -extend.md file will extend the final file during generation.

**-custom.md**

The -custom.md file will overwrite the entire content of the file.

## Example

### -default.md

```
└── project
    └── readme.md-default.md
```

> `readme.md-default.md`

```
# Lorem ipsum
dolor sit amet, consectetur adipiscing elit.
```

> plik wynikowy: `readme.md`

```
#Lorem ipsum
dolor sit amet, consectetur adipiscing elit.
```

--

### -default.md + -extend.md

```
└── project
    ├── readme.md-default.md
    └── readme.md-extend.md
```

> `readme.md-default.md`

```
# Lorem ipsum
dolor sit amet, consectetur adipiscing elit.
```

> `readme.md-extend.md`

```
# Next Part
dolor sit amet, consectetur adipiscing elit.
```

> plik wynikowy: `readme.md`

```
# Lorem ipsum
dolor sit amet, consectetur adipiscing elit.
# Next Part
dolor sit amet, consectetur adipiscing elit.
```

---

### -default.md + -custom.md

```
└── project
    ├── readme.md-default.md
    └── readme.md-custom.md
```

> `readme.md-default.md`

```
# Lorem ipsum
dolor sit amet, consectetur adipiscing elit.
```

> `readme.md-custom.md`

```
# Custom Title
```

> plik wynikowy: `readme.md`

```
# Custom Title
```

---

### -default.md + -extend.md + -custom.md

```
└── project
    ├── readme.md-default.md
    ├── readme.md-extend.md
    └── readme.md-custom.md
```

> `readme.md-default.md`

```
# Lorem ipsum
dolor sit amet, consectetur adipiscing elit.
```

> `readme.md-extend.md`

```
# Next Part
dolor sit amet, consectetur adipiscing elit.
```

> plik wynikowy: `readme.md`

```
# Lorem ipsum
dolor sit amet, consectetur adipiscing elit.
# Next Part
dolor sit amet, consectetur adipiscing elit.
```

> `readme.md-custom.md`

```
# Custom Title
```

> plik wynikowy: `readme.md`

```
# Custom Title
```
