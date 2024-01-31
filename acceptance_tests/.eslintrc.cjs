module.exports = {
  extends: ['@datacamp/eslint-config/typescript'],
  overrides: [
    {
      files: ['playwright.config.ts'],
      rules: {
        'filenames/match-exported': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['prettier.config.cjs'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
  root: true,
  rules: {
    'jest/no-done-callback': 'off',
  },
};
