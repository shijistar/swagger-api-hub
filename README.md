# swagger-api-hub

Produce front-end interface code for OpenAPI-based backend services with a single click. This tool is designed to generate TypeScript code for API clients and request methods from OpenAPI specifications. It can be used as a command line tool or as a Node.js module which is integrated into your build process. It supports both OpenAPI 2.0 and 3.0 specifications.

This tool is a wrapper of the [swagger-typescript-api
](https://github.com/acacode/swagger-typescript-api).

## Installation

**Install as global command line tool:**

```bash
$ npm install -g swagger-api-hub
```

**Install as project-wide dependency:**

```bash
$ npm install -D swagger-api-hub
```

## Usage

#### Use as global command line tool:

It reads the default configuration file `./swagger-api-hub.config.ts`, you can also specify a custom configuration file.

```bash
$ swagger-api-hub
$ swagger-api-hub config/services.ts
```

The configuration file should export an array of `ServiceConfig` objects. If you export only one object, it will generate the code directly without prompting.

The config file can be either local path or npm module path, and the file extension can be `.ts`, `.js`, `.json`, or any other module types supported by Node.js.

The file should look like this:

_swagger-api-hub.config.ts_

```typescript
import type { ServiceConfig } from 'swagger-api-hub';

const services: ServiceConfig[] = [
  {
    id: 'iam',
    name: 'User Management Service',
    url: 'https://api.example.com/iam/swagger/v3',
    output: './src/api/iam',
  },
  {
    id: 'asset',
    name: 'Asset Management Service',
    url: 'https://api.example.com/public-api/asset/swagger/v3',
    apiBase: '/public-api',
    output: './src/api/asset',
  },
];
export default services;
```

The `ServiceConfig` object has the following properties:

- `id`: _[required]_ A unique identifier for the service.
- `name`: A human-readable name for the service.
- `url`: _[required]_ The URL of the OpenAPI specification file. If you have a local file, you can use `input` instead of `url` to specify the file path. Or you can even use `spec` to provide the OpenAPI specification object directly. Either url, input, or spec is required.
- `apiBase`: The base path of all API endpoints. The service may be hosted on a subpath of the main domain, e.g., _/public-api/iam/v3_, then the apiBase is _/public-api_ in this case. If the original api path from the OpenAPI specification is acceptable, you don't need this field.
- `crossOrigin`: Whether to use the absolute api path when calling the service. This is useful when the service is hosted on a different domain and you need to set the `Access-Control-Allow-Origin` header. Default is `false`.
- `output`: The output directory for the generated code. The default is `./src/api/{id}`.
- `httpClientFile`: Change the default path of `http-client.ts` file, so you can use your own http client. The default is `./http-client` under each service directory.
- `createApiInstance`: Whether to create an instance of each API class. The instance can only be created with an empty constructor, if you want to set different options for some api classes, you can set this to `false` and create the instance manually. Default is `true`.
- For more options, please refer to the [swagger-typescript-api#options](https://github.com/acacode/swagger-typescript-api?tab=readme-ov-file#-options) documentation.

#### Use as npm dependency:

```typescript
import { generate, promptToGenerate } from 'swagger-api-hub';
import type { ServiceConfig } from 'swagger-api-hub';
import services from './swagger-api-hub.config';

// Way1: Generate multiple services with prompts
promptToGenerate(services);

// Way2: Generate a single service directly
generate(services[0]);
```
