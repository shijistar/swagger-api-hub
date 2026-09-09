# Use as an npm module

Besides the CLI, swagger-api-hub can be used as a Node.js module inside your build pipeline (CI, build scripts, etc.).

## Import

```typescript
import { generate, promptToGenerate } from '@tiny-codes/swagger-api-hub';
import type { ServiceConfig } from '@tiny-codes/swagger-api-hub';
import serviceConfigs from './swagger-api-hub.config';
```

## `generate(config)`

Generate code for a single service directly, with no prompts:

```typescript
// Usage 1: generate a single service directly
generate(serviceConfigs[0]);
```

## `promptToGenerate(configs)`

Shows an interactive selection prompt when multiple services are passed:

```typescript
// Usage 2: multiple services with prompts
promptToGenerate(serviceConfigs);
```

## Return value

Both functions return the `generateApi` result, which contains the generated file information — useful for post-processing (uploads, notifications, or writing to non-default locations).

## Use in CI

```typescript
// ci/generate-api.ts
import { generate } from '@tiny-codes/swagger-api-hub';
import serviceConfigs from '../swagger-api-hub.config';

async function main() {
  for (const config of serviceConfigs) {
    await generate(config);
    console.log(`generated: ${config.id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

> Note: the module entry is the compiled `cli` output (`lib/`), exporting `generate`, `promptToGenerate` and types such as `ServiceConfig`.
