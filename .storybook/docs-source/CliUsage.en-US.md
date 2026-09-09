# CLI Usage

## Command syntax

```bash
swagger-api-hub [options] [config-path]
```

- **`config-path`**: path to the config file, default `./swagger-api-hub.config.ts`.
- **`-v, --version`**: print the version number.
- **`-h, --help`**: show help.

## Use the default config file

```bash
swagger-api-hub
```

The tool resolves the config path with `require.resolve`, so you can pass a local relative/absolute path or an npm module name (the config is exported from the package). The file extension can be `.ts`, `.js`, `.json` or any other module type supported by Node.js.

## Specify a custom config file

```bash
swagger-api-hub ./configs/custom-config.ts
```

## Interactive selection

When the config file exports an **array** (multiple services), an interactive list appears — use arrow keys and space to select which services to generate:

```text
? Choose which services to generate (Press <space> to select, <a> to toggle all, <i> to invert)
❯ ◯ iam
  ◯ asset
```

When the config exports a **single object**, generation starts directly with no prompt.

## Config validation

Each service config is validated on startup:

- `id` is required;
- at least one of `url`, `input`, `spec` must be provided.

Validation failures exit with a red error explaining the cause:

```text
✖ [asset] config is invalid: either url, input or spec is required
```

## Success output

After generation, a success message with the output directory is printed (unless `silent` is `true`):

```text
✔ Code is generated to  /path/to/src/api/iam
```
