module.exports = {
  extends: ['@datacamp/eslint-config/typescript'],
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
    'import/prefer-default-export': 'off',
  },
};
