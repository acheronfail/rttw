module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
  ],
  plugins: ['import', 'react', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 1,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-empty-function': 0,
    'prefer-rest-params': 0,
    'jest/no-export': 0,
    strict: 2,
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'internal', 'index'],
        alphabetize: { order: 'asc' },
      },
    ],
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'import/no-extraneous-dependencies': ['error'],
  },
};
