# 完整配置项

`ServiceConfig` = `GenerateApiParams`（来自 `swagger-typescript-api`）+ 本项目扩展字段。下表按类别列出常用配置项。

## 扩展字段

| 字段                | 类型                     | 默认值                                               | 说明                                                      |
| ------------------- | ------------------------ | ---------------------------------------------------- | --------------------------------------------------------- |
| `id`                | `string`                 | —                                                    | **必填**。服务唯一标识，默认决定输出目录 `./src/api/{id}` |
| `name`              | `string`                 | —                                                    | 服务友好名称，写入生成文件头部注释                        |
| `apiBase`           | `string`                 | —                                                    | 所有 API 端点的基础路径前缀，如 `/public-api`             |
| `crossOrigin`       | `boolean`                | `false`                                              | 调用服务时是否使用绝对路径                                |
| `singleHttpClient`  | `boolean`                | `true`（强制）                                       | 此字段会被覆盖，请勿使用                                  |
| `httpClientFile`    | `string`                 | `./http-client.ts`                                   | 自定义 `http-client.ts` 的路径                            |
| `createApiInstance` | `boolean`                | `true`                                               | 是否为每个 API 类自动创建实例                             |
| `intTotalElements`  | `boolean`                | `false`                                              | 是否将 `totalElements` 强制转为 `number`(int32)           |
| `addTagNameToRoute` | `boolean`                | `false`                                              | 是否把 tag 名加入路由名（需 `moduleNameFirstTag`）        |
| `dataTypeMappings`  | `Record<string, string>` | `{ int64: 'bigint', object: 'Record<string, any>' }` | 特殊数据类型到 TS 类型的映射                              |

## 规范来源（三选一）

| 字段    | 类型     | 说明             |
| ------- | -------- | ---------------- |
| `url`   | `string` | 规范地址         |
| `input` | `string` | 本地规范文件路径 |
| `spec`  | `object` | 规范对象本身     |

## 生成行为

| 字段                   | 默认值            | 说明                                          |
| ---------------------- | ----------------- | --------------------------------------------- |
| `modular`              | `true`（内置）    | 按 tag 拆分为独立模块文件                     |
| `httpClientType`       | `'axios'`（内置） | 生成的 http client 类型（`axios` / `fetch`）  |
| `templates`            | 内置模板（内置）  | 自定义模板目录路径                            |
| `output`               | `./src/api/{id}`  | 输出目录；设为 `false` 可只返回文件内容不落盘 |
| `fileName`             | `'Api.ts'`        | 生成 API 模块的文件名                         |
| `generateRouteTypes`   | `true`（内置）    | 是否生成路由类型定义                          |
| `generateClient`       | —                 | 是否生成 API 客户端                           |
| `generateUnionEnums`   | `true`（内置）    | 枚举是否生成联合类型                          |
| `extractEnums`         | `true`（内置）    | 提取嵌套枚举为 TS enum                        |
| `extractRequestParams` | `true`（内置）    | 提取请求参数为 data contract                  |
| `extractRequestBody`   | `true`（内置）    | 提取请求体类型为 data contract                |
| `extractResponseBody`  | `true`（内置）    | 提取响应体类型为 data contract                |
| `extractResponseError` | —                 | 提取响应错误类型                              |
| `extractResponses`     | —                 | 提取响应类型                                  |
| `moduleNameFirstTag`   | `true`（内置）    | 使用第一个 tag 作为模块名                     |
| `sortRoutes`           | `true`（内置）    | 路由按字母排序                                |
| `sortTypes`            | —                 | data contract 按字母排序                      |
| `patch`                | `true`（内置）    | 修复规范中的小错误                            |
| `cleanOutput`          | `true`（内置）    | 生成前清空输出目录                            |
| `unwrapResponseData`   | —                 | 从响应中解包 data 项                          |
| `anotherArrayType`     | —                 | 数组类型生成为 `Array<Type>`                  |
| `addReadonly`          | —                 | 生成只读属性                                  |
| `toJS`                 | —                 | 生成 JS 模块 + 声明文件                       |
| `disableThrowOnError`  | —                 | 非成功响应不抛错                              |
| `silent`               | `false`           | 仅输出错误信息                                |
| `debug`                | —                 | 输出调试信息                                  |

## 命名与类型

| 字段                              | 默认值    | 说明                                   |
| --------------------------------- | --------- | -------------------------------------- |
| `typePrefix` / `typeSuffix`       | —         | 类型名的前后缀                         |
| `enumKeyPrefix` / `enumKeySuffix` | —         | 枚举键的前后缀                         |
| `enumNamesAsValues`               | —         | 使用枚举名作为值                       |
| `primitiveTypeConstructs`         | —         | 自定义原始类型映射（函数或对象）       |
| `codeGenConstructs`               | —         | 自定义代码生成构造                     |
| `defaultResponseType`             | `'void'`  | 空响应 schema 的默认类型               |
| `fixInvalidTypeNamePrefix`        | `'Type'`  | 修复非法类型名的前缀                   |
| `fixInvalidEnumKeyPrefix`         | `'Value'` | 修复非法枚举键的前缀                   |
| `hooks`                           | —         | 生成过程钩子（如 `onFormatRouteName`） |

> 完整选项请参考 [swagger-typescript-api#options](https://github.com/acacode/swagger-typescript-api?tab=readme-ov-file#-options)。
