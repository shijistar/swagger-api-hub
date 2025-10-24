import { defineConfig } from 'father';

export default defineConfig({
  cjs: {
    input: 'cli',
    output: 'lib',
    platform: 'node',
  },
  esm: {
    input: 'cli',
    output: 'es',
    platform: 'node',
  },
  sourcemap: true,
});
