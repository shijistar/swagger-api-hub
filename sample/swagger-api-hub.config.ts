import type { ServiceConfig } from '../cli';

const commonConfig: Partial<ServiceConfig> = {
  httpClientFile: '../request/swagger-request',
};
const service: ServiceConfig = {
  ...commonConfig,
  id: 'iam',
  name: 'User Management Service',
  output: './api/iam',
  url: 'https://api.example.com/iam/swagger/v3',
  intTotalElements: true,
  extractRequestBody: true,
  extractRequestParams: false,
  extractResponseBody: false,
};
export default service;
