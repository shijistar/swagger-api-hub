import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from 'antd';
import { CodeBlock } from '../components/CodeBlock';
import { useStoryT } from '../locales';

const meta: Meta = {
  title: 'Demo / API Usage',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '演示 / API 用法',
  parameters: {
    docs: {
      description: {
        component: 'Using swagger-api-hub as a Node.js module: generate() and promptToGenerate().',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const UsageContent = () => {
  const t = useStoryT();
  return (
    <div className="sb-story-container">
      <div className="sb-section">
        <Typography.Title level={5}>{t('story.api.generate')}</Typography.Title>
        <Typography.Paragraph type="secondary">{t('story.api.generateDesc')}</Typography.Paragraph>
        <CodeBlock
          code={`${t('story.api.importLine')}
import serviceConfigs from './swagger-api-hub.config';

// 用法 1：单个服务直接生成，不做任何询问
generate(serviceConfigs[0]);`}
        />
      </div>
      <div className="sb-section">
        <Typography.Title level={5}>{t('story.api.promptToGenerate')}</Typography.Title>
        <Typography.Paragraph type="secondary">{t('story.api.promptToGenerateDesc')}</Typography.Paragraph>
        <CodeBlock
          code={`${t('story.api.importLine')}
import serviceConfigs from './swagger-api-hub.config';

// 用法 2：多个服务，交互式选择
promptToGenerate(serviceConfigs);`}
        />
      </div>
      <div className="sb-section">
        <Typography.Title level={5}>{t('story.api.inlineSpec')}</Typography.Title>
        <CodeBlock
          language="typescript"
          code={`import { generate } from '@tiny-codes/swagger-api-hub';
import type { ServiceConfig } from '@tiny-codes/swagger-api-hub';

const config: ServiceConfig = {
  id: 'iam',
  // 不传 url/input，直接内联规范对象
  spec: {
    openapi: '3.0.0',
    info: { title: 'IAM', version: '1.0' },
    paths: {
      '/users': {
        get: {
          tags: ['User'],
          operationId: 'getUsers',
          responses: { '200': { description: 'OK' } },
        },
      },
    },
  },
  output: './src/api/iam',
};

await generate(config);`}
        />
      </div>
    </div>
  );
};

export const ModuleUsage: Story = {
  name: 'Module Usage',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '模块用法',
  render: () => <UsageContent />,
};
