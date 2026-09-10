import type { NavItem } from './PrevNextNav';

/**
 * Prev/next navigation chain for swagger-api-hub: all docs pages first (01-08), then all demo
 * stories (01-05). Changelog is intentionally NOT part of this chain.
 */
export const NAV_ITEMS: NavItem[] = [
  { key: 'introduce', id: 'introduce--docs', type: 'docs', title: 'Introduce', titleCN: '介绍' },
  { key: 'install', id: 'install--docs', type: 'docs', title: 'Install', titleCN: '安装' },
  { key: 'get-started', id: 'get-started--docs', type: 'docs', title: 'Get Started', titleCN: '快速开始' },
  { key: 'cli-usage', id: 'cli-usage--docs', type: 'docs', title: 'CLI Usage', titleCN: 'CLI 用法' },
  { key: 'config-guide', id: 'config-guide--docs', type: 'docs', title: 'Config Guide', titleCN: '配置指南' },
  { key: 'api-usage', id: 'api-usage--docs', type: 'docs', title: 'API Usage', titleCN: 'API 用法' },
  { key: 'options', id: 'options--docs', type: 'docs', title: 'Options', titleCN: '完整配置项' },
  { key: 'faq', id: 'faq--docs', type: 'docs', title: 'FAQ', titleCN: '常见问题' },
  {
    key: 'demo-cli-usage',
    id: 'demo-cli-usage--interactive-terminal',
    type: 'story',
    title: 'CLI Usage',
    titleCN: 'CLI 用法',
  },
  {
    key: 'demo-config-examples',
    id: 'demo-config-examples--config-scenarios',
    type: 'story',
    title: 'Config Examples',
    titleCN: '配置示例',
  },
  {
    key: 'demo-generated-output',
    id: 'demo-generated-output--output-preview',
    type: 'story',
    title: 'Generated Output',
    titleCN: '生成结果',
  },
  {
    key: 'demo-api-usage',
    id: 'demo-api-usage--module-usage',
    type: 'story',
    title: 'API Usage',
    titleCN: 'API 用法',
  },
  {
    key: 'demo-custom-http-client',
    id: 'demo-custom-http-client--custom-client',
    type: 'story',
    title: 'Custom Http Client',
    titleCN: '自定义 Http Client',
  },
];
