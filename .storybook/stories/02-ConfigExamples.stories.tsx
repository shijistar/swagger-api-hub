import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfigExamples, type ConfigScenario } from '../components/demos/ConfigExamples';
import { storyI18n } from '../locales';

const meta: Meta = {
  title: 'Demo / Config Examples',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '演示 / 配置示例',
  component: ConfigExamples,
  parameters: {
    docs: {
      description: {
        component: storyI18n.t('story.meta.configExamples'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function buildScenarios(): ConfigScenario[] {
  const t = storyI18n.t;
  const importLine = "import type { ServiceConfig } from '@tiny-codes/swagger-api-hub';";
  return [
    {
      id: 'single',
      label: t('story.config.single'),
      desc: t('story.config.singleDesc'),
      code: `${importLine}

// 单个服务对象：直接生成，不做任何询问
const service: ServiceConfig = {
  id: 'iam',
  name: 'User Management Service',
  url: 'https://api.example.com/iam/swagger/v3',
  authorizationToken: 'Basic XXXXXXXXXXXXXXXXXX',
  output: './src/api/iam',
};
export default service;`,
    },
    {
      id: 'multi',
      label: t('story.config.multi'),
      desc: t('story.config.multiDesc'),
      code: `${importLine}

// 服务数组：启动后交互式选择要生成的服务
const services: ServiceConfig[] = [
  {
    id: 'iam',
    name: 'User Management Service',
    url: 'https://api.example.com/iam/swagger/v3',
    authorizationToken: 'Basic XXXXXXXXXXXXXXXXXX',
    output: './src/api/iam',
  },
  {
    id: 'asset',
    name: 'Asset Management Service',
    url: 'https://api.example.com/public-api/asset/swagger/v3',
    authorizationToken: 'Basic XXXXXXXXXXXXXXXXXX',
    apiBase: '/public-api',
    output: './src/api/asset',
  },
];
export default services;`,
    },
    {
      id: 'customHttp',
      label: t('story.config.customHttp'),
      desc: t('story.config.customHttpDesc'),
      code: `${importLine}

// 通过公共配置 + 自定义 http client 复用请求层
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
export default service;`,
    },
    {
      id: 'advanced',
      label: t('story.config.advanced'),
      desc: t('story.config.advancedDesc'),
      code: `${importLine}

const services: ServiceConfig[] = [
  {
    id: 'iam',
    name: 'User Management Service',
    url: 'https://api.example.com/iam/swagger/v3',
    apiBase: '/public-api',
    output: './src/api/iam',
    createApiInstance: true,
    intTotalElements: true,
    addTagNameToRoute: true,
    moduleNameFirstTag: true,
    sortRoutes: true,
    extractRequestParams: true,
    extractRequestBody: true,
    extractResponseBody: true,
    extractEnums: true,
    generateUnionEnums: true,
    dataTypeMappings: {
      int64: 'number',
      object: 'Record<string, any>',
    },
  },
];
export default services;`,
    },
  ];
}

export const ConfigScenarios: Story = {
  name: 'Config Scenarios',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '配置场景',
  render: () => <ConfigExamples scenarios={buildScenarios()} fileName={storyI18n.t('story.config.fileName')} />,
};
