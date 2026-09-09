# Get Started

## Step 1: Write the config file

Create `swagger-api-hub.config.ts` in your project root:

```typescript
import type { ServiceConfig } from '@tiny-codes/swagger-api-hub';

const services: ServiceConfig[] = [
  {
    id: 'iam',
    name: 'User Management Service',
    url: 'https://api.example.com/iam/swagger/v3',
    authorizationToken: 'Basic XXXXXXXXXXXXXXXXXX',
    output: './src/api/iam',
  },
];
export default services;
```

Field notes:

- **`id`** (required): unique id of the service, also used for the default output directory `./src/api/{id}`.
- **`name`**: friendly name of the service, written into the header comment of generated files.
- **`url` / `input` / `spec`** (one of three required): `url` is the spec endpoint, `input` is a local spec file path, `spec` is the spec object itself.
- **`authorizationToken`**: auth credential for private spec endpoints.
- **`output`**: output directory, default `./src/api/{id}`.

## Step 2: Run the command

```bash
swagger-api-hub
```

The tool reads `./swagger-api-hub.config.ts`. Since the config exports an array, you will see an interactive list — select the services to generate and press Enter.

If the config exports a single object, generation starts directly without any prompt:

```typescript
const service: ServiceConfig = {
  id: 'iam',
  url: 'https://api.example.com/iam/swagger/v3',
};
export default service;
```

## Step 3: Inspect the generated output

After a successful run, the `output` directory contains modular files:

```
src/api/iam/
├── Iam.ts          # API class (route methods, modularized by tag)
├── data-contracts.ts
├── http-client.ts
├── route-types.ts
└── ...
```

Use them directly in your business code:

```typescript
import { Iam } from '@/api/iam/Iam';

const iam = new Iam();
const users = await iam.getUsers();
```

> Tip: the generated `http-client.ts` is axios-based by default. If your project has a unified request layer, replace it via `httpClientFile` — see "Config Guide".
