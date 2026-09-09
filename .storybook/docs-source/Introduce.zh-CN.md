# swagger-api-hub

**swagger-api-hub** 是一个为 OpenAPI（Swagger）后端服务一键生成前端访问代码的命令行工具。它根据 OpenAPI 规范生成 TypeScript 的 API 客户端与请求方法代码，既可以作为命令行工具使用，也可以作为 Node.js 模块集成到构建流程中。同时支持 OpenAPI 2.0 与 3.0 规范。

本工具是 [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api) 的上层封装：它内置了经过调优的模板与默认配置，让「拉取规范 → 生成代码」变成一条命令。

## 解决的问题

- **手工维护 API 层代码**：接口变更后，人工同步类型定义和请求方法既耗时又容易出错。
- **跨服务一致生成**：多个后端服务使用同一套模板和命名规则，生成风格统一。
- **模块化输出**：按 Swagger tag 拆分模块文件，每个服务生成 `api.ts`、`data-contracts.ts`、`http-client.ts`、`route-types.ts` 等文件。

## 核心能力

- 支持 OpenAPI 2.0 与 3.0 规范
- 支持从 URL、本地文件（`input`）或规范对象（`spec`）获取接口定义
- 支持需要认证的规范地址（`authorizationToken`）
- 按 tag 模块化生成，路由排序、枚举提取、请求/响应体提取等开箱即用
- 可定制数据类型映射（如 `int64` → `bigint`）
- 可替换默认 http client，接入你自己的请求层
- CLI 与 Node.js 模块两种使用方式

## 工作流程

1. 编写 `swagger-api-hub.config.ts` 配置文件（单个服务对象或数组）
2. 运行 `swagger-api-hub` 命令
3. 工具读取配置、拉取规范、按模板生成代码到 `output` 目录
4. 在业务代码中直接 `import` 生成的 API 类并调用
