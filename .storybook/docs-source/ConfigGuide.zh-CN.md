# 配置指南

配置文件导出 `ServiceConfig` 对象或对象数组。`ServiceConfig` 继承自 `swagger-typescript-api` 的 `GenerateApiParams`，并扩展了以下字段。

## 基础字段

### `id`（必填）

服务的唯一标识。默认同时决定输出目录 `./src/api/{id}`。

```typescript
id: 'iam',
```

### `name`

服务的友好名称，会写入生成文件的头部注释。

```typescript
name: 'User Management Service',
```

### `url` / `input` / `spec`（必填三选一）

规范来源：

```typescript
// 方式 1：从 URL 拉取规范
url: 'https://api.example.com/iam/swagger/v3',

// 方式 2：读取本地规范文件
input: './specs/iam.swagger.json',

// 方式 3：直接传入规范对象
spec: { openapi: '3.0.0', info: { title: 'IAM', version: '1.0' }, paths: {} },
```

### `authorizationToken`

私有规范地址的认证凭证（如 `Basic xxx`、`Bearer xxx`）。

```typescript
authorizationToken: 'Basic XXXXXXXXXXXXXXXXXX',
```

## 路径与输出

### `apiBase`

服务 API 的基础路径。当服务托管在主域的子路径下（如 `/public-api/iam/v3`），设置 `apiBase: '/public-api'` 后，生成的请求路径会自动带上该前缀；如果规范中的原始路径已经正确，则无需设置。

```typescript
apiBase: '/public-api',
```

### `crossOrigin`

跨域部署时，是否在请求中使用绝对路径（配合服务端 `Access-Control-Allow-Origin`）。默认 `false`。

```typescript
crossOrigin: true,
```

### `output`

生成代码的输出目录。默认 `./src/api/{id}`。

```typescript
output: './src/api/iam',
```

### `httpClientFile`

默认生成 `http-client.ts` 的路径。指向你自己的请求模块后，生成的代码会直接引用它：

```typescript
httpClientFile: '../request/swagger-request',
```

### `createApiInstance`

是否为每个 API 类自动创建实例。实例只能以空构造器创建；如果某些 API 类需要不同配置，设为 `false` 手动创建。默认 `true`。

```typescript
createApiInstance: false,
```

## 类型与命名

### `dataTypeMappings`

特殊数据类型到 TypeScript 类型的映射。默认 `{ int64: 'bigint', object: 'Record<string, any>' }`。

```typescript
dataTypeMappings: {
  int64: 'number',
  object: 'Record<string, any>',
},
```

### `intTotalElements`

是否将 dataContracts 中的 `totalElements` 强制转为 `number`(int32) 类型。默认 `false`。

```typescript
intTotalElements: true,
```

### `addTagNameToRoute`

当 `moduleNameFirstTag` 为 `true` 时，是否把 tag 名加入路由名（即方法名）。默认 `false`。

```typescript
addTagNameToRoute: true,
```

## 完整示例

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

> 其余未列出的选项继承自 [swagger-typescript-api#options](https://github.com/acacode/swagger-typescript-api?tab=readme-ov-file#-options)，详见「完整配置项」。
