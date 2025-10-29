import type { GenerateApiParams } from 'swagger-typescript-api';

/** The configuration of a service. */
export type ServiceConfig = GenerateApiParams & {
  /**
   * **EN:** The unique id of API service
   *
   * **ZH:** API服务的唯一标识
   */
  id: string;
  /**
   * **EN:** The friendly name of service
   *
   * **ZH:** API服务的显示名称
   */
  name?: string;
  /**
   * **EN:** The base path of all API endpoints. The service may be hosted on a subpath of the main
   * domain, e.g., `/public-api/iam/v3`, then the apiBase is `/public-api` in this case.
   *
   * **ZH:** 所有API端点的基础路径。服务可能托管在主域的子路径上，例如，`/public-api/iam/v3`，那么在这种情况下，apiBase是`/public-api`。
   */
  apiBase?: string;
  /**
   * **EN:** Whether to use the absolute api path when calling the service. This is useful when the
   * service is hosted on a different domain and you need to set the `Access-Control-Allow-Origin`
   * header. Default is `false`.
   *
   * **ZH:** 在调用服务时是否使用绝对api路径。当服务托管在不同的域上并且您需要设置`Access-Control-Allow-Origin`头时，这很有用。默认为`false`。
   */
  crossOrigin?: boolean;
  /**
   * **EN:** Do not use this field, since it's override and is always set to `true`
   *
   * **ZH:** 不要尝试使用此字段，因为它会被覆盖，并且始终设置为`true`
   */
  singleHttpClient?: boolean;
  /**
   * **EN:** Change the default path of `http-client.ts` file, you can use your own http client
   *
   * **ZH:** 更改`http-client.ts`文件的默认路径，你可以使用自己的http客户端
   */
  httpClientFile?: string;
  /**
   * **EN:** Auto create an instance for each api class. Default is `true`
   *
   * **ZH:** 为每个api类自动创建一个实例。默认为`true`
   */
  createApiInstance?: boolean;
  /**
   * EN:** Whether to force convert `totalElements` to `number`(int32) type. Default is `false`
   *
   * **ZH:** 是否强制将`totalElements`转换为`number`(int32)类型。默认为`false`
   */
  intTotalElements?: boolean;
  /**
   * **EN:** Whether to add the tag name to the route name (i.e. method name), only valid when
   * `moduleNameFirstTag` is `true`. Default is `false`
   *
   * **ZH:** 是否在路由名称（即方法名）中添加标签名称，仅当`moduleNameFirstTag`为`true`时有效。默认为`false`
   */
  addTagNameToRoute?: boolean;
  /**
   * **EN:** Some custom data type mappings
   *
   * **ZH:** 一些自定义数据类型映射
   *
   * @default {
   *  int64: 'bigint',
   *  object: 'Record<string, any>'
   * }
   */
  dataTypeMappings?: Record<string, string>;
};
