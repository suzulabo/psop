module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.lint.json',
  },
  settings: {
    react: {
      version: '17.0.1',
    },
  },
  extends: ['plugin:@stencil/recommended', 'prettier', 'prettier/@typescript-eslint'],
  rules: {
    '@stencil/decorators-style': 'off',
    '@stencil/required-jsdoc': 'off',
    '@stencil/strict-boolean-conditions': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    'require-await': 'off',
    '@typescript-eslint/require-await': 'warn',
  },
};
