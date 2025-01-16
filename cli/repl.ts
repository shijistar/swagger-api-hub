import type { GenerateApiOutput } from 'swagger-typescript-api';
import commander from 'commander';
import { existsSync } from 'fs';
import { resolve } from 'path';
import signale from 'signale';
import packageJson from '../package.json';
import { generate, generateWithPrompt } from './generate';
import type { ServiceConfig } from './types';

const program = new commander.Command();

program
  .name(Object.keys(packageJson.bin)[0])
  .description('Generate front-end interface code to interact with OpenAPI-based backend services')
  .usage('[options] [config-path]')
  .argument(
    '[config-path]',
    'Path to the configuration file, if not specified, the default file path will be used',
    './swagger-api-hub.config.ts'
  )
  .helpOption('-h, --help')
  .version(packageJson.version, '-v, --version')
  .action(async (configPath) => {
    let absPath: string;
    try {
      absPath = require.resolve(configPath);
    } catch {
      absPath = resolve(configPath);
    }
    if (!existsSync(absPath)) {
      signale.fatal('Config file not found:', configPath);
      process.exit(1);
    }

    let config: ServiceConfig[] | ServiceConfig;
    try {
      // eslint-disable-next-line  @typescript-eslint/no-require-imports
      const originalConfig = require(absPath);
      config = originalConfig?.default ?? originalConfig;
    } catch (error) {
      signale.fatal(`Config file parse error (${configPath}):`, error);
      process.exit(1);
    }

    if (Array.isArray(config)) {
      config.forEach((c, i) => validateConfig(c, i));
    } else {
      validateConfig(config);
    }

    let result: GenerateApiOutput | undefined;
    if (Array.isArray(config)) {
      result = await generateWithPrompt(config);
    } else {
      result = await generate(config);
    }
    if (result && !result.configuration.config.silent) {
      signale.success('Code is generated to ', result.configuration.config.output);
    }
  });

program.parse(process.argv);

function validateConfig(config: ServiceConfig, index?: number) {
  if (!config.id) {
    const prefix = index != null ? `[#${index}] ` : '';
    signale.fatal(`${prefix}config is invalid: id is required`);
    process.exit(1);
  }
  if (
    (!('url' in config) || !config.url) &&
    (!('input' in config) || !config.input) &&
    (!('spec' in config) || !config.spec)
  ) {
    signale.fatal(`[${config.id}] config is invalid: either url, input or spec is required`);
    process.exit(1);
  }
}
