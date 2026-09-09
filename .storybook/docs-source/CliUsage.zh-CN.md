# CLI 用法

## 命令格式

```bash
swagger-api-hub [options] [config-path]
```

- **`config-path`**：配置文件路径，默认为 `./swagger-api-hub.config.ts`。
- **`-v, --version`**：查看版本号。
- **`-h, --help`**：查看帮助信息。

## 使用默认配置文件

```bash
swagger-api-hub
```

工具使用 `require.resolve` 解析配置文件：可以传本地相对/绝对路径，也可以传 npm 模块名（配置从 npm 包导出）。文件后缀可以是 `.ts`、`.js`、`.json` 或 Node.js 支持的其他模块类型。

## 指定自定义配置文件

```bash
swagger-api-hub ./configs/custom-config.ts
```

## 交互式选择

当配置文件导出的是**数组**（多个服务）时，会弹出交互式列表，通过方向键与空格选择要生成的服务：

```text
? Choose which services to generate (Press <space> to select, <a> to toggle all, <i> to invert)
❯ ◯ iam
  ◯ asset
```

当配置导出的是**单个对象**时，不弹出任何提示，直接生成。

## 配置校验

启动时会校验每个服务的配置：

- `id` 必填；
- `url`、`input`、`spec` 三者至少提供一个。

校验失败会以红色错误信息退出并提示原因：

```text
✖ [asset] config is invalid: either url, input or spec is required
```

## 生成成功

生成完成后打印成功信息与输出目录（除非 `silent` 配置为 `true`）：

```text
✔ Code is generated to  /path/to/src/api/iam
```
