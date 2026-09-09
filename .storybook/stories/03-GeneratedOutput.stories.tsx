import type { Meta, StoryObj } from '@storybook/react-vite';
import { type GeneratedFile, GeneratedOutput } from '../components/demos/GeneratedOutput';
import { storyI18n } from '../locales';

const meta: Meta = {
  title: 'Demo / Generated Output',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '演示 / 生成结果',
  component: GeneratedOutput,
  parameters: {
    docs: {
      description: {
        component: storyI18n.t('story.meta.generatedOutput'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const fileTree = `src/api/iam/
├── http-client.ts
├── data-contracts.ts
├── route-types.ts
└── UserController.ts   ← 按 tag 模块化（moduleNameFirstTag: true）`;

function buildFiles(): GeneratedFile[] {
  const t = storyI18n.t;
  return [
    {
      id: 'api',
      label: t('story.generated.file.api'),
      code: `/* eslint-disable */
// @ts-nocheck
import { HttpClient, RequestParams } from './http-client';
import type { UserDto, CreateUserDto, UpdateUserDto } from './data-contracts';

/**
 * @tags User
 * @name UserController
 */
export class UserController<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * Get user list
   *
   * @tags User
   * @name GetUsers
   * @request GET:/iam/api/users
   * @response \`200\` \`(UserDto)[]\` OK
   */
  getUsers = (query: { page?: number; size?: number }, params: RequestParams = {}) =>
    this.request<UserDto[], any>({
      path: \`/iam/api/users\`,
      method: 'GET',
      query,
      ...params,
    });

  /**
   * Create a user
   *
   * @tags User
   * @name CreateUser
   * @request POST:/iam/api/users
   * @response \`200\` \`UserDto\` OK
   */
  createUser = (data: CreateUserDto, params: RequestParams = {}) =>
    this.request<UserDto, any>({
      path: \`/iam/api/users\`,
      method: 'POST',
      body: data,
      type: 'json',
      ...params,
    });
}`,
    },
    {
      id: 'dataContracts',
      label: t('story.generated.file.dataContracts'),
      code: `/* eslint-disable */
// @ts-nocheck
export interface UserDto {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Email address */
  email: string;
  /** User role */
  role: 'admin' | 'editor' | 'viewer';
  /** Active flag */
  active: boolean;
  /** Creation time */
  createdAt: string;
  /** Total elements (page info) */
  totalElements: number;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: 'admin' | 'editor' | 'viewer';
  active?: boolean;
}`,
    },
    {
      id: 'httpClient',
      label: t('story.generated.file.httpClient'),
      code: `/* eslint-disable */
// @ts-nocheck
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  secure?: boolean;
  path: string;
  type?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  query?: QueryParamsType;
  format?: 'json' | 'form-data' | 'urlencoded';
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  public securityData: SecurityDataType | null = null;
  private baseApiParams: FullRequestParams = {};

  constructor(instance?: AxiosInstance, baseApiParams: FullRequestParams = {}) {
    this.instance = instance ?? axios.create();
    this.baseApiParams = baseApiParams;
  }

  public request = async <T = any, E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const requestParams = { ...this.baseApiParams, ...params };
    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers ?? {}),
        ...(type && format ? { 'Content-Type': \`\${type};\${format}\` } : {}),
      },
      params: query,
      data: body,
      url: path,
      method: type,
    });
  };
}`,
    },
    {
      id: 'routeTypes',
      label: t('story.generated.file.routeTypes'),
      code: `/* eslint-disable */
// @ts-nocheck
export namespace Api {
  export type GetUsersRoute = {
    path: '/iam/api/users';
    method: 'GET';
    query: { page?: number; size?: number };
    response: UserDto[];
  };

  export type CreateUserRoute = {
    path: '/iam/api/users';
    method: 'POST';
    body: CreateUserDto;
    response: UserDto;
  };
}`,
    },
  ];
}

export const OutputPreview: Story = {
  name: 'Output Preview',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '输出预览',
  render: () => (
    <GeneratedOutput
      fileTree={fileTree}
      files={buildFiles()}
      caption={storyI18n.t('story.generated.fileTreeCaption')}
    />
  ),
};
