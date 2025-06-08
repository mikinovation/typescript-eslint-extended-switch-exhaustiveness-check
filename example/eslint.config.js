import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import extendedSwitchExhaustiveness from 'typescript-eslint-extended-switch-exhaustiveness';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'extended-switch-exhaustiveness': extendedSwitchExhaustiveness,
    },
    rules: {
      'extended-switch-exhaustiveness/extended-switch-exhaustiveness-check': 'error',
    },
  },
];
