# 安装

## 环境要求

- Node.js 12 及以上

## 全局安装（推荐）

```bash
npm install -g @tiny-codes/swagger-api-hub
```

安装后即可在任何项目中使用 `swagger-api-hub` 命令：

```bash
swagger-api-hub --help
```

## 作为项目依赖安装

```bash
npm install -D @tiny-codes/swagger-api-hub
```

此时可以通过 `npx` 调用，或在 npm scripts 中使用：

```json
{
  "scripts": {
    "api": "swagger-api-hub"
  }
}
```

## 验证安装

```bash
swagger-api-hub --version
```

如果输出版本号（例如 `1.3.1`），说明安装成功。
