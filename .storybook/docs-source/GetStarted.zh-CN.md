# 快速开始

## 第 1 步：编写配置文件

在项目根目录创建 `swagger-api-hub.config.ts`：

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

字段说明：

- **`id`**（必填）：服务的唯一标识，默认也用于输出目录 `./src/api/{id}`。
- **`name`**：服务的友好名称，会写入生成文件头部的注释。
- **`url` / `input` / `spec`**（必填三选一）：`url` 为规范地址，`input` 为本地规范文件路径，`spec` 为规范对象本身。
- **`authorizationToken`**：私有规范地址所需的认证凭证。
- **`output`**：生成代码的输出目录，默认 `./src/api/{id}`。

## 第 2 步：运行命令

```bash
swagger-api-hub
```

工具会读取 `./swagger-api-hub.config.ts`。由于配置导出的是数组，你会看到一个交互式列表，选择要生成的服务后回车。

如果配置只导出一个对象，则直接开始生成，不做任何询问：

```typescript
const service: ServiceConfig = {
  id: 'iam',
  url: 'https://api.example.com/iam/swagger/v3',
};
export default service;
```

## 第 3 步：查看生成结果

生成成功后，`output` 目录下会出现模块化文件：

```
src/api/iam/
├── Iam.ts          # API 类（路由方法，按 tag 模块化）
├── data-contracts.ts
├── http-client.ts
├── route-types.ts
└── ...
```

在业务代码中直接使用：

```typescript
import { Iam } from '@/api/iam/Iam';

const iam = new Iam();
const users = await iam.getUsers();
```

> 提示：生成的 `http-client.ts` 默认基于 axios。如果你的项目有统一的请求层，可以通过 `httpClientFile` 替换，详见「配置指南」。
