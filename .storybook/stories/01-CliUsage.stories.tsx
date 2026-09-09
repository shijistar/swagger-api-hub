import type { Meta, StoryObj } from '@storybook/react-vite';
import { CliTerminal, type TerminalScene } from '../components/demos/CliTerminal';
import { storyI18n } from '../locales';

const meta: Meta = {
  title: 'Demo / CLI Usage',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '演示 / CLI 用法',
  component: CliTerminal,
  parameters: {
    docs: {
      description: {
        component: storyI18n.t('story.meta.cliUsage'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function buildScenes(): TerminalScene[] {
  const t = storyI18n.t;
  return [
    {
      id: 'default',
      label: t('story.cli.scene.default'),
      lines: [
        { type: 'cmd', text: 'swagger-api-hub' },
        { type: 'dim', text: 'reading config: ./swagger-api-hub.config.ts' },
        { type: 'dim', text: 'fetching spec: https://api.example.com/iam/swagger/v3' },
        { type: 'output', text: '✎ generating api for "iam" (User Management Service)' },
        { type: 'success', text: '✔ Code is generated to  /home/user/project/src/api/iam' },
      ],
    },
    {
      id: 'custom',
      label: t('story.cli.scene.custom'),
      lines: [
        { type: 'cmd', text: 'swagger-api-hub ./configs/custom-config.ts' },
        { type: 'dim', text: 'reading config: ./configs/custom-config.ts' },
        { type: 'dim', text: 'fetching spec: https://api.example.com/public-api/asset/swagger/v3' },
        { type: 'output', text: '✎ generating api for "asset" (Asset Management Service)' },
        { type: 'success', text: '✔ Code is generated to  /home/user/project/src/api/asset' },
      ],
    },
    {
      id: 'multi',
      label: t('story.cli.scene.multi'),
      lines: [
        { type: 'cmd', text: 'swagger-api-hub' },
        {
          type: 'output',
          text: '? Choose which services to generate (Press <space> to select, <a> to toggle all, <i> to invert)',
        },
        { type: 'select', text: '❯ ◯ iam' },
        { type: 'select', text: '  ◯ asset' },
        { type: 'output', text: '❯ ◉ iam, ◯ asset' },
        { type: 'dim', text: 'generating 1 service...' },
        { type: 'success', text: '✔ Code is generated to  /home/user/project/src/api/iam' },
      ],
    },
    {
      id: 'help',
      label: t('story.cli.scene.help'),
      lines: [
        { type: 'cmd', text: 'swagger-api-hub --help' },
        { type: 'output', text: 'Usage: swagger-api-hub [options] [config-path]' },
        { type: 'output', text: 'Generate front-end interface code to interact with OpenAPI-based backend services' },
        { type: 'output', text: 'Arguments:' },
        {
          type: 'output',
          text: '  [config-path]  Path to the configuration file, if not specified, the default file path will be used (default: "./swagger-api-hub.config.ts")',
        },
        { type: 'output', text: 'Options:' },
        { type: 'output', text: '  -v, --version  output the version number' },
        { type: 'output', text: '  -h, --help     display help for command' },
        { type: 'dim', text: '' },
        { type: 'cmd', text: 'swagger-api-hub --version' },
        { type: 'output', text: '1.3.1' },
      ],
    },
  ];
}

export const InteractiveTerminal: Story = {
  name: 'Interactive Terminal',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '交互式终端',
  render: () => <CliTerminal scenes={buildScenes()} title={storyI18n.t('story.cli.terminalTitle')} />,
};
