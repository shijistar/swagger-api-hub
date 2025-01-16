import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/lib', '**/es', 'src/api', '**/.eslintrc.js'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:prettier/recommended'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'commonjs',

      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },

    rules: {
      'array-callback-return': ['error'], // Enforce return statements in callbacks of array methods
      'no-constructor-return': ['error'], // Disallow returning value in constructor
      'no-promise-executor-return': ['error'], // Disallow returning values from Promise executor
      'no-template-curly-in-string': ['error'], // Disallow template literal placeholder syntax in regular strings
      'require-atomic-updates': ['error'], // Disallow assignments that can lead to race conditions due to usage of await or yield
      'no-self-compare': ['error'], // Disallow self compare
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Disallow the use of console, except for warn and error
      'no-await-in-loop': ['warn'], // Disallow await inside of loops
      'no-unmodified-loop-condition': ['warn'], // Disallow unmodified loop conditions
      'no-use-before-define': 'off', // Turn off this rule as @typescript-eslint also has this rule
      eqeqeq: ['error', 'always', { null: 'ignore' }], // Enforce the use of === and !==, but allow (==null)

      '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none' }], // Disallow unused variables
      '@typescript-eslint/no-inferrable-types': ['off'], // Disallow obvious type redundancies
      '@typescript-eslint/consistent-type-imports': ['error'], // Enforce consistent import style
      '@typescript-eslint/ban-tslint-comment': ['error'], // Disallow TSLint comments
      '@typescript-eslint/class-literal-property-style': ['error'], // Enforce class members to use equals assignment
      '@typescript-eslint/consistent-type-assertions': ['error'], // Enforce consistent type assertion style
      '@typescript-eslint/no-misused-new': ['off'],
      '@typescript-eslint/consistent-type-exports': [
        // Enforce consistent export style
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: false,
        },
      ],
      '@typescript-eslint/ban-ts-comment': [
        // Disallow TSLint comments, with a few exceptions
        'error',
        {
          'ts-expect-error': { descriptionFormat: '^: TS\\d+ (?:because\\s).+$' },
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: 4,
        },
      ],
      '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true, fixToUnknown: true }], // Disallow explicit use of any type
      '@typescript-eslint/no-non-null-assertion': 'off', // Turn off the rule "Disallow non-null assertion"
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: true,
          variables: true,
          allowNamedExports: false,
          enums: true,
          typedefs: false,
          // ignoreTypeReferences: true,
        },
      ], // Disallow the use of variables before they are defined
    },
  },
];
