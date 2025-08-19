module.exports = {
  extends: [
    '../.eslintrc.base.cjs',
    'airbnb',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  env: {
    browser: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  rules: {
    'operator-linebreak': ['error', 'none'],
    indent: ['error', 2],
    'object-curly-newline': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'import/no-cycle': 'off',
    'implicit-arrow-linebreak': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],

    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.js',
          '**/*.test.jsx',
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/test/**',
          '**/tests/**',
          '**/*.config.js',
          '**/*.config.ts',
        ],
      },
    ],

    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',

    'no-console': 'warn',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',

    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        controlComponents: ['Field', 'TextField', 'TextareaField'],
        assert: 'either',
      },
    ],

    'linebreak-style': 'off',

    'import/no-unresolved': [
      'error',
      {
        ignore: ['^@/'],
      },
    ],
  },
};
