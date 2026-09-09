import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, type TableProps, Typography } from 'antd';
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

interface DefaultsRow {
  property: string;
  default: string;
  custom: string;
}

const defaultsData: DefaultsRow[] = [
  { property: 'baseURL', default: '—（相对路径）', custom: 'VITE_APP_API_BASE_URL（环境变量）' },
  { property: 'timeout', default: 'axios 默认 0（不超时）', custom: '30_000' },
  { property: 'headers', default: '无公共头', custom: "X-Requested-With: 'XMLHttpRequest'" },
  { property: 'path', default: '原样请求', custom: '去掉 /v1/open 前缀' },
  { property: '响应处理', default: '直接返回', custom: 'afterParseResponse 后处理（可选）' },
];

const CustomHttpClientContent = () => {
  const t = useStoryT();

  const tableColumns: TableProps<DefaultsRow>['columns'] = [
    {
      title: t('story.customHttp.defaultsProperty'),
      dataIndex: 'property',
      key: 'property',
      render: (value: string) => <Typography.Text code>{value}</Typography.Text>,
    },
    {
      title: t('story.customHttp.defaultsDefault'),
      dataIndex: 'default',
      key: 'default',
    },
    {
      title: t('story.customHttp.defaultsCustom'),
      dataIndex: 'custom',
      key: 'custom',
    },
  ];

  return (
    <div className="sb-story-container">
      <div className="sb-section">
        <Typography.Title level={5}>{t('story.customHttp.sectionConfig')}</Typography.Title>
        <Typography.Paragraph type="secondary">{t('story.customHttp.sectionConfigDesc')}</Typography.Paragraph>
        <CodeBlock code={configCode} />
      </div>
      <div className="sb-section">
        <Typography.Title level={5}>{t('story.customHttp.sectionClient')}</Typography.Title>
        <Typography.Paragraph type="secondary">{t('story.customHttp.sectionClientDesc')}</Typography.Paragraph>
        <CodeBlock code={clientCode} maxHeight={520} />
      </div>
      <div className="sb-section">
        <Typography.Title level={5}>{t('story.customHttp.defaultsTitle')}</Typography.Title>
        <Table<DefaultsRow>
          size="small"
          rowKey="property"
          columns={tableColumns}
          dataSource={defaultsData}
          pagination={false}
          bordered
        />
      </div>
      <div className="sb-section">
        <Typography.Title level={5}>{t('story.customHttp.sectionUsage')}</Typography.Title>
        <Typography.Paragraph type="secondary">{t('story.customHttp.sectionUsageDesc')}</Typography.Paragraph>
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
