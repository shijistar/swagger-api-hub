import type { GenerateApiParams } from 'swagger-typescript-api';

export type ServiceConfig = GenerateApiParams & {
  /** the unique id of service */
  id: string;
  /** the friendly name of service */
  name?: string;
  /**
   * The base path of all API endpoints.
   * The service may be hosted on a subpath of the main domain, e.g., `/public-api/iam/v3`,
   * then the apiBase is `/public-api` in this case.
   */
  apiBase?: string;
  /**
   * Whether to use the absolute api path when calling the service. This is useful when the service
   * is hosted on a different domain and you need to set the `Access-Control-Allow-Origin` header.
   * Default is `false`.
   */
  crossOrigin?: boolean;
  /** Do not use this field, since it's override and is always set to `true` */
  singleHttpClient?: never;
  /** Change the default path of `http-client.ts` file, you can use your own http client */
  httpClientFile?: string;
  /** Auto create an instance for each api class */
  createApiInstance?: boolean;
};
