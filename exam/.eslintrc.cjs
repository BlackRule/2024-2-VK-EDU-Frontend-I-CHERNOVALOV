//todo sort scss props
const {resolve} = require('node:path')
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  globals: {
    React: 'readonly',
  },
  overrides: [
    {
      files: ['*.json'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
        'comma-dangle': ['error', 'never'],
        quotes: ['warn', 'double'],
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    createDefaultProgram: true,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks','typescript-sort-keys','sort-keys-fix'],
  root: true,
  rules: {
    '@typescript-eslint/ban-ts-comment':'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            group: 'sibling',
            pattern: './**/*.scss',
            position: 'after',
          },
        ],
      },
    ],
    indent: ['warn', 2],
    'no-console': 'warn',
    'no-undef': ['error',],
    'no-unused-vars': 'warn',
    quotes: ['warn', 'single'],
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    semi: ['warn', 'never'],
    'sort-keys-fix/sort-keys-fix': ['warn', 'asc', {'natural': false}],
    'typescript-sort-keys/interface': 'warn',
    'typescript-sort-keys/string-enum': 'warn'
  },
  settings: {
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.scss', '.svg', '.png', '.jpg'],
    },
    'import/resolver': {
      typescript: {
        project: resolve('./tsconfig.app.json'),
      }
    },
    react: {
      version: 'detect',
    },
  },
}