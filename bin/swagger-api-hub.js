#! /usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const { sync: spawnSync } = require('cross-spawn');
const { existsSync } = require('fs');
const { join, resolve } = require('path');
/* eslint-enable @typescript-eslint/no-var-requires */

const rootDir = resolve(__dirname, '../');
const libDir = resolve(__dirname, '../lib');
const cliDir = resolve(__dirname, '../cli');
const srcDir = resolve(__dirname, '../src');
const execDir = existsSync(srcDir) ? cliDir : libDir;
const ext = existsSync(srcDir) ? 'ts' : 'js';

spawnSync('npx', ['tsx', join(execDir, `repl.${ext}`), ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: {
    ...process.env,
    API_HUB_ROOT: rootDir,
    API_HUB_EXEC_DIR: execDir,
  },
});
