module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier'
  ],
  ignorePatterns: ['build', '.eslintrc.cjs', 'node_modules'],
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'react-refresh'],
  rules: {
    'import/no-anonymous-default-export': 'off',
    'import/no-default-export': 'warn',
    'import/no-empty-named-blocks': 'warn',
    'import/no-extraneous-dependencies': 'off',
    'import/no-internal-modules': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-unresolved': 'error',
    'import/no-useless-path-segments': ['warn', {
      noUselessIndex: true,
    }],
    'import/order': ['warn', {
      alphabetize: { caseInsensitive: true, order: 'asc', orderImportKind: 'asc' },
      'newlines-between': 'never'
    }],
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': ['warn', {
      allowConstantExport: true
    }],
    'sort-imports': ['warn', {
      'ignoreDeclarationSort': true,
    }],
    '@typescript-eslint/no-unused-vars': ['error', { 'ignoreRestSiblings': true }]
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    },
    react: {
      pragma: 'React',
      version: 'detect'
    }
  }
}
