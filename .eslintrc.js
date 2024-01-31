module.exports = {
  extends: ['@datacamp/eslint-config/typescript'],
  ignorePatterns: ['acceptance_tests'],
  overrides: [
    {
      files: [
        'pages/**/*.ts',
        'pages/**/*.tsx',
        'pages/**/*.js',
        'pages/**/*.jsx',
        'next.config.js',
      ],
      rules: {
        'filenames/match-exported': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.jsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    camelcase: 'off',
    'import/prefer-default-export': 'off',
  },
};
