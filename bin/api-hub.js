#! /usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const { sync: spawnSync } = require('cross-spawn');
const { existsSync } = require('fs');
const { resolve } = require('path');
/* eslint-enable @typescript-eslint/no-var-requires */

const rootDir = resolve(__dirname, '../');
const libDir = resolve(__dirname, '../lib');
const cliDir = resolve(__dirname, '../cli');
const srcDir = resolve(__dirname, '../src');

spawnSync('npx', ['tsx', resolve(__dirname, '../cli/repl.ts'), ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: {
    ...process.env,
    API_HUB_ROOT: rootDir,
    API_HUB_LIB_DIR: existsSync(srcDir) ? cliDir : libDir,
  },
});
