import type { ServiceConfig } from '../cli/types';

const services: ServiceConfig[] = [
  {
    id: 'iam',
    name: 'User Management Service',
    url: 'https://api.example.com/iam/swagger/v3',
  },
  {
    id: 'asset',
    name: 'Asset Management Service',
    url: 'https://api.example.com/asset/swagger/v3',
    apiBase: '/asset',
  },
];
export default services;
