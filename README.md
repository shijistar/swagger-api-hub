# @tiny-codes/swagger-api-hub

[![npm version](https://img.shields.io/npm/v/@tiny-codes/swagger-api-hub.svg)](https://www.npmjs.com/package/@tiny-codes/swagger-api-hub)
[![npm downloads](https://img.shields.io/npm/dm/%40tiny-codes%2Fswagger-api-hub.svg)](https://www.npmjs.com/package/@tiny-codes/swagger-api-hub)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/shijistar/swagger-api-hub)
![GitHub License](https://img.shields.io/github/license/shijistar/swagger-api-hub?label=License&color=%23F68F1E)

![cover image](cover.webp)

Produce front-end interface code for OpenAPI-based backend services with a single click. This tool is designed to generate TypeScript code for API clients and request methods from OpenAPI specifications. It can be used as a command line tool or as a Node.js module that is integrated into your build process. It supports both OpenAPI 2.0 and 3.0 specifications.

This tool is a wrapper of the [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api)

## Installation

**Install as a global command:**

```bash
npm install -g @tiny-codes/swagger-api-hub
```

**Install as a project-wide dependency:**

```bash
npm install -D @tiny-codes/swagger-api-hub
```

## Usage

### Use as a global command

It reads the default configuration file `./swagger-api-hub.config.ts`, you can also specify a custom configuration file.

```bash
$ swagger-api-hub  # read default config file
$ swagger-api-hub ./configs/custom-config.ts  # specify a custom config file
```

The configuration file should export an array of `ServiceConfig` objects. If you export only one object, it will generate the code directly without prompting.

The config file can be either local path or npm module path, and the file extension can be `.ts`, `.js`, `.json`, or any other module types supported by Node.js.

The file should look like this:

_swagger-api-hub.config.ts_

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
  {
    id: 'asset',
    name: 'Asset Management Service',
    url: 'https://api.example.com/public-api/asset/swagger/v3',
    authorizationToken: 'Basic XXXXXXXXXXXXXXXXXX',
    apiBase: '/public-api',
    output: './src/api/asset',
  },
];
export default services;
```

The `ServiceConfig` object has the following fields:

- **`id`**: _[required]_ A unique identifier for the service.
- **`name`**: A human-readable name for the service.
- **`url`**: _[required]_ The URL of the OpenAPI specification file. If you have a local file, you can use `input` instead of `url` to specify the file path. Or you can even use `spec` to provide the OpenAPI specification object directly. Either url, input, or spec is required.
- **`apiBase`**: The base path of all API endpoints. The service may be hosted on a subpath of the main domain, e.g., `/public-api/iam/v3`, then the apiBase is `/public-api` in this case. If the original api path from the OpenAPI specification is acceptable, you don't need this field.
- **`crossOrigin`**: Whether to use the absolute api path when calling the service. This is useful when the service is hosted on a different domain and you need to set the `Access-Control-Allow-Origin` header. Default is `false`.
- **`dataTypeMappings`**: A map of some special data types to TypeScript types. Default is `{ int64: 'BigInt', object: 'Record<string, any>' }`.
- **`output`**: The output directory for the generated code. Default is `./src/api/{id}`.
- **`httpClientFile`**: Change the default path of `http-client.ts` file, so you can use your own http client. Default is `./http-client` of each service directory.
- **`createApiInstance`**: Whether to create an instance of each API class. The instance can only be created with an empty constructor, if you want to set different options for some api classes, you can set this to `false` and create the instance manually. Default is `true`.
- **`intTotalElements`**: Whether to force convert `totalElements` in dataContracts to `number`(int32) type. Default is `false`.

For more options, please refer to the [swagger-typescript-api#options](https://github.com/acacode/swagger-typescript-api?tab=readme-ov-file#-options) documentation.

### Use as a npm dependency

```typescript
import { generate, promptToGenerate } from '@tiny-codes/swagger-api-hub';
import type { ServiceConfig } from '@tiny-codes/swagger-api-hub';
import serviceConfigs from './swagger-api-hub.config';

// Usage1: generate multiple services with prompts
promptToGenerate(serviceConfigs);

// Usage2: generate a single service directly
generate(serviceConfigs[0]);
```
