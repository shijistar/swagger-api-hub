# FAQ

## 1. "Config file not found" — what now?

The tool looks for `./swagger-api-hub.config.ts` by default. Check that:

- the config file really exists in the current working directory;
- the file name is spelled correctly (`swagger-api-hub.config.ts`);
- or pass the path explicitly: `swagger-api-hub ./configs/custom-config.ts`.

## 2. "config is invalid: id is required"?

Every service object must provide `id`:

```typescript
{ id: 'iam', url: 'https://...' }
```

## 3. "either url, input or spec is required"?

Provide at least one of `url`, `input`, `spec`:

```typescript
// Option 1: URL
{ id: 'iam', url: 'https://api.example.com/iam/swagger/v3' }

// Option 2: local file
{ id: 'iam', input: './specs/iam.swagger.json' }

// Option 3: spec object
{ id: 'iam', spec: { openapi: '3.0.0', paths: {} } }
```

## 4. Can I skip the interactive selection for multiple services?

Yes. Call `generate()` per service (module mode), or temporarily use a single-object config. The CLI prompt only appears when the config exports an array.

## 5. How do I make the generated code use my own request layer?

Set `httpClientFile` to your request module:

```typescript
{ id: 'iam', url: 'https://...', httpClientFile: '../request/swagger-request' }
```

The generated `api.ts` imports the http client from that path instead of the default `./http-client.ts`.

## 6. What TypeScript type does `int64` map to by default?

`bigint` (the default `dataTypeMappings` is `{ int64: 'bigint', object: 'Record<string, any>' }`). If your backend `int64` values are actually small, override it with `number`:

```typescript
{ id: 'iam', url: 'https://...', dataTypeMappings: { int64: 'number' } }
```

## 7. What controls the formatting of generated code?

Formatting is handled by Biome (since v1.3.0). To customize it, create a `biome.json` file in the project root.

## 8. Does the tool clean the output directory before generating?

Yes. `cleanOutput` defaults to `true` — the `output` directory is cleaned before each run to avoid stale files. Set it to `false` to keep them.

## 9. How do I see the help or version?

```bash
swagger-api-hub --help
swagger-api-hub --version
```

## 10. How do I debug generation errors?

- Make sure the spec endpoint is reachable (private endpoints need `authorizationToken`);
- Make sure the spec is a valid OpenAPI 2.0/3.0 document;
- Enable `debug: true` for debug output;
- Check the [swagger-typescript-api issues](https://github.com/acacode/swagger-typescript-api/issues) for known problems.
