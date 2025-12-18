import type { ServiceConfig } from '../cli';

const commonConfig: Partial<ServiceConfig> = {
  httpClientFile: '../request/swagger-request',
};
const service: ServiceConfig = {
  ...commonConfig,
  id: 'xspark',
  name: 'XSpark Bff API',
  output: './api/xspark',
  url: 'https://xcloud-dev.lenovo.com/xspark/api/api-docs/v3',
  authorizationToken: 'Basic YWRtaW46cXNjMSlyZ24=',
  intTotalElements: true,
  extractRequestBody: true,
  extractRequestParams: false,
  extractResponseBody: false,
};
export default service;
