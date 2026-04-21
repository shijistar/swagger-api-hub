module.exports = {
  ...require('@tiny-codes/code-style-all-in-one/prettier/config/index.js'),
  overrides: [
    {
      files: '*.json(c)?',
      options: {
        trailingComma: 'none',
      },
    },
  ],
};
