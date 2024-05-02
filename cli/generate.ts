import { generateApi } from 'swagger-typescript-api';
import type { GenerateApiParams } from 'swagger-typescript-api';
// @ts-ignore: TS7016 no declaration file
import type { SchemaParser } from 'swagger-typescript-api/src/schema-parser/schema-parser';
import { select } from '@inquirer/prompts';
import { cyan, gray, yellow } from 'colors/safe';
import { resolve } from 'path';
import prettier from 'prettier';
import { rootDir } from './paths';
import type { ServiceConfig } from './types';

/**
 * Generate code for a swagger service
 * @param config the configuration for code generation
 * @returns the generated result
 */
export async function generate(config: ServiceConfig) {
  const { output = `./src/api/${config.id}`, ...otherConfig } = config;
  const prettierConfig = await prettier.resolveConfig(process.cwd());
  const params: GenerateApiParams = {
    modular: true,
    templates: resolve(rootDir, 'templates'),
    httpClientType: 'axios',
    singleHttpClient: true,
    httpClientFile: './http-client.ts',
    extractEnums: true,
    generateUnionEnums: true,
    extractRequestParams: true,
    moduleNameFirstTag: true, // use Swagger tags to name service module files
    sortRoutes: true,
    createApiInstance: true,
    output: output && resolve(output),
    cleanOutput: true,
    primitiveTypeConstructs: (struct) => {
      return {
        ...struct,
        /* 
          type conversion: 
            int32 -> number
            int64 -> string 
        */
        integer: {
          int32: (_schema: SchemaDef, parser: SchemaParser) => {
            return parser.config.Ts.Keyword.Number;
          },
          int64: (_schema: SchemaDef, parser: SchemaParser) => {
            return parser.config.Ts.Keyword.String;
          },
          $default: (_schema: SchemaDef, parser: SchemaParser) => {
            return parser.config.Ts.Keyword.Number;
          },
        },
        object: {
          $default: (_schema: SchemaDef, parser: SchemaParser) => {
            return parser.config.Ts.Keyword.Any;
          },
        },
      };
    },
    prettier: {
      ...prettierConfig,
      parser: 'typescript',
    },
    ...otherConfig,
  };

  return await generateApi(params);
}

/**
 * Generate code by choosing a service from a list
 * @param configList the list of services
 * @returns the generated result
 */
export const generateWithPrompt = async function (configList: ServiceConfig[]) {
  const choices = configList.map((item) => ({
    value: item.id,
    name: `${item.id} ${gray(item.name ? `(${item.name})` : '')}`,
  }));

  const service = await select({
    message: 'Which service do you want to generate for?',
    choices,
  });

  // eslint-disable-next-line no-console
  console.info(`${cyan('Generating')} code of ${yellow(service)} service`);
  const serviceConfig = configList.find((item) => item.id === service);
  if (serviceConfig) {
    return await generate(serviceConfig);
  } else {
    throw new Error(`Service ${service} not found`);
  }
};

type SchemaDef = { type?: string; format?: string; name?: string; description?: string };
