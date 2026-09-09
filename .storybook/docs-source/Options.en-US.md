# Options

`ServiceConfig` = `GenerateApiParams` (from `swagger-typescript-api`) + extension fields added by this project. The table below lists the common options by category.

## Extension fields

| Field               | Type                     | Default                                              | Description                                                                      |
| ------------------- | ------------------------ | ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| `id`                | `string`                 | —                                                    | **Required.** Unique service id, also determines the output dir `./src/api/{id}` |
| `name`              | `string`                 | —                                                    | Friendly service name, written into the header comment                           |
| `apiBase`           | `string`                 | —                                                    | Base path prefix of all API endpoints, e.g. `/public-api`                        |
| `crossOrigin`       | `boolean`                | `false`                                              | Whether to use absolute paths when calling the service                           |
| `singleHttpClient`  | `boolean`                | `true` (forced)                                      | This field is overridden — do not use it                                         |
| `httpClientFile`    | `string`                 | `./http-client.ts`                                   | Custom path of the generated `http-client.ts`                                    |
| `createApiInstance` | `boolean`                | `true`                                               | Auto-create an instance for each API class                                       |
| `intTotalElements`  | `boolean`                | `false`                                              | Force `totalElements` to `number`(int32)                                         |
| `addTagNameToRoute` | `boolean`                | `false`                                              | Add the tag name to route names (needs `moduleNameFirstTag`)                     |
| `dataTypeMappings`  | `Record<string, string>` | `{ int64: 'bigint', object: 'Record<string, any>' }` | Map of special data types to TS types                                            |

## Spec source (one of three)

| Field   | Type     | Description            |
| ------- | -------- | ---------------------- |
| `url`   | `string` | Spec endpoint          |
| `input` | `string` | Local spec file path   |
| `spec`  | `object` | The spec object itself |

## Generation behavior

| Field                  | Default              | Description                                                     |
| ---------------------- | -------------------- | --------------------------------------------------------------- |
| `modular`              | `true` (built-in)    | Split routes into per-tag module files                          |
| `httpClientType`       | `'axios'` (built-in) | Generated http client type (`axios` / `fetch`)                  |
| `templates`            | built-in templates   | Custom templates directory                                      |
| `output`               | `./src/api/{id}`     | Output directory; `false` returns file contents without writing |
| `fileName`             | `'Api.ts'`           | File name of the generated API module                           |
| `generateRouteTypes`   | `true` (built-in)    | Generate route type definitions                                 |
| `generateClient`       | —                    | Generate the API client                                         |
| `generateUnionEnums`   | `true` (built-in)    | Generate enums as union types                                   |
| `extractEnums`         | `true` (built-in)    | Extract nested enums as TS enums                                |
| `extractRequestParams` | `true` (built-in)    | Extract request params as data contracts                        |
| `extractRequestBody`   | `true` (built-in)    | Extract request body types as data contracts                    |
| `extractResponseBody`  | `true` (built-in)    | Extract response body types as data contracts                   |
| `extractResponseError` | —                    | Extract response error types                                    |
| `extractResponses`     | —                    | Extract response types                                          |
| `moduleNameFirstTag`   | `true` (built-in)    | Use the first tag as the module name                            |
| `sortRoutes`           | `true` (built-in)    | Sort routes alphabetically                                      |
| `sortTypes`            | —                    | Sort data contracts alphabetically                              |
| `patch`                | `true` (built-in)    | Fix small errors in the spec                                    |
| `cleanOutput`          | `true` (built-in)    | Clean the output directory before generating                    |
| `unwrapResponseData`   | —                    | Unwrap the data item from the response                          |
| `anotherArrayType`     | —                    | Generate array types as `Array<Type>`                           |
| `addReadonly`          | —                    | Generate readonly properties                                    |
| `toJS`                 | —                    | Generate a JS module + declaration file                         |
| `disableThrowOnError`  | —                    | Don't throw on non-successful responses                         |
| `silent`               | `false`              | Output only errors                                              |
| `debug`                | —                    | Output debug messages                                           |

## Naming & types

| Field                             | Default   | Description                                         |
| --------------------------------- | --------- | --------------------------------------------------- |
| `typePrefix` / `typeSuffix`       | —         | Prefix/suffix for type names                        |
| `enumKeyPrefix` / `enumKeySuffix` | —         | Prefix/suffix for enum keys                         |
| `enumNamesAsValues`               | —         | Use enum names as values                            |
| `primitiveTypeConstructs`         | —         | Custom primitive type mappings (function or object) |
| `codeGenConstructs`               | —         | Custom code generation constructs                   |
| `defaultResponseType`             | `'void'`  | Default type for empty response schemas             |
| `fixInvalidTypeNamePrefix`        | `'Type'`  | Prefix to fix invalid type names                    |
| `fixInvalidEnumKeyPrefix`         | `'Value'` | Prefix to fix invalid enum keys                     |
| `hooks`                           | —         | Generation hooks (e.g. `onFormatRouteName`)         |

> See [swagger-typescript-api#options](https://github.com/acacode/swagger-typescript-api?tab=readme-ov-file#-options) for the full option list.
