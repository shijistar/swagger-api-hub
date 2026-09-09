# 作为 npm 模块使用

除了命令行方式，swagger-api-hub 也可以作为 Node.js 模块集成到构建流程（如 CI、构建脚本）中。

## 导入

```typescript
import { generate, promptToGenerate } from '@tiny-codes/swagger-api-hub';
import type { ServiceConfig } from '@tiny-codes/swagger-api-hub';
import serviceConfigs from './swagger-api-hub.config';
```

## `generate(config)`

为单个服务直接生成代码，不做任何询问：

```typescript
// 用法 1：单个服务直接生成
generate(serviceConfigs[0]);
```

## `promptToGenerate(configs)`

传入多个服务时弹出交互式选择提示：

```typescript
// 用法 2：多个服务，交互式选择
promptToGenerate(serviceConfigs);
```

## 返回值

两个函数都返回 `generateApi` 的返回值，包含生成的文件信息，可以用于后续处理（例如上传、通知或写入非默认位置）。

## 在 CI 中使用

```typescript
// ci/generate-api.ts
import { generate } from '@tiny-codes/swagger-api-hub';
import serviceConfigs from '../swagger-api-hub.config';

async function main() {
  for (const config of serviceConfigs) {
    await generate(config);
    console.log(`generated: ${config.id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

> 注意：模块入口为 `cli` 目录编译产物（`lib/`），导出 `generate`、`promptToGenerate` 及 `ServiceConfig` 等类型。
