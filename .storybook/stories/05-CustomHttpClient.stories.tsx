import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '../components/CodeBlock';
import { useStoryT } from '../locales';

const meta: Meta = {
  title: 'Demo / Custom Http Client',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '演示 / 自定义 Http Client',
  parameters: {
    docs: {
      description: {
        component: 'Point httpClientFile to your own request module to override the axios defaults.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const configCode = `import type { ServiceConfig } from '@tiny-codes/swagger-api-hub';

const service: ServiceConfig = {
  id: 'iam',
  name: 'User Management Service',
  url: 'https://api.example.com/iam/swagger/v3',
  output: './src/api/iam',
  // 生成的 api.ts 将改为从该路径导入 HttpClient，
  // 而不是默认生成的 ./http-client.ts
  httpClientFile: '../request/swagger-request',
};
export default service;`;

const clientCode = `import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { HttpClient as SwaggerHttpClient, type ApiConfig, type FullRequestParams } from './http-client';

// 1. 创建共享 axios 实例：在这里定义全局默认属性
const defaultAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL, // 覆盖默认 baseURL
  timeout: 30_000,                                 // 覆盖默认超时时间
  headers: {
    'X-Requested-With': 'XMLHttpRequest',          // 公共请求头
  },
});

export class HttpClient<SecurityDataType = unknown> extends SwaggerHttpClient<SecurityDataType> {
  constructor(axiosInstance?: AxiosInstance, options: ApiConfig<SecurityDataType> = {}) {
    // 未显式传入实例时，使用带默认属性的自定义实例
    super(axiosInstance ?? defaultAxiosInstance, options);
  }

  // 2. 覆盖 request：为每次请求注入默认值 + 改写路径
  request = async <T = any, E = any>({ path, ...rest }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const requestParams = this.mergeRequestParams(
      {
        baseURL: import.meta.env.VITE_APP_API_BASE_URL,
        timeout: 30_000,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      },
      rest,
    );
    // 3. 路径改写：去掉服务前缀，适配网关路由
    const url = path.replace(/^\\/v1\\/open/, '');
    return this.instance.request({ ...requestParams, url });
  };
}

// 4. （可选）也可以直接在模块顶层修改 axios 全局默认值：
// axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL;
// axios.defaults.timeout = 30_000;`;

const usageCode = `/* eslint-disable */
// @ts-nocheck
// 生成的 api.ts：HttpClient / RequestParams 均来自自定义模块
import type { AxiosInstance } from 'axios';
import type { ApiConfig } from '../request/swagger-request';
import { ContentType, HttpClient, RequestParams } from '../request/swagger-request';
import type { UserDto } from './data-contracts';

/**
 * @tags User
 * @name UserController
 */
export class UserController<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(axiosInstance?: AxiosInstance, options: ApiConfig<SecurityDataType> = {}) {
    this.http = new HttpClient<SecurityDataType>(axiosInstance, { ...options });
  }

  /**
   * @name GetUsers
   * @request GET:/iam/api/users
   */
  getUsers = (query: { page?: number; size?: number }, params: RequestParams = {}) =>
    this.http.request<UserDto[]>({
      path: \`/iam/api/users\`,
      method: 'GET',
      query,
      ...params,
    });
}`;

const defaultsRows: Array<[string, string, string]> = [
  ['baseURL', '—（相对路径）', 'VITE_APP_API_BASE_URL（环境变量）'],
  ['timeout', 'axios 默认 0（不超时）', '30_000'],
  ['headers', '无公共头', "X-Requested-With: 'XMLHttpRequest'"],
  ['path', '原样请求', '去掉 /v1/open 前缀'],
  ['响应处理', '直接返回', 'afterParseResponse 后处理（可选）'],
];

const CustomHttpClientContent = () => {
  const t = useStoryT();
  return (
    <div className="sb-story-container">
      <div className="sb-section">
        <div className="sb-section-title">{t('story.customHttp.sectionConfig')}</div>
        <p className="sb-desc">{t('story.customHttp.sectionConfigDesc')}</p>
        <CodeBlock code={configCode} />
      </div>
      <div className="sb-section">
        <div className="sb-section-title">{t('story.customHttp.sectionClient')}</div>
        <p className="sb-desc">{t('story.customHttp.sectionClientDesc')}</p>
        <CodeBlock code={clientCode} maxHeight={520} />
      </div>
      <div className="sb-section">
        <div className="sb-section-title">{t('story.customHttp.defaultsTitle')}</div>
        <table className="sb-defaults-table">
          <thead>
            <tr>
              <th>{t('story.customHttp.defaultsProperty')}</th>
              <th>{t('story.customHttp.defaultsDefault')}</th>
              <th>{t('story.customHttp.defaultsCustom')}</th>
            </tr>
          </thead>
          <tbody>
            {defaultsRows.map(([prop, def, custom]) => (
              <tr key={prop}>
                <td>
                  <code>{prop}</code>
                </td>
                <td>{def}</td>
                <td>{custom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sb-section">
        <div className="sb-section-title">{t('story.customHttp.sectionUsage')}</div>
        <p className="sb-desc">{t('story.customHttp.sectionUsageDesc')}</p>
        <CodeBlock code={usageCode} maxHeight={520} />
      </div>
    </div>
  );
};

export const CustomClient: Story = {
  name: 'Custom Client',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '自定义客户端',
  render: () => <CustomHttpClientContent />,
};
