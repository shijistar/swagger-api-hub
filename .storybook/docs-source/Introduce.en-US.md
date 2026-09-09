# swagger-api-hub

**swagger-api-hub** is a command-line tool that generates front-end access code for OpenAPI (Swagger) backend services with a single click. It generates TypeScript API clients and request methods from OpenAPI specifications, and can be used as a CLI tool or as a Node.js module integrated into your build process. It supports both OpenAPI 2.0 and 3.0 specifications.

This tool is a wrapper around [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api): it ships tuned templates and sensible defaults, so "fetch spec → generate code" becomes a single command.

## Problems it solves

- **Manually maintained API layer**: syncing type definitions and request methods by hand after API changes is slow and error-prone.
- **Consistent generation across services**: multiple backend services share one template and naming convention, producing a uniform style.
- **Modular output**: routes are split into per-tag module files — each service gets `api.ts`, `data-contracts.ts`, `http-client.ts`, `route-types.ts` and more.

## Core features

- Supports OpenAPI 2.0 and 3.0 specifications
- Sources the spec from a URL, a local file (`input`) or a spec object (`spec`)
- Supports authenticated spec endpoints (`authorizationToken`)
- Modular generation per tag, with route sorting, enum extraction and request/response body extraction out of the box
- Customizable data type mappings (e.g. `int64` → `bigint`)
- Swappable default http client — plug in your own request layer
- Both CLI and Node.js module usage

## Workflow

1. Write a `swagger-api-hub.config.ts` config file (a single service object or an array)
2. Run the `swagger-api-hub` command
3. The tool reads the config, fetches the spec, and generates code into the `output` directory
4. Import the generated API classes directly in your business code
