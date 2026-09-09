# 常见问题（FAQ）

## 1. 提示「Config file not found」怎么办？

默认查找 `./swagger-api-hub.config.ts`。请确认：

- 配置文件确实位于当前工作目录；
- 文件名拼写正确（`swagger-api-hub.config.ts`）；
- 或者显式传入路径：`swagger-api-hub ./configs/custom-config.ts`。

## 2. 提示「config is invalid: id is required」？

每个服务对象必须提供 `id` 字段：

```typescript
{ id: 'iam', url: 'https://...' }
```

## 3. 提示「either url, input or spec is required」？

`url`、`input`、`spec` 三者至少提供一个：

```typescript
// 方式 1：URL
{ id: 'iam', url: 'https://api.example.com/iam/swagger/v3' }

// 方式 2：本地文件
{ id: 'iam', input: './specs/iam.swagger.json' }

// 方式 3：规范对象
{ id: 'iam', spec: { openapi: '3.0.0', paths: {} } }
```

## 4. 多个服务每次都要手动选择，能否跳过？

可以。为每个服务单独调用 `generate()`（模块方式），或把要生成的服务临时提取为单对象配置。CLI 的交互选择只在配置导出数组时出现。

## 5. 如何让生成的代码使用我自己的请求层？

设置 `httpClientFile` 指向你的请求模块：

```typescript
{ id: 'iam', url: 'https://...', httpClientFile: '../request/swagger-request' }
```

生成的 `api.ts` 会从该路径导入 http client，而不是默认的 `./http-client.ts`。

## 6. `int64` 默认映射成什么类型？

`bigint`（`dataTypeMappings` 默认值 `{ int64: 'bigint', object: 'Record<string, any>' }`）。如果你的后端 `int64` 实际是小数值，可覆盖为 `number`：

```typescript
{ id: 'iam', url: 'https://...', dataTypeMappings: { int64: 'number' } }
```

## 7. 生成的代码格式由什么控制？

代码格式化由 Biome 负责（v1.3.0 起）。如需自定义，在项目根目录创建 `biome.json` 配置文件。

## 8. 生成前会自动清空输出目录吗？

会。`cleanOutput` 默认 `true`，每次生成前清空 `output` 目录，避免残留旧文件。若需保留，可设为 `false`。

## 9. 如何只看帮助或版本号？

```bash
swagger-api-hub --help
swagger-api-hub --version
```

## 10. 出现生成错误时如何排查？

- 确认规范地址可访问（私有地址需 `authorizationToken`）；
- 确认规范是合法的 OpenAPI 2.0/3.0 文档；
- 开启 `debug: true` 输出调试信息；
- 查看 `swagger-typescript-api` 的[问题列表](https://github.com/acacode/swagger-typescript-api/issues)确认是否已知问题。
