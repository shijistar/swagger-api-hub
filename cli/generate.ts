import { generateApi } from 'swagger-typescript-api';
import type { GenerateApiParams } from 'swagger-typescript-api';
// @ts-ignore: TS7016 no declaration file
import type { SchemaParser } from 'swagger-typescript-api/src/schema-parser/schema-parser';
import { select } from '@inquirer/prompts';
import { gray, magenta, yellow } from 'colors/safe';
import { camelCase } from 'lodash';
import { resolve } from 'path';
import prettier from 'prettier';
import signale from 'signale';
import { rootDir } from './paths';
import type { ServiceConfig } from './types';

const defaultDataMapping: Required<NonNullable<ServiceConfig['dataTypeMappings']>> = {
  int64: 'BigInt',
  object: 'Record<string, any>',
};
/**
 * Generate code for a swagger service
 * @param config the configuration for code generation
 * @returns the generated result
 */
export async function generate(config: ServiceConfig) {
  const { output = `./src/api/${config.id}`, dataTypeMappings, ...otherConfig } = config;
  // pass empty to let prettier auto detect from process.cwd()
  const prettierConfig = await prettier.resolveConfig('');
  const mappings: typeof defaultDataMapping = {
    ...defaultDataMapping,
    ...dataTypeMappings,
  };
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
    patch: true,
    output: output && resolve(output),
    cleanOutput: true,
    hooks: {
      onFormatRouteName(routeInfo, templateRouteName) {
        if (routeInfo.operationId) {
          // Remove the trailing numbers of route name. If there are still duplicated names in the same module,
          // an increasing number will be appended to the name and a warning message will also be printed.
          return camelCase(routeInfo.operationId).replace(/\d+$/, '');
        }
        return templateRouteName;
      },
    },
    primitiveTypeConstructs: (struct) => {
      return {
        ...struct,
        /* 
          type conversion: 
            int32 -> number
            int64 -> string | BigInt 
        */
        integer: {
          int32: (_schema: SchemaDef, parser: SchemaParser) => {
            return parser.config.Ts.Keyword.Number;
          },
          int64: (_schema: SchemaDef, _parser: SchemaParser) => {
            return mappings.int64;
          },
          $default: (_schema: SchemaDef, parser: SchemaParser) => {
            return parser.config.Ts.Keyword.Number;
          },
        },
        object: {
          $default: (_schema: SchemaDef, _parser: SchemaParser) => {
            return mappings.object;
          },
        },
      };
    },
    prettier: {
      ...prettierConfig,
      // parser: config.toJS ? 'babel' : 'typescript',
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

  // Prompt user to choose a service
  return select({
    message: magenta('Which service do you want to generate?'),
    choices,
  })
    .then((serviceId) => {
      const serviceConfig = configList.find((item) => item.id === serviceId);
      if (serviceConfig) {
        if (!serviceConfig.silent) {
          // eslint-disable-next-line no-console
          console.info(`Generating code for ${yellow(serviceId)} service`);
        }
        return generate(serviceConfig);
      } else {
        signale.fatal(`Service ${yellow(serviceId)} not found`);
        return undefined;
      }
    })
    .catch(() => {
      // Silencing the cancellation error.
      return undefined;
    });
};

type SchemaDef = { type?: string; format?: string; name?: string; description?: string };
