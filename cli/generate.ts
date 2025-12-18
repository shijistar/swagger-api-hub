import { select } from '@inquirer/prompts';
import { gray, magenta, yellow } from 'colors/safe';
import { camelCase, startCase } from 'lodash-es';
import { resolve } from 'path';
import signale from 'signale';
import { generateApi } from 'swagger-typescript-api';
import type { GenerateApiParams } from 'swagger-typescript-api';
// @ts-expect-error: TS7016 no declaration file
import type { SchemaParser } from 'swagger-typescript-api/src/schema-parser/schema-parser';
import { rootDir } from './paths';
import type { ServiceConfig } from './types';

const defaultDataMapping: Required<NonNullable<ServiceConfig['dataTypeMappings']>> = {
  int64: 'bigint',
  object: 'Record<string, any>',
};
/**
 * Generate code for a swagger service
 *
 * @param userConfig the configuration for code generation
 *
 * @returns the generated result
 */
export async function generate(userConfig: ServiceConfig): ReturnType<typeof generateApi> {
  const { output = `./src/api/${userConfig.id}`, dataTypeMappings, ...restConfig } = userConfig;
  const mappings: typeof defaultDataMapping = {
    ...defaultDataMapping,
    ...dataTypeMappings,
  };
  const config: ServiceConfig = {
    modular: true,
    templates: resolve(rootDir, 'templates'),
    httpClientType: 'axios',
    addTagNameToRoute: false,
    singleHttpClient: true,
    httpClientFile: './http-client.ts',
    extractRequestParams: true,
    extractRequestBody: true,
    extractResponseBody: true,
    extractEnums: true,
    generateUnionEnums: true,
    moduleNameFirstTag: true, // use Swagger tags to name service module files
    sortRoutes: true,
    createApiInstance: true,
    patch: true,
    output: output && resolve(output),
    cleanOutput: true,
    ...restConfig,
    // Code formatting is handled by Biome instead of prettier since v13.1.0.
    // To custom the configuration of Biome, please create a `biome.json` file in the project root directory.
    // https://biomejs.dev/docs/configuration
  };
  const configWithFunc: ServiceConfig = {
    ...config,
    hooks: {
      ...config.hooks,
      onFormatRouteName(routeInfo, templateRouteName) {
        let result: string | undefined = templateRouteName;
        if (config.moduleNameFirstTag && routeInfo?.operationId) {
          // 如果一个模块中有重复的路由名（即方法名），会在路由名后面加上递增的数字，但如果开启了模块化，由于同一个模块中不存在重名的，
          // 所以需要去掉路由名的末尾数字，避免数字变化导致变成一个新方法。但假如同一个模块中存在重名的，仍然会强制添加递增数字的，并且会打印警告信息
          // If there are duplicate route names (i.e. method names) in a module, an increasing number will be added to the end
          // of the route name, but if modularization is enabled, there are no duplicate names in the same module, so the number
          // at the end of the route name needs to be removed to avoid the number change causing it to become a new method.
          // However, if there are duplicate names in the same module, an increasing number will still be forcibly added,
          // and a warning message will also be printed
          if (config.addTagNameToRoute && routeInfo.tags?.length) {
            result = camelCase(routeInfo.operationId)
              .replace(/\d+$/, '')
              .replace(/^(.+?)(Using\w+)$/, `$1In${startCase(routeInfo.tags[0]).replace(/\s/g, '')}$2`);
          } else {
            result = camelCase(routeInfo.operationId).replace(/\d+$/, '');
          }
        }
        if (config.hooks?.onFormatRouteName) {
          result = config.hooks.onFormatRouteName(routeInfo, result);
        }
        return result;
      },
    },
    primitiveTypeConstructs: (struct) => {
      const result: typeof struct | undefined = {
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
      if (config.primitiveTypeConstructs) {
        return config.primitiveTypeConstructs(result);
      }
      return result;
    },
  };

  return await generateApi(configWithFunc as GenerateApiParams);
}

/**
 * Generate code by choosing a service from a list
 *
 * @param configList the list of services
 *
 * @returns the generated result
 */
export const generateWithPrompt = async function (
  configList: ServiceConfig[]
): Promise<Awaited<ReturnType<typeof generateApi>> | undefined> {
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

interface SchemaDef {
  type?: string;
  format?: string;
  name?: string;
  description?: string;
}
