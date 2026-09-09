# Installation

## Requirements

- Node.js 12 or higher

## Install as a global command (recommended)

```bash
npm install -g @tiny-codes/swagger-api-hub
```

The `swagger-api-hub` command is then available in any project:

```bash
swagger-api-hub --help
```

## Install as a project dependency

```bash
npm install -D @tiny-codes/swagger-api-hub
```

Use it via `npx`, or add it to your npm scripts:

```json
{
  "scripts": {
    "api": "swagger-api-hub"
  }
}
```

## Verify the installation

```bash
swagger-api-hub --version
```

If a version number is printed (e.g. `1.3.1`), the installation succeeded.
