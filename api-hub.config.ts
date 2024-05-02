import type { ServiceConfig } from './cli/types';

const services: ServiceConfig[] = [
  {
    id: 'iam',
    name: 'User Management Service',
    // url: 'https://api.example.com/iam/swagger/v3',
    url: 'http://localhost:3000/api-spec.json',
    output: './src/api/iam',
  },
  {
    id: 'asset',
    name: 'Asset Management Service',
    url: 'https://api.example.com/asset/swagger/v3',
    apiBase: '/asset',
    output: './src/api/asset',
  },
];
export default services;
