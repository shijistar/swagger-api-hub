# Config Guide

The config file exports a `ServiceConfig` object or an array of them. `ServiceConfig` extends `GenerateApiParams` from `swagger-typescript-api` and adds the fields below.

## Basic fields

### `id` (required)

Unique id of the service. It also determines the default output directory `./src/api/{id}`.

```typescript
id: 'iam',
```

### `name`

Friendly name of the service, written into the header comment of generated files.

```typescript
name: 'User Management Service',
```

### `url` / `input` / `spec` (one of three required)

Spec source:

```typescript
// Option 1: fetch the spec from a URL
url: 'https://api.example.com/iam/swagger/v3',

// Option 2: read a local spec file
input: './specs/iam.swagger.json',

// Option 3: pass the spec object directly
spec: { openapi: '3.0.0', info: { title: 'IAM', version: '1.0' }, paths: {} },
```

### `authorizationToken`

Auth credential for private spec endpoints (e.g. `Basic xxx`, `Bearer xxx`).

```typescript
authorizationToken: 'Basic XXXXXXXXXXXXXXXXXX',
```

## Path & output

### `apiBase`

Base path of all API endpoints. When the service is hosted on a subpath of the main domain (e.g. `/public-api/iam/v3`), set `apiBase: '/public-api'` and generated request paths pick up the prefix automatically; omit it if the original spec paths are already correct.

```typescript
apiBase: '/public-api',
```

### `crossOrigin`

Whether to use absolute api paths when calling the service (for cross-domain setups with `Access-Control-Allow-Origin`). Default `false`.

```typescript
crossOrigin: true,
```

### `output`

Output directory for the generated code. Default `./src/api/{id}`.

```typescript
output: './src/api/iam',
```

### `httpClientFile`

Path of the default `http-client.ts` file. Point it to your own request module and the generated code imports it directly:

```typescript
httpClientFile: '../request/swagger-request',
```

### `createApiInstance`

Whether to auto-create an instance for each API class. Instances can only be created with an empty constructor; if some classes need different options, set it to `false` and create them manually. Default `true`.

```typescript
createApiInstance: false,
```

## Types & naming

### `dataTypeMappings`

Map of special data types to TypeScript types. Default `{ int64: 'bigint', object: 'Record<string, any>' }`.

```typescript
dataTypeMappings: {
  int64: 'number',
  object: 'Record<string, any>',
},
```

### `intTotalElements`

Whether to force `totalElements` in dataContracts to `number`(int32). Default `false`.

```typescript
intTotalElements: true,
```

### `addTagNameToRoute`

Whether to add the tag name to the route (method) name when `moduleNameFirstTag` is `true`. Default `false`.

```typescript
addTagNameToRoute: true,
```

## Full example

```typescript
import type { ServiceConfig } from '@tiny-codes/swagger-api-hub';

const services: ServiceConfig[] = [
  {
    id: 'iam',
    name: 'User Management Service',
    url: 'https://api.example.com/iam/swagger/v3',
    authorizationToken: 'Basic XXXXXXXXXXXXXXXXXX',
    apiBase: '/public-api',
    output: './src/api/iam',
    httpClientFile: '../request/swagger-request',
    intTotalElements: true,
    extractRequestBody: true,
    dataTypeMappings: { int64: 'bigint' },
  },
];
export default services;
```

> Options not listed here are inherited from [swagger-typescript-api#options](https://github.com/acacode/swagger-typescript-api?tab=readme-ov-file#-options) — see "Options".
