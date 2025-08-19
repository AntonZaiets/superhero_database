module.exports = {
  extends: ['../.eslintrc.base.cjs', 'airbnb-base', 'plugin:node/recommended'],
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['node'],
  rules: {
    camelcase: 'off',
    'operator-linebreak': ['error', 'none'],
    indent: ['error', 2],
    'object-curly-newline': 'off',
    'node/no-unpublished-import': 'off',
    'node/no-missing-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',

    'import/prefer-default-export': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],

    'no-console': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'implicit-arrow-linebreak': 'off',
    'import/extensions': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.json'],
      },
    },
  },
};
