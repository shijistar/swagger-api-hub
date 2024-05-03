import { defineConfig } from 'father';

export default defineConfig({
  cjs: {
    input: 'cli',
    output: 'lib',
    platform: 'node',
  },
  sourcemap: true,
});
